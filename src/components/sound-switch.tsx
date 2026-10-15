import { useIntlayer } from "react-intlayer";
import { VolumeCross } from "reicon-react/icons/VolumeCross";
import { VolumeHigh } from "reicon-react/icons/VolumeHigh";

import { Kbd } from "@/components/ui/kbd";
import { setSoundMuted, useSoundMuted } from "@/components/ui/sound";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SHORTCUT_KEYS, keyLabel } from "@/constants/shortcuts";

/**
 * Mutes or unmutes the interface sounds (shortcut registered by KeyboardShortcutsProvider). Unstyled beyond the
 * icon: the footer renders it as a subtle icon button with a tooltip (inside
 * the footer's shared TooltipProvider), the account popover like its theme
 * toggle with a native title.
 */
export const SoundSwitch = ({
  className,
  iconClassName = "size-4",
  tooltip = false,
}: {
  className: string;
  iconClassName?: string;
  /** Shows a tooltip with the shortcut; needs a TooltipProvider above. */
  tooltip?: boolean;
}) => {
  const content = useIntlayer("command-menu");
  const muted = useSoundMuted();
  const label = muted ? content.unmuteSounds.value : content.muteSounds.value;
  const Icon = muted ? VolumeCross : VolumeHigh;
  const shortcut = keyLabel(SHORTCUT_KEYS.sounds);
  const button = (
    <button
      type="button"
      aria-label={label}
      title={tooltip ? undefined : `${label} (${shortcut})`}
      aria-keyshortcuts={shortcut}
      aria-pressed={muted}
      onClick={() => setSoundMuted(!muted)}
      className={className}
    >
      <Icon aria-hidden="true" className={iconClassName} />
    </button>
  );
  if (!tooltip) {
    return button;
  }
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="top">
        {label} <Kbd>{shortcut}</Kbd>
      </TooltipContent>
    </Tooltip>
  );
};
