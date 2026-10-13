import { Link } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";

import { Logomark } from "@/components/logomark";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";

export const Brand = () => {
  const content = useIntlayer("brand-menu");
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          />
        }
      >
        <Logomark className="h-4 w-auto" />
        {SITE.NAME}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem render={<Link to={ROUTES.BRAND} />}>
          {content.openBrand}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          render={
            <a
              href="/brand/motionvideo-logomark-black.svg"
              download
              aria-label={content.logomarkSvg.value}
            />
          }
        >
          {content.logomarkSvg}
        </ContextMenuItem>
        <ContextMenuItem
          render={
            <a
              href="/brand/motionvideo-logomark-black.png"
              download
              aria-label={content.logomarkPng.value}
            />
          }
        >
          {content.logomarkPng}
        </ContextMenuItem>
        <ContextMenuItem
          render={
            <a
              href="/brand/motionvideo-app-icon-512.png"
              download
              aria-label={content.appIconPng.value}
            />
          }
        >
          {content.appIconPng}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
