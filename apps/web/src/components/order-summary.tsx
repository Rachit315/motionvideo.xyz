import type { ReactNode } from "react";

/**
 * The order review above Checkout on the paid forms (sponsorship, job post):
 * the plan and its terms with the price, what is due today, and the account
 * it is for.
 */
export const OrderSummary = ({
  item,
  terms,
  price,
  dueLabel,
  due,
  signedInLabel,
  email,
}: {
  item: ReactNode;
  terms: ReactNode;
  price: ReactNode;
  dueLabel: ReactNode;
  due: ReactNode;
  signedInLabel: ReactNode;
  email: string;
}) => (
  <dl className="bg-card shadow-outline divide-border flex flex-col divide-y overflow-hidden rounded-xl text-sm">
    <div className="flex items-start justify-between gap-4 p-4">
      <dt className="flex flex-col gap-0.5">
        <span className="font-medium">{item}</span>
        <span className="text-muted-foreground">{terms}</span>
      </dt>
      <dd className="tabular-nums">{price}</dd>
    </div>
    <div className="bg-muted/60 flex items-center justify-between gap-4 p-4 font-medium">
      <dt>{dueLabel}</dt>
      <dd className="tabular-nums">{due}</dd>
    </div>
    <div className="text-muted-foreground flex items-center justify-between gap-4 p-4 text-xs">
      <dt>{signedInLabel}</dt>
      <dd className="truncate">{email}</dd>
    </div>
  </dl>
);
