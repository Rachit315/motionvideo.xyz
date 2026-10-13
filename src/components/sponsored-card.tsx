import { cn } from "cn";
import { useEffect, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { ArrowRightUp } from "reicon-react/icons/ArrowRightUp";

import { SPONSORS } from "@/constants/sponsors";
import { withUtm } from "@/lib/utm";

// How long each sponsor stays on the card before fading to the next.
const ROTATE_MS = 6000;

/**
 * A sponsored tile for the gallery grid: each Diamond sponsor's cover fades
 * into the next on a timer, with a progress hairline along the bottom edge.
 * The whole card links straight to the showing sponsor.
 */
export const SponsoredCard = () => {
  const content = useIntlayer("motion-gallery");
  const sponsors = SPONSORS.filter((sponsor) => sponsor.tier === "diamond");
  const [active, setActive] = useState(0);
  const sponsor = sponsors[active % sponsors.length];

  useEffect(() => {
    if (sponsors.length < 2) {
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % sponsors.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [sponsors.length]);

  if (!sponsor) {
    return null;
  }

  return (
    <a
      href={withUtm(sponsor.url, "grid")}
      target="_blank"
      rel="sponsored noopener"
      aria-label={`${sponsor.name} (${content.sponsored.value})`}
      className="group focus-visible:ring-ring shadow-outline relative block aspect-video overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {sponsors.map((entry, index) => (
        <img
          key={entry.name}
          src={entry.cover}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          aria-hidden={index === active ? undefined : true}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
            index === active ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <span className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {content.sponsored}
        </span>
        <ArrowRightUp
          aria-hidden="true"
          className="size-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/70 to-transparent p-2.5 pt-6">
        <span
          key={sponsor.name}
          className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 shadow-sm"
        >
          <img
            src={sponsor.logo}
            alt=""
            width={28}
            height={28}
            loading="lazy"
            decoding="async"
            className="size-full object-contain"
          />
        </span>
        <span className="truncate text-sm font-medium tracking-tight text-white">
          {sponsor.name}
        </span>
      </span>
      {sponsors.length > 1 && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20 motion-reduce:hidden"
        >
          <span
            key={active}
            className="animate-mv-rotate block h-full bg-white/90"
          />
        </span>
      )}
    </a>
  );
};
