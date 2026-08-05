import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { TICK_MS } from "../game/constants";
import {
  drawGame,
  getFood,
  getHiScore,
  getScore,
  getSnake,
  getState,
  setHiScore,
  startGame as worldStartGame,
  type GameState,
  type Point,
} from "../game/world";
import type { Snake } from "../game/snake";

export type Dir = { x: number; y: number };

const HI_SCORE_KEY = "snake-hi-score";

function dirFromKey(code: string, key: string): Dir | null {
  if (code === "ArrowLeft" || key === "ArrowLeft") return { x: -1, y: 0 };
  if (code === "ArrowRight" || key === "ArrowRight") return { x: 1, y: 0 };
  if (code === "ArrowDown" || key === "ArrowDown") return { x: 0, y: 1 };
  if (code === "ArrowUp" || key === "ArrowUp") return { x: 0, y: -1 };
  return null;
}

function readStoredHiScore(): number {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return 0;
  const raw = localStorage.getItem(HI_SCORE_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function writeStoredHiScore(value: number) {
  if (Platform.OS !== "web" || typeof localStorage === "undefined") return;
  localStorage.setItem(HI_SCORE_KEY, String(value));
}

export function useSnakeGame() {
  const [status, setStatus] = useState<GameState>("menu");
  const [snake, setSnake] = useState<Snake | undefined>();
  const [food, setFood] = useState<Point | undefined>();
  const [score, setScore] = useState(0);
  const [hiScore, setHiScoreState] = useState(0);
  const [activeDir, setActiveDir] = useState<Dir | null>(null);
  /** Forces a re-render after in-place Snake mutations (same object ref). */
  const [frame, setFrame] = useState(0);
  const statusRef = useRef(status);
  const activeDirRef = useRef(activeDir);
  statusRef.current = status;
  activeDirRef.current = activeDir;

  // Restore high score once (web localStorage)
  useEffect(() => {
    const stored = readStoredHiScore();
    if (stored > 0) {
      setHiScore(stored);
      setHiScoreState(stored);
    }
  }, []);

  const syncFromWorld = useCallback(() => {
    const nextFood = getFood();
    const nextState = getState();
    const nextScore = getScore();
    const nextHi = getHiScore();
    setStatus(nextState);
    setSnake(getSnake());
    setFood(nextFood ? { ...nextFood } : undefined);
    setScore(nextScore);
    setHiScoreState((prev) => {
      if (nextHi > prev) writeStoredHiScore(nextHi);
      return nextHi;
    });
    setFrame((f) => f + 1);
    if (nextState === "menu") {
      setActiveDir(null);
    }
  }, []);

  const start = useCallback(() => {
    worldStartGame();
    setActiveDir(null);
    syncFromWorld();
  }, [syncFromWorld]);

  /** Apply steer + show live highlight */
  const setDirection = useCallback((x: number, y: number) => {
    getSnake()?.setDir(x, y);
    setActiveDir({ x, y });
  }, []);

  /** Clear highlight only — snake keeps last direction */
  const clearActiveDir = useCallback(() => {
    setActiveDir(null);
  }, []);

  // sketch.js playing loop ≈ frameRate(5)
  useEffect(() => {
    if (status !== "playing") return;

    const id = setInterval(() => {
      drawGame();
      syncFromWorld();
    }, TICK_MS);

    return () => clearInterval(id);
  }, [status, syncFromWorld]);

  // Keyboard: press = highlight + steer, release = clear highlight
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const keyPressed = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const current = statusRef.current;
      const key = e.key;
      const code = e.code;

      if (current === "menu") {
        if (
          code === "Enter" ||
          code === "Space" ||
          key === "Enter" ||
          key === " "
        ) {
          e.preventDefault();
          start();
        }
        return;
      }

      if (current === "playing") {
        const dir = dirFromKey(code, key);
        if (!dir) return;
        e.preventDefault();
        setDirection(dir.x, dir.y);
      }
    };

    const keyReleased = (e: KeyboardEvent) => {
      if (statusRef.current !== "playing") return;
      const dir = dirFromKey(e.code, e.key);
      if (!dir) return;
      e.preventDefault();
      const active = activeDirRef.current;
      if (active && active.x === dir.x && active.y === dir.y) {
        clearActiveDir();
      }
    };

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyReleased);
    return () => {
      window.removeEventListener("keydown", keyPressed);
      window.removeEventListener("keyup", keyReleased);
    };
  }, [start, setDirection, clearActiveDir]);

  return {
    state: status,
    snake,
    food,
    frame,
    score,
    hiScore,
    activeDir,
    startGame: start,
    setDirection,
    clearActiveDir,
  };
}
