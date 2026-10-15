import { cn } from "@/lib/utils";
import type { JobListing } from "@/server/job-functions";

/** A job's company logo, or its initial on a muted tile. */
export const CompanyLogo = ({
  job,
  className,
}: {
  job: Pick<JobListing, "company" | "logo">;
  className: string;
}) => (
  <span
    className={cn(
      "bg-background shadow-outline dark:bg-popover flex shrink-0 items-center justify-center overflow-hidden",
      className
    )}
  >
    {job.logo ? (
      <img
        src={job.logo}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="size-full object-contain p-1"
      />
    ) : (
      <span aria-hidden="true" className="text-sm font-semibold">
        {job.company.slice(0, 1).toUpperCase()}
      </span>
    )}
  </span>
);
