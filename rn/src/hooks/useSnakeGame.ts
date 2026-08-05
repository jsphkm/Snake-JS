import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { TICK_MS } from "../game/constants";
import {
  drawGame,
  getFood,
  getSnake,
  getState,
  startGame as worldStartGame,
  type GameState,
  type Point,
} from "../game/world";
import type { Snake } from "../game/snake";

export function useSnakeGame() {
  const [status, setStatus] = useState<GameState>("menu");
  const [snake, setSnake] = useState<Snake | undefined>();
  const [food, setFood] = useState<Point | undefined>();
  const statusRef = useRef(status);
  statusRef.current = status;

  const syncFromWorld = useCallback(() => {
    setStatus(getState());
    setSnake(getSnake());
    setFood(getFood());
  }, []);

  const start = useCallback(() => {
    worldStartGame();
    syncFromWorld();
  }, [syncFromWorld]);

  // sketch.js playing loop ≈ frameRate(5)
  useEffect(() => {
    if (status !== "playing") return;

    const id = setInterval(() => {
      drawGame();
      syncFromWorld();
    }, TICK_MS);

    return () => clearInterval(id);
  }, [status, syncFromWorld]);

  // sketch.js keyPressed()
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const keyPressed = (e: KeyboardEvent) => {
      const current = statusRef.current;

      if (current === "menu") {
        if (e.code === "Enter" || e.code === "Space") {
          e.preventDefault();
          start();
        }
        return;
      }

      if (current === "playing") {
        const s = getSnake();
        if (!s) return;

        if (e.code === "ArrowLeft") {
          e.preventDefault();
          s.setDir(-1, 0);
        } else if (e.code === "ArrowRight") {
          e.preventDefault();
          s.setDir(1, 0);
        } else if (e.code === "ArrowDown") {
          e.preventDefault();
          s.setDir(0, 1);
        } else if (e.code === "ArrowUp") {
          e.preventDefault();
          s.setDir(0, -1);
        }
      }
    };

    window.addEventListener("keydown", keyPressed);
    return () => window.removeEventListener("keydown", keyPressed);
  }, [start]);

  return {
    state: status,
    snake,
    food,
    startGame: start,
  };
}
