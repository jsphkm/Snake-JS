import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme-context";
import { Joystick } from "./Joystick";
import type { Dir } from "../hooks/useSnakeGame";

type Props = {
  onDirection: (x: number, y: number) => void;
  onRelease?: () => void;
  enabled?: boolean;
  activeDir?: Dir | null;
};

function isActive(activeDir: Dir | null | undefined, x: number, y: number) {
  return !!activeDir && activeDir.x === x && activeDir.y === y;
}

export function Controls({
  onDirection,
  onRelease,
  enabled = true,
  activeDir = null,
}: Props) {
  const { colors, typography } = useTheme();

  const pressIn = (x: number, y: number) => {
    if (!enabled) return;
    onDirection(x, y);
  };

  const pressOut = () => {
    if (!enabled) return;
    onRelease?.();
  };

  if (Platform.OS !== "web") {
    return (
      <Joystick
        enabled={enabled}
        activeDir={activeDir}
        onDirection={pressIn}
        onRelease={pressOut}
      />
    );
  }

  const btn = (label: string, x: number, y: number) => {
    const on = enabled && isActive(activeDir, x, y);
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: on, disabled: !enabled }}
        disabled={!enabled}
        onPressIn={() => pressIn(x, y)}
        onPressOut={pressOut}
        style={[
          styles.btn,
          {
            backgroundColor: on ? colors.buttonPressed : colors.button,
            opacity: enabled ? 1 : 0.4,
            transform: [{ scale: on ? 1.08 : 1 }],
          },
        ]}
      >
        <Text
          style={{
            color: colors.buttonLabel,
            fontFamily: typography.fontFamily,
            fontSize: on ? typography.body + 2 : typography.body,
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>{btn("↑", 0, -1)}</View>
      <View style={styles.row}>
        {btn("←", -1, 0)}
        {btn("↓", 0, 1)}
        {btn("→", 1, 0)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
