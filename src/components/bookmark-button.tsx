import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { CSSProperties, MouseEvent } from "react";
import { useIntlayer } from "react-intlayer";
import { Bookmark } from "reicon-react/icons/Bookmark";

import { useSignInDialog } from "@/components/sign-in-dialog";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { toggleBookmark, useBookmarks } from "@/lib/bookmarks";

type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Saves a video to the signed-in user's bookmarks (optimistically). Signed
 * out, it opens the sign-in dialog instead.
 */
export const BookmarkButton = ({
  slug,
  variant = "outline",
  size = "icon",
  className,
  style,
}: {
  slug: string;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  className?: string;
  style?: CSSProperties;
}) => {
  const content = useIntlayer("bookmark-button");
  const session = useSession();
  const signInDialog = useSignInDialog();
  const { slugs } = useBookmarks();
  const signedIn = Boolean(session.data);
  const saved = signedIn && slugs.has(slug);
  const label = saved ? content.remove.value : content.add.value;

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Cards wrap their actions in links and hover triggers.
    event.preventDefault();
    event.stopPropagation();
    if (session.isPending) {
      return;
    }
    if (signedIn) {
      void toggleBookmark(slug);
    } else {
      signInDialog.open(content.signInReason.value);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        delay={200}
        render={
          <button type="button" aria-label={label} aria-pressed={saved} />
        }
        onClick={onClick}
        className={cn(buttonVariants({ variant, size }), className)}
        style={style}
      >
        <Bookmark aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
