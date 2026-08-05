import { Text, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../theme-context";

type Props = {
  onStart: () => void;
  label?: string;
};

export function Menu({ onStart, label = "New Game" }: Props) {
  const { colors, typography, space } = useTheme();

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        onPress={onStart}
        style={({ pressed, hovered }) => [
          styles.button,
          {
            width: space.buttonW,
            height: space.buttonH,
            backgroundColor: pressed ? colors.buttonPressed : colors.button,
          },
          hovered && { cursor: "pointer" as const },
        ]}
      >
        <Text
          style={{
            color: colors.buttonLabel,
            fontFamily: typography.fontFamily,
            fontSize: typography.body,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  button: {
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
});
