import { Joystick } from "./Joystick";
import type { Dir } from "../hooks/useSnakeGame";

type Props = {
  onDirection: (x: number, y: number) => void;
  onRelease?: () => void;
  enabled?: boolean;
  activeDir?: Dir | null;
};

export function Controls({
  onDirection,
  onRelease,
  enabled = true,
  activeDir = null,
}: Props) {
  return (
    <Joystick
      enabled={enabled}
      activeDir={activeDir}
      onDirection={(x, y) => {
        if (!enabled) return;
        onDirection(x, y);
      }}
      onRelease={() => {
        if (!enabled) return;
        onRelease?.();
      }}
    />
  );
}
