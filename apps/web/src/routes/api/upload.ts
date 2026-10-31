import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { z } from "zod";

import {
  UPLOAD_MAX_BYTES,
  UPLOAD_PATH_PREFIX,
  UPLOAD_PURPOSES,
} from "@/lib/uploads";
import { getAuth } from "@/server/auth";

// Image types accepted, recognised by their leading bytes (never by the
// client's claimed type or extension). No SVG: it can carry script.
const SIGNATURES = [
  { ext: "png", type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: "jpg", type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  // RIFF....WEBP: checked at offsets 0 and 8.
  { ext: "webp", type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
] as const;

const sniff = (head: Uint8Array) =>
  SIGNATURES.find(
    (signature) =>
      signature.bytes.every((byte, index) => head[index] === byte) &&
      (signature.ext !== "webp" ||
        new TextDecoder().decode(head.slice(8, 12)) === "WEBP")
  );

const purposeSchema = z.enum(UPLOAD_PURPOSES);

/**
 * POST multipart `file` + `purpose` (logo | cover). Signed-in accounts only.
 * Returns `{ path }`: the public asset URL in production, else a same-origin
 * path the Worker serves.
 */
export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await getAuth().api.getSession({
          headers: request.headers,
        });
        if (!session) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }
        // Per IP, so new accounts can't be used to fill the bucket.
        const ip = request.headers.get("cf-connecting-ip") ?? session.user.id;
        const limit = await env.UPLOAD_LIMITER?.limit({ key: ip });
        if (limit && !limit.success) {
          return Response.json({ error: "rate-limit" }, { status: 429 });
        }
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "invalid" }, { status: 400 });
        }
        const purpose = purposeSchema.safeParse(form.get("purpose"));
        const file = form.get("file");
        if (!purpose.success || !(file instanceof File)) {
          return Response.json({ error: "invalid" }, { status: 400 });
        }
        if (file.size === 0 || file.size > UPLOAD_MAX_BYTES[purpose.data]) {
          return Response.json({ error: "size" }, { status: 413 });
        }
        const body = new Uint8Array(await file.arrayBuffer());
        const kind = sniff(body.slice(0, 12));
        if (!kind) {
          return Response.json({ error: "type" }, { status: 415 });
        }
        const key = `uploads/${purpose.data}/${crypto.randomUUID()}.${kind.ext}`;
        await env.UPLOADS.put(key, body, {
          httpMetadata: {
            contentType: kind.type,
            cacheControl: "public, max-age=31536000, immutable",
          },
          customMetadata: { userId: session.user.id },
        });
        // Production links the bucket's public domain (edge-cached, no
        // Worker or R2 read per view); elsewhere the Worker serves the path.
        const path = `${UPLOAD_PATH_PREFIX}${key.slice("uploads/".length)}`;
        return Response.json({
          path: env.UPLOADS_PUBLIC_URL
            ? `${env.UPLOADS_PUBLIC_URL}${path}`
            : path,
        });
      },
    },
  },
});
