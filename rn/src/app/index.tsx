import { useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "../theme-context";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { Menu } from "../components/Menu";
import { GameBoard } from "../components/GameBoard";
import { Controls } from "../components/Controls";

/** Room for joystick + margins below the board */
const CONTROLS_RESERVE = 200;
const PAGE_PAD = 24;

export default function Index() {
  const { colors, space } = useTheme();
  const { width, height } = useWindowDimensions();
  const {
    state,
    snake,
    food,
    frame,
    activeDir,
    startGame,
    setDirection,
    clearActiveDir,
  } = useSnakeGame();

  const boardSize = useMemo(() => {
    const maxW = width - PAGE_PAD * 2;
    const maxH = height - CONTROLS_RESERVE - PAGE_PAD * 2;
    return Math.max(200, Math.min(space.board, maxW, maxH));
  }, [width, height, space.board]);

  return (
    <View style={[styles.page, { backgroundColor: colors.page }]}>
      <View
        style={[
          styles.board,
          {
            width: boardSize,
            height: boardSize,
            backgroundColor: colors.board,
            overflow: "hidden",
          },
        ]}
      >
        {state === "menu" || !snake || !food ? (
          <Menu onStart={startGame} />
        ) : (
          <GameBoard
            snake={snake}
            food={food}
            frame={frame}
            boardSize={boardSize}
          />
        )}
      </View>
      <Controls
        enabled={state === "playing"}
        activeDir={activeDir}
        onDirection={setDirection}
        onRelease={clearActiveDir}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: PAGE_PAD,
  },
  board: {
    alignItems: "center",
    justifyContent: "center",
  },
});
