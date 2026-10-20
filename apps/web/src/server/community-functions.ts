import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { communitySubmissionSchema } from "@/lib/community";
import type {
  SubmissionKind,
  SubmissionResult,
  SubmissionStatus,
} from "@/lib/community";

import { getCurrentSession } from "./auth";
import { communitySubmissions } from "./db/community-schema";

const allowSubmission = async () => {
  const ip = getRequest().headers.get("cf-connecting-ip") ?? "unknown";
  const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
  return success;
};

/** The signed-in account submissions are filed under; `null` when signed out. */
export const getSubmitter = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getCurrentSession();
    return session ? { email: session.user.email } : null;
  }
);

/** A submission filed by the signed-in account, newest first. */
export interface MySubmission {
  id: string;
  kind: SubmissionKind;
  category: string | null;
  title: string;
  url: string;
  description: string;
  status: SubmissionStatus;
  /** The catalog item it became: a video slug or a directory entry id. */
  featuredItemId: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
}

/** The signed-in user's own submissions; `null` when signed out. */
export const getMySubmissions = createServerFn({ method: "GET" }).handler(
  async (): Promise<MySubmission[] | null> => {
    const session = await getCurrentSession();
    if (!session) {
      return null;
    }
    const rows = await drizzle(env.DB)
      .select({
        id: communitySubmissions.id,
        kind: communitySubmissions.kind,
        category: communitySubmissions.category,
        title: communitySubmissions.title,
        url: communitySubmissions.url,
        description: communitySubmissions.description,
        status: communitySubmissions.status,
        featuredItemId: communitySubmissions.featuredItemId,
        createdAt: communitySubmissions.createdAt,
        reviewedAt: communitySubmissions.reviewedAt,
      })
      .from(communitySubmissions)
      .where(eq(communitySubmissions.email, session.user.email))
      .orderBy(desc(communitySubmissions.createdAt));
    return rows;
  }
);

export const submitCommunityEntry = createServerFn({ method: "POST" })
  .validator(communitySubmissionSchema)
  .handler(async ({ data }): Promise<SubmissionResult> => {
    const session = await getCurrentSession();
    if (!session) {
      return { ok: false, error: "unauthorized" };
    }
    if (!(await allowSubmission())) {
      return { ok: false, error: "rate-limit" };
    }
    try {
      const now = new Date();
      await drizzle(env.DB)
        .insert(communitySubmissions)
        .values({
          id: crypto.randomUUID(),
          kind: data.kind,
          category: data.category ?? null,
          name: data.name,
          email: session.user.email,
          title: data.title,
          url: data.url,
          description: data.description,
          prompt: data.kind === "video" && data.prompt ? data.prompt : null,
          attributionConsentAt: now,
          createdAt: now,
          status: "pending",
        })
        .run();
      return { ok: true };
    } catch {
      return { ok: false, error: "storage" };
    }
  });
