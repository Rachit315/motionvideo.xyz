import { useIntlayer } from "react-intlayer";
import { Moon } from "reicon-react/icons/Moon";
import { Sun } from "reicon-react/icons/Sun";

import { buttonVariants } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHORTCUT_KEYS, keyLabel } from "@/constants/shortcuts";
import { track } from "@/lib/analytics";
import { THEME_KEY, setThemeColor } from "@/lib/theme";

export const toggleTheme = () => {
  const dark = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", dark);
  setThemeColor(dark);
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  track("theme_toggle", { theme: dark ? "dark" : "light" });
};

// Renders a tooltip; place it inside a TooltipProvider (the footer's).
export const ThemeToggle = () => {
  const content = useIntlayer("theme-toggle");
  const shortcut = keyLabel(SHORTCUT_KEYS.theme);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={content.toggleTheme.value}
            aria-keyshortcuts={shortcut}
            className={buttonVariants({ size: "icon", variant: "subtle" })}
          />
        }
        onClick={toggleTheme}
      >
        <Sun
          aria-hidden="true"
          className="size-[18px] transition-transform duration-300 ease-out motion-reduce:transition-none dark:hidden"
        />
        <Moon
          aria-hidden="true"
          className="hidden size-[18px] transition-transform duration-300 ease-out motion-reduce:transition-none dark:block"
        />
      </TooltipTrigger>
      <TooltipContent side="top">
        {content.toggleTheme} <Kbd>{shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};
