import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { Lock } from "reicon-react/icons/Lock";

import { CopyIcon } from "@/components/copy-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { PLAN_PRICE_CENTS } from "@/constants/plans";
import { formatUsd } from "@/constants/pricing";
import { ROUTES } from "@/constants/routes";
import { useTransientStatus } from "@/hooks/use-transient-status";
import type { Move, MovePrompt } from "@/lib/moves";

// `**bold**` and `code` inside a line of move text.
const inline = (text: string): ReactNode[] =>
  text.split(/(?<token>\*\*[^*]+\*\*|`[^`]+`)/u).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // oxlint-disable-next-line no-array-index-key
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        // oxlint-disable-next-line no-array-index-key
        <code
          key={index}
          className="bg-muted rounded px-1 font-mono text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });

/**
 * A move's body: blank-line separated paragraphs and `- ` lists, with bold
 * and inline code. Written by us (src/data/moves.json), rendered as React
 * elements, never as HTML.
 */
export const MoveBody = ({ body }: { body: string }) => (
  <div className="flex flex-col gap-4 leading-relaxed">
    {body.split(/\n{2,}/u).map((block, index) => {
      const lines = block.split("\n");
      if (lines.every((line) => line.startsWith("- "))) {
        return (
          // oxlint-disable-next-line no-array-index-key
          <ul key={index} className="flex list-disc flex-col gap-1.5 pl-5">
            {lines.map((line) => (
              <li key={line}>{inline(line.slice(2))}</li>
            ))}
          </ul>
        );
      }
      // oxlint-disable-next-line no-array-index-key
      return <p key={index}>{inline(block)}</p>;
    })}
  </div>
);

/** A card in the /moves grid: example poster (if any), family, name, summary. */
export const MoveCard = ({
  move,
  poster,
}: {
  move: Move;
  poster: string | undefined;
}) => {
  const content = useIntlayer("moves");
  return (
    <Link
      to="/moves/$slug"
      params={{ slug: move.slug }}
      className="group bg-card shadow-outline hover:bg-muted/60 focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl transition-colors outline-none focus-visible:ring-2"
    >
      <span className="bg-muted relative aspect-video overflow-hidden">
        {poster && (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </span>
      <span className="flex flex-col gap-1 p-4">
        <span className="text-muted-foreground text-xs">
          {content.familyLabels[move.family]}
        </span>
        <span className="font-medium tracking-tight">{move.name}</span>
        <span className="text-muted-foreground line-clamp-2 text-sm text-pretty">
          {move.summary}
        </span>
      </span>
    </Link>
  );
};

/** Pro: the copy-ready prompt, its parameters and a copy button. */
export const MovePromptPanel = ({ prompt }: { prompt: MovePrompt }) => {
  const content = useIntlayer("moves");
  const [status, flash] = useTransientStatus<"idle" | "copied" | "failed">(
    "idle"
  );
  return (
    <section
      aria-labelledby="move-prompt"
      className="bg-card shadow-outline flex flex-col gap-4 rounded-xl p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="move-prompt" className="font-medium">
          {content.prompt}
        </h2>
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(prompt.prompt);
              flash("copied");
            } catch {
              flash("failed");
            }
          }}
        >
          <CopyIcon copied={status === "copied"} />
          {status === "copied" ? content.copied : content.copy}
        </Button>
      </div>
      <p className="bg-muted rounded-lg p-4 font-serif text-sm leading-relaxed whitespace-pre-wrap">
        {prompt.prompt}
      </p>
      {prompt.parameters.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{content.parameters}</h3>
          <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
            {prompt.parameters.map((parameter) => (
              <li key={parameter}>{parameter}</li>
            ))}
          </ul>
        </div>
      )}
      <output className="text-muted-foreground text-xs">
        {status === "failed" && content.copyError}
      </output>
    </section>
  );
};

/**
 * Everyone else: what Pro unlocks and how much, without any of the prompt in
 * the page. Signed-out visitors may already be on Pro, so they can sign in.
 */
export const LockedPromptPanel = ({
  signedIn,
  slug,
}: {
  signedIn: boolean;
  slug: string;
}) => {
  const content = useIntlayer("moves");
  return (
    <section
      aria-labelledby="move-prompt"
      className="bg-card shadow-outline flex flex-col items-start gap-4 rounded-xl p-5"
    >
      <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-full">
        <Lock aria-hidden="true" className="size-4" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 id="move-prompt" className="font-medium text-pretty">
          {content.lockedTitle}
        </h2>
        <p className="text-muted-foreground text-sm text-pretty">
          {content.lockedBody}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={ROUTES.PRICING}
          data-track="moves_unlock"
          data-track-move={slug}
          className={buttonVariants({ size: "lg", variant: "gradient" })}
        >
          {content.unlock}
        </Link>
        <span className="text-muted-foreground text-sm">
          {content.priceBefore}
          {formatUsd(PLAN_PRICE_CENTS.pro.monthly ?? 0)}
          {content.priceAfter}
        </span>
      </div>
      {!signedIn && (
        <p className="text-muted-foreground text-sm">
          <Link
            to={ROUTES.SIGN_IN}
            search={{ redirect: `${ROUTES.MOVES}/${slug}` }}
            className="text-foreground underline underline-offset-4"
          >
            {content.signInReason}
          </Link>
        </p>
      )}
    </section>
  );
};
