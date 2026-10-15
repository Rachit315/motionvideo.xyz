import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { z } from "zod";

import {
  UPLOAD_MAX_BYTES,
  UPLOAD_PATH_PREFIX,
  UPLOAD_PURPOSES,
} from "@/lib/uploads";
import { auth } from "@/server/auth";

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
 * Returns `{ path }`, served by the Worker at that path.
 */
export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
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
        return Response.json({
          path: `${UPLOAD_PATH_PREFIX}${key.slice("uploads/".length)}`,
        });
      },
    },
  },
});
