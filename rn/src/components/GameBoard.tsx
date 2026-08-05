import { View, StyleSheet } from "react-native";
import { BOARD, RES } from "../game/constants";
import type { Snake } from "../game/snake";
import { useTheme } from "../theme-context";

type Props = {
  snake: Snake;
  food: { x: number; y: number };
};

export function GameBoard({ snake, food }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.grid, { width: BOARD, height: BOARD }]}>
      {snake.body.map((part, i) => (
        <View
          key={`s-${i}-${part.x}-${part.y}`}
          style={{
            position: "absolute",
            left: part.x * RES,
            top: part.y * RES,
            width: RES,
            height: RES,
            backgroundColor: colors.button,
          }}
        />
      ))}
      <View
        style={{
          position: "absolute",
          left: food.x * RES,
          top: food.y * RES,
          width: RES,
          height: RES,
          backgroundColor: "#ff0000",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    position: "relative",
  },
});
