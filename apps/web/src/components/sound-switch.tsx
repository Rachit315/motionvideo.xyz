import type { ReactNode } from "react";
import { useIntlayer } from "react-intlayer";
import { VolumeCross } from "reicon-react/icons/VolumeCross";
import { VolumeHigh } from "reicon-react/icons/VolumeHigh";

import { Kbd } from "@/components/ui/kbd";
import { setSoundMuted, useSoundMuted } from "@/components/ui/sound";
import { TooltipTrigger } from "@/components/ui/tooltip";
import type { TooltipHandle } from "@/components/ui/tooltip";
import { SHORTCUT_KEYS, keyLabel } from "@/constants/shortcuts";

/**
 * Mutes or unmutes the interface sounds (shortcut registered by
 * KeyboardShortcutsProvider). Unstyled beyond the icon: the footer renders it
 * as a subtle icon button with a tooltip (inside the footer's shared
 * TooltipProvider); without a tooltip it falls back to a native title. The
 * account popover uses a whole-row menu item instead.
 */
export const SoundSwitch = ({
  className,
  iconClassName = "size-4",
  tooltip,
}: {
  className: string;
  iconClassName?: string;
  /** The shared tooltip of its button group; without one, a native title. */
  tooltip?: TooltipHandle<ReactNode>;
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
    <TooltipTrigger
      handle={tooltip}
      // Its label changes on click (Copied, Remove bookmark…): stay open.
      closeOnClick={false}
      payload={
        <>
          {label} <Kbd>{shortcut}</Kbd>
        </>
      }
      render={button}
    />
  );
};
