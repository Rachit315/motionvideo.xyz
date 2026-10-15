import {
  Link,
  createFileRoute,
  getRouteApi,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import catalog from "@/data/motion-catalog.json";
import { SUBMISSION_KINDS, SUBMISSION_STATUSES } from "@/lib/community";
import type { SubmissionKind, SubmissionStatus } from "@/lib/community";
import { DIRECTORY_ENTRIES } from "@/lib/directories";
import type { DirectoryKind } from "@/lib/directories";
import type { AdminSubmission } from "@/server/submission-admin-functions";
import {
  listSubmissions,
  reviewSubmission,
} from "@/server/submission-admin-functions";

const routeApi = getRouteApi("/admin/submissions");

interface SubmissionsSearch {
  /** Omitted for the default, pending. */
  status?: Exclude<SubmissionStatus, "pending">;
}

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  pending: "Pending",
  featured: "Featured",
  declined: "Declined",
};

// Trailing slashes and letter case vary between a submitted URL and the
// catalog's copy of the same page.
const normalizeUrl = (url: string) =>
  url.trim().replace(/\/+$/u, "").toLowerCase();

interface CatalogItem {
  id: string;
  label: string;
  /** Normalized URLs that identify the item, for prefilling the likely match. */
  urls: string[];
}

const entryItems = (kind: DirectoryKind): CatalogItem[] =>
  DIRECTORY_ENTRIES[kind].map((entry) => ({
    id: entry.id,
    label: entry.name,
    urls: [normalizeUrl(entry.url)],
  }));

// The catalog items a submission of each kind can be featured as.
const ITEMS: Record<SubmissionKind, CatalogItem[]> = {
  video: catalog.videos.map((video) => ({
    id: video.slug,
    label: video.title,
    urls: video.tweetUrl ? [normalizeUrl(video.tweetUrl)] : [],
  })),
  tool: entryItems("tool"),
  studio: entryItems("studio"),
  skill: entryItems("skill"),
  extra: entryItems("extra"),
};

const SubmissionReview = ({ submission }: { submission: AdminSubmission }) => {
  const router = useRouter();
  const [itemId, setItemId] = useState(() => {
    if (submission.featuredItemId) {
      return submission.featuredItemId;
    }
    const url = normalizeUrl(submission.url);
    return (
      ITEMS[submission.kind].find((item) => item.urls.includes(url))?.id ?? ""
    );
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const review = async (
    data: Parameters<typeof reviewSubmission>[0]["data"]
  ) => {
    setPending(true);
    setError(null);
    try {
      await reviewSubmission({ data });
      await router.invalidate();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error ? reviewError.message : "Review failed"
      );
    }
    setPending(false);
  };

  return (
    <article className="bg-card shadow-outline flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="capitalize">{submission.kind}</Badge>
        {submission.category && (
          <Badge variant="outline">{submission.category}</Badge>
        )}
        <Badge variant="secondary">{STATUS_LABELS[submission.status]}</Badge>
        <time
          dateTime={submission.createdAt.toISOString()}
          className="text-muted-foreground ml-auto text-xs"
        >
          {submission.createdAt.toLocaleString("en", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </time>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          {submission.title}
        </h2>
        <a
          href={submission.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 self-start text-sm break-all underline-offset-4 hover:underline"
        >
          {submission.url}
          <ArrowRightUp aria-hidden="true" className="size-3.5 shrink-0" />
        </a>
      </div>
      <p className="text-sm whitespace-pre-wrap">{submission.description}</p>
      {submission.prompt && (
        <details className="bg-muted/40 rounded-lg px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">Prompt</summary>
          <p className="mt-2 font-mono text-xs whitespace-pre-wrap">
            {submission.prompt}
          </p>
        </details>
      )}
      <p className="text-muted-foreground text-sm">
        By {submission.name} ·{" "}
        <a
          href={`mailto:${submission.email}`}
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          {submission.email}
        </a>
        {submission.featuredItemId && (
          <> · featured as {submission.featuredItemId}</>
        )}
      </p>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void review({ id: submission.id, action: "feature", itemId });
        }}
      >
        <Input
          aria-label={`Catalog ${submission.kind} id`}
          placeholder={submission.kind === "video" ? "Video slug" : "Entry id"}
          list={`admin-items-${submission.kind}`}
          value={itemId}
          onChange={(event) => setItemId(event.target.value)}
          required
          disabled={pending}
          className="w-64 max-w-full"
        />
        <Button type="submit" size="sm" disabled={pending || !itemId.trim()}>
          Feature
        </Button>
        {submission.status !== "declined" && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => review({ id: submission.id, action: "decline" })}
          >
            Decline
          </Button>
        )}
        {submission.status !== "pending" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => review({ id: submission.id, action: "reset" })}
          >
            Reset
          </Button>
        )}
      </form>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </article>
  );
};

const AdminSubmissions = () => {
  const { submissions, counts } = routeApi.useLoaderData();
  const { status = "pending" } = routeApi.useSearch();
  const kinds = SUBMISSION_KINDS.filter((kind) =>
    submissions.some((submission) => submission.kind === kind)
  );

  return (
    <section className="flex flex-col gap-4">
      <nav aria-label="Submission status" className="flex flex-wrap gap-1">
        {SUBMISSION_STATUSES.map((tab) => (
          <Link
            key={tab}
            to={ROUTES.ADMIN_SUBMISSIONS}
            search={tab === "pending" ? {} : { status: tab }}
            aria-current={tab === status ? "page" : undefined}
            className="text-muted-foreground hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground rounded-md px-2.5 py-1 text-sm font-medium transition-colors"
          >
            {STATUS_LABELS[tab]}{" "}
            <span className="text-muted-foreground tabular-nums">
              {counts[tab]}
            </span>
          </Link>
        ))}
      </nav>
      {submissions.length > 0 ? (
        <div className="flex flex-col gap-4">
          {submissions.map((submission) => (
            // Keyed by status too, so a reviewed card resets its form.
            <SubmissionReview
              key={`${submission.id}-${submission.status}`}
              submission={submission}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground bg-muted/40 rounded-2xl p-8 text-center text-sm">
          No {STATUS_LABELS[status].toLowerCase()} submissions.
        </p>
      )}
      {kinds.map((kind) => (
        <datalist key={kind} id={`admin-items-${kind}`}>
          {ITEMS[kind].map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </datalist>
      ))}
    </section>
  );
};

export const Route = createFileRoute("/admin/submissions")({
  component: AdminSubmissions,
  validateSearch: (search): SubmissionsSearch => ({
    status:
      search.status === "featured" || search.status === "declined"
        ? search.status
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ status: search.status }),
  loader: ({ deps }) =>
    listSubmissions({ data: { status: deps.status ?? "pending" } }),
});
