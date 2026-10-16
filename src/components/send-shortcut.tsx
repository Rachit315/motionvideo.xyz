import { Command } from "reicon-react/icons/Command";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useIsMac } from "@/hooks/use-mac";

/**
 * The ⌘/Ctrl + Enter hint beside a form's send button: ⌘ as an icon on Apple
 * platforms, Ctrl elsewhere, then Enter.
 */
export const SendShortcut = ({ enter }: { enter: string }) => {
  const mac = useIsMac();
  return (
    <KbdGroup aria-label={`${mac ? "Command" : "Control"} + ${enter}`}>
      <Kbd>{mac ? <Command aria-hidden="true" /> : "Ctrl"}</Kbd>
      <Kbd>{enter} ↵</Kbd>
    </KbdGroup>
  );
};
