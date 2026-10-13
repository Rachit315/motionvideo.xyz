import { cn } from "cn";
import { useIntlayer } from "react-intlayer";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LINK } from "@/constants/links";

// Stub until the account backend lands: explains the manual path instead of
// deleting anything.
export const DeleteAccountDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const content = useIntlayer("site-header");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.deleteTitle}</DialogTitle>
          <DialogDescription>{content.deleteDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
            {content.cancel}
          </DialogClose>
          <a
            href={`mailto:${LINK.EMAIL}?subject=${encodeURIComponent("Delete my MotionVideo account")}`}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {content.deleteContact}
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
