import { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme-context";
import type { Dir } from "../hooks/useSnakeGame";

const BASE_SIZE = 140;
const KNOB_SIZE = 56;
const MAX_RADIUS = (BASE_SIZE - KNOB_SIZE) / 2;
const DEAD_ZONE = 12;

type Props = {
  onDirection: (x: number, y: number) => void;
  onRelease?: () => void;
  enabled?: boolean;
  activeDir?: Dir | null;
};

function toCardinal(dx: number, dy: number): Dir | null {
  const dist = Math.hypot(dx, dy);
  if (dist < DEAD_ZONE) return null;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return { x: dx > 0 ? 1 : -1, y: 0 };
  }
  return { x: 0, y: dy > 0 ? 1 : -1 };
}

function dirKey(dir: Dir | null | undefined): string | null {
  if (!dir) return null;
  if (dir.x === -1) return "left";
  if (dir.x === 1) return "right";
  if (dir.y === -1) return "up";
  if (dir.y === 1) return "down";
  return null;
}

export function Joystick({
  onDirection,
  onRelease,
  enabled = true,
  activeDir = null,
}: Props) {
  const { colors, typography } = useTheme();
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const lastDir = useRef<Dir | null>(null);
  const onDirectionRef = useRef(onDirection);
  const onReleaseRef = useRef(onRelease);
  const enabledRef = useRef(enabled);
  onDirectionRef.current = onDirection;
  onReleaseRef.current = onRelease;
  enabledRef.current = enabled;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => enabledRef.current,
        onMoveShouldSetPanResponder: () => enabledRef.current,
        onPanResponderGrant: () => {
          if (!enabledRef.current) return;
          setKnob({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, gesture) => {
          if (!enabledRef.current) return;
          let dx = gesture.dx;
          let dy = gesture.dy;
          const dist = Math.hypot(dx, dy);
          if (dist > MAX_RADIUS && dist > 0) {
            dx = (dx / dist) * MAX_RADIUS;
            dy = (dy / dist) * MAX_RADIUS;
          }
          setKnob({ x: dx, y: dy });

          const dir = toCardinal(dx, dy);
          if (!dir) return;
          const prev = lastDir.current;
          if (!prev || prev.x !== dir.x || prev.y !== dir.y) {
            lastDir.current = dir;
            onDirectionRef.current(dir.x, dir.y);
          }
        },
        onPanResponderRelease: () => {
          setKnob({ x: 0, y: 0 });
          onReleaseRef.current?.();
        },
        onPanResponderTerminate: () => {
          setKnob({ x: 0, y: 0 });
          onReleaseRef.current?.();
        },
      }),
    []
  );

  const active = dirKey(activeDir);

  const marker = (key: string, label: string, style: object) => {
    const on = enabled && active === key;
    return (
      <Text
        pointerEvents="none"
        style={[
          styles.marker,
          style,
          {
            color: on ? colors.button : colors.hint,
            fontFamily: typography.fontFamily,
            opacity: on ? 1 : 0.4,
          },
        ]}
      >
        {label}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.board, opacity: enabled ? 1 : 0.45 },
      ]}
      {...panResponder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityState={{ disabled: !enabled }}
      accessibilityLabel="Direction joystick"
      accessibilityHint="Drag to steer the snake"
      accessibilityValue={{
        text: active ? `Going ${active}` : "No direction",
      }}
    >
      {marker("up", "↑", styles.up)}
      {marker("down", "↓", styles.down)}
      {marker("left", "←", styles.left)}
      {marker("right", "→", styles.right)}
      <View
        pointerEvents="none"
        style={[
          styles.knob,
          {
            backgroundColor: colors.button,
            transform: [{ translateX: knob.x }, { translateY: knob.y }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: BASE_SIZE,
    height: BASE_SIZE,
    borderRadius: BASE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    overflow: "hidden",
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
  },
  marker: {
    position: "absolute",
    fontSize: 16,
    width: 24,
    textAlign: "center",
  },
  up: {
    top: 8,
    alignSelf: "center",
  },
  down: {
    bottom: 8,
    alignSelf: "center",
  },
  left: {
    left: 10,
    top: "50%",
    marginTop: -10,
  },
  right: {
    right: 10,
    top: "50%",
    marginTop: -10,
  },
});
