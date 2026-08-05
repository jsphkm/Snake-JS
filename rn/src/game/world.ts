import { COLS, ROWS } from "./constants";
import { Snake } from "./snake";

export type GameState = "menu" | "playing";
export type Point = { x: number; y: number };

let snake: Snake | undefined;
let food: Point | undefined;
let state: GameState = "menu";
let score = 0;
let hiScore = 0;

/** sketch.js foodLocation() */
function foodLocation() {
  const x = Math.floor(Math.random() * COLS);
  const y = Math.floor(Math.random() * ROWS);
  food = { x, y };
}

/** sketch.js startGame() */
function startGame() {
  snake = new Snake(COLS, ROWS);
  food = { x: 0, y: 0 };
  foodLocation();
  score = 0;
  state = "playing";
}

/**
 * sketch.js drawGame() logic (no drawing).
 * Returns current state so React can sync after mutations.
 */
function drawGame(): GameState {
  if (!snake || !food || state !== "playing") return state;

  if (snake.eat(food)) {
    score += 1;
    if (score > hiScore) hiScore = score;
    foodLocation();
  }
  snake.update();

  if (snake.endGame()) {
    state = "menu";
  }
  return state;
}

function getState() {
  return state;
}

function getSnake() {
  return snake;
}

function getFood() {
  return food;
}

function getScore() {
  return score;
}

function getHiScore() {
  return hiScore;
}

/** Seed / restore a persisted high score (e.g. from localStorage). */
function setHiScore(value: number) {
  if (Number.isFinite(value) && value > hiScore) {
    hiScore = Math.floor(value);
  }
}

export {
  foodLocation,
  startGame,
  drawGame,
  getState,
  getSnake,
  getFood,
  getScore,
  getHiScore,
  setHiScore,
};
