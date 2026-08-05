import { View, StyleSheet } from "react-native";
import { COLS } from "../game/constants";
import type { Snake } from "../game/snake";
import { useTheme } from "../theme-context";

type Props = {
  snake: Snake;
  food: { x: number; y: number };
  frame: number;
  boardSize: number;
};

export function GameBoard({ snake, food, frame, boardSize }: Props) {
  const { colors } = useTheme();
  const cell = boardSize / COLS;

  return (
    <View style={[styles.grid, { width: boardSize, height: boardSize }]}>
      {snake.body.map((part, i) => (
        <View
          key={`s-${frame}-${i}-${part.x}-${part.y}`}
          style={{
            position: "absolute",
            left: part.x * cell,
            top: part.y * cell,
            width: cell,
            height: cell,
            backgroundColor: colors.button,
          }}
        />
      ))}
      <View
        key={`f-${frame}-${food.x}-${food.y}`}
        style={{
          position: "absolute",
          left: food.x * cell,
          top: food.y * cell,
          width: cell,
          height: cell,
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
