import type { VariantProps } from "class-variance-authority";
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
import { track } from "@/lib/analytics";
import { useSession } from "@/lib/auth-client";
import { bookmarkKey } from "@/lib/bookmark-items";
import type { BookmarkKind } from "@/lib/bookmark-items";
import { toggleBookmark, useBookmarks } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Saves a video or directory entry to the signed-in user's bookmarks (optimistically). Signed
 * out, it opens the sign-in dialog instead.
 */
export const BookmarkButton = ({
  kind,
  id,
  variant = "outline",
  size = "icon",
  className,
  style,
}: {
  kind: BookmarkKind;
  /** Video slug or directory entry id. */
  id: string;
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  className?: string;
  style?: CSSProperties;
}) => {
  const content = useIntlayer("bookmark-button");
  const session = useSession();
  const signInDialog = useSignInDialog();
  const { keys } = useBookmarks();
  const signedIn = Boolean(session.data);
  const saved = signedIn && keys.has(bookmarkKey(kind, id));
  const label = saved ? content.remove.value : content.add.value;

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Cards wrap their actions in links and hover triggers.
    event.preventDefault();
    event.stopPropagation();
    if (session.isPending) {
      return;
    }
    if (signedIn) {
      track("bookmark_toggle", { kind, id, saved: !saved });
      void toggleBookmark(kind, id);
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
        <Bookmark aria-hidden="true" weight={saved ? "Filled" : "Outline"} />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
