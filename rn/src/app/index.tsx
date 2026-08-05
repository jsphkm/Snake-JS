import { useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "../theme-context";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { Menu } from "../components/Menu";
import { GameBoard } from "../components/GameBoard";
import { Controls } from "../components/Controls";

/** Portrait: height reserved under the board for the joystick */
const JOYSTICK_SLOT = 180;
const PAGE_PAD = 24;

export default function Index() {
  const { colors, space } = useTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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
    if (isLandscape) {
      // Sides share leftover width via flex; size board from height + a min side gutter
      const maxH = height - PAGE_PAD * 2;
      const maxW = width - PAGE_PAD * 2 - JOYSTICK_SLOT;
      return Math.max(200, Math.min(space.board, maxW, maxH));
    }
    const maxW = width - PAGE_PAD * 2;
    const maxH = height - JOYSTICK_SLOT - PAGE_PAD * 2;
    return Math.max(200, Math.min(space.board, maxW, maxH));
  }, [width, height, space.board, isLandscape]);

  const controls = (
    <Controls
      enabled={state === "playing"}
      activeDir={activeDir}
      onDirection={setDirection}
      onRelease={clearActiveDir}
    />
  );

  const board = (
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
  );

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: colors.page,
          flexDirection: isLandscape ? "row" : "column",
        },
      ]}
    >
      {isLandscape ? (
        <>
          {/* Same height as board; flex width centers stick in the left gap */}
          <View style={[styles.side, { height: boardSize }]}>{controls}</View>
          {board}
          <View style={[styles.side, { height: boardSize }]} />
        </>
      ) : (
        <>
          {board}
          <View style={styles.portraitControls}>{controls}</View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: PAGE_PAD,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  portraitControls: {
    marginTop: 20,
  },
  board: {
    alignItems: "center",
    justifyContent: "center",
  },
});

