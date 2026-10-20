import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";

import { SponsorSlots } from "@/components/sponsor-slots";
import { SponsoredCard } from "@/components/sponsored-card";
import { Badge } from "@/components/ui/badge";
import type { SponsorTier } from "@/constants/sponsors";

const tile = "bg-muted rounded-xl";

/** One placement: what it is and who gets it, beside the live component in context. */
const Placement = ({
  title,
  body,
  tiers,
  children,
}: {
  title: ReactNode;
  body: ReactNode;
  tiers: readonly SponsorTier[];
  children: ReactNode;
}) => {
  const content = useIntlayer("sponsor");
  return (
    <li className="bg-card shadow-outline grid gap-6 rounded-2xl p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm text-pretty">{body}</p>
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {tiers.map((tier) => (
            <li key={tier}>
              <Badge variant="outline">{content.tiers[tier].name}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-background shadow-outline rounded-xl p-4">
        {children}
      </div>
    </li>
  );
};

/**
 * The two placements a sponsor buys, rendered with the same components (and
 * the same live sponsors) as the gallery: the sponsored grid card and the
 * sponsor slots under a page intro.
 */
export const SponsorPlacements = () => {
  const content = useIntlayer("sponsor");
  return (
    <ul className="flex flex-col gap-3">
      <Placement
        title={content.placementItems.card.title}
        body={content.placementItems.card.body}
        tiers={["diamond", "gold", "silver"]}
      >
        {/* The grid's first row, with the card in the rightmost lane, and
            the top of the next row. */}
        <div className="grid grid-cols-2 gap-3">
          <span aria-hidden="true" className={`${tile} aspect-video`} />
          <SponsoredCard category={undefined} />
          <span
            aria-hidden="true"
            className={`${tile} h-10 rounded-b-none opacity-60`}
          />
          <span
            aria-hidden="true"
            className={`${tile} h-10 rounded-b-none opacity-60`}
          />
        </div>
      </Placement>
      <Placement
        title={content.placementItems.slots.title}
        body={content.placementItems.slots.body}
        tiers={["diamond", "gold"]}
      >
        {/* A page intro: title, description, actions, then the slots. */}
        <div className="flex flex-col gap-3">
          <span aria-hidden="true" className={`${tile} h-5 w-2/5 rounded-md`} />
          <span aria-hidden="true" className={`${tile} h-3 w-4/5 rounded-md`} />
          <span aria-hidden="true" className="flex gap-2">
            <span className={`${tile} h-8 w-24 rounded-lg`} />
            <span className={`${tile} h-8 w-20 rounded-lg`} />
          </span>
          <SponsorSlots category={undefined} />
        </div>
      </Placement>
    </ul>
  );
};
