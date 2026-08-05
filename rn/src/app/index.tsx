import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme-context";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { Menu } from "../components/Menu";
import { GameBoard } from "../components/GameBoard";

export default function Index() {
  const { colors, space } = useTheme();
  const { state, snake, food, startGame } = useSnakeGame();

  return (
    <View style={[styles.page, { backgroundColor: colors.page }]}>
      <View
        style={[
          styles.board,
          {
            width: space.board,
            height: space.board,
            backgroundColor: colors.board,
            overflow: "hidden",
          },
        ]}
      >
        {state === "menu" || !snake || !food ? (
          <Menu onStart={startGame} />
        ) : (
          <GameBoard snake={snake} food={food} />
        )}
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
});
