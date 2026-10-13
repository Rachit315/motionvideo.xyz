import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";
import { Ufo } from "reicon-react/icons/Ufo";

import { SponsorSlots } from "@/components/sponsor-slots";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * The first masonry tile shared by the gallery and the resource directories:
 * heading, intro copy, and the Surprise / Submit actions.
 */
export const CollectionIntro = ({
  titleId,
  title,
  description,
  onSurprise,
  surpriseDisabled,
  surpriseLabel,
  submitLabel,
  submitSearch,
}: {
  titleId: string;
  title: ReactNode;
  description: ReactNode;
  onSurprise: () => void;
  surpriseDisabled?: boolean;
  surpriseLabel: ReactNode;
  submitLabel: ReactNode;
  submitSearch: { kind: string; category?: string };
}) => (
  <section
    aria-labelledby={titleId}
    className="flex flex-col justify-end gap-4 sm:aspect-4/3"
  >
    <header>
      <h1
        id={titleId}
        className="text-2xl leading-tight font-semibold tracking-tight text-balance"
      >
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm leading-tight text-pretty">
        {description}
      </p>
    </header>
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="lg"
        disabled={surpriseDisabled}
        onClick={onSurprise}
      >
        <Ufo aria-hidden="true" />
        {surpriseLabel}
      </Button>
      <Link
        to={ROUTES.SUBMIT}
        // SAFETY: /submit accepts every section kind plus an optional
        // category slug; callers pass their section's kind and slug.
        search={submitSearch as never}
        className={buttonVariants({ variant: "gradient", size: "lg" })}
      >
        {submitLabel}
        <ArrowRightUp aria-hidden="true" />
      </Link>
    </div>
    <SponsorSlots />
  </section>
);
