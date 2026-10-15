import {
  Link,
  createFileRoute,
  getRouteApi,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { FEEDBACK_MOOD_LABELS } from "@/lib/feedback";
import type { FeedbackItem } from "@/server/feedback-functions";
import { listFeedback, resolveFeedback } from "@/server/feedback-functions";

const routeApi = getRouteApi("/admin/feedback");

type FeedbackView = "open" | "resolved";

interface FeedbackSearch {
  /** Omitted for the default, open. */
  view?: "resolved";
}

const VIEW_LABELS: Record<FeedbackView, string> = {
  open: "Open",
  resolved: "Resolved",
};

const FeedbackCard = ({ item }: { item: FeedbackItem }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolved = item.resolvedAt !== null;

  const toggle = async () => {
    setPending(true);
    setError(null);
    try {
      await resolveFeedback({ data: { id: item.id, resolved: !resolved } });
      await router.invalidate();
    } catch (toggleError) {
      setError(
        toggleError instanceof Error ? toggleError.message : "Update failed"
      );
    }
    setPending(false);
  };

  return (
    <article className="bg-card shadow-outline flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        {item.mood && (
          <Badge variant={item.mood === "bad" ? "destructive" : "secondary"}>
            {FEEDBACK_MOOD_LABELS[item.mood]}
          </Badge>
        )}
        <code className="text-muted-foreground text-xs">{item.page}</code>
        <time
          dateTime={item.createdAt.toISOString()}
          className="text-muted-foreground ml-auto text-xs"
        >
          {item.createdAt.toLocaleString("en", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </time>
      </div>
      <p className="text-sm whitespace-pre-wrap">{item.message}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {item.email ? (
            <a
              href={`mailto:${item.email}`}
              className="hover:text-foreground underline underline-offset-4"
            >
              {item.email}
            </a>
          ) : (
            "Anonymous"
          )}
        </p>
        <Button
          size="sm"
          variant={resolved ? "outline" : "default"}
          disabled={pending}
          onClick={toggle}
        >
          {resolved ? "Reopen" : "Mark resolved"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </article>
  );
};

const AdminFeedback = () => {
  const { items, counts } = routeApi.useLoaderData();
  const view: FeedbackView = routeApi.useSearch().view ?? "open";

  return (
    <section className="flex flex-col gap-4">
      <nav aria-label="Feedback status" className="flex flex-wrap gap-1">
        {(["open", "resolved"] as const).map((tab) => (
          <Link
            key={tab}
            to={ROUTES.ADMIN_FEEDBACK}
            search={tab === "open" ? {} : { view: tab }}
            aria-current={tab === view ? "page" : undefined}
            className="text-muted-foreground hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground rounded-md px-2.5 py-1 text-sm font-medium transition-colors"
          >
            {VIEW_LABELS[tab]}{" "}
            <span className="text-muted-foreground tabular-nums">
              {counts[tab]}
            </span>
          </Link>
        ))}
      </nav>
      {items.length > 0 ? (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground bg-muted/40 rounded-2xl p-8 text-center text-sm">
          No {VIEW_LABELS[view].toLowerCase()} feedback.
        </p>
      )}
    </section>
  );
};

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedback,
  validateSearch: (search): FeedbackSearch => ({
    view: search.view === "resolved" ? "resolved" : undefined,
  }),
  loaderDeps: ({ search }) => ({ view: search.view }),
  loader: ({ deps }) => listFeedback({ data: { view: deps.view ?? "open" } }),
});
