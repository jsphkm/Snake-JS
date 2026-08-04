import { Text, View, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useTheme } from "../theme-context";

export default function Index() {
  const { colors, typography, space } = useTheme();
  const [screen, setScreen] = useState<"menu" | "playing">("menu");

  return (
    <View style={[styles.page, { backgroundColor: colors.page }]}>
      <View
        style={[
          styles.board,
          {
            width: space.board,
            height: space.board,
            backgroundColor: colors.board,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => setScreen("playing")}
          style={({ pressed, hovered }) => [
            styles.button,
            {
              width: space.buttonW,
              height: space.buttonH,
              backgroundColor: pressed
                ? colors.buttonPressed
                : colors.button,
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
            New Game
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
});
