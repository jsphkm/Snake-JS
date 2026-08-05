import { COLS, ROWS } from "./constants";

export class Snake {
  body: { x: number; y: number }[];
  xdir: number;
  ydir: number;
  nextXdir: number;
  nextYdir: number;
  len: number;

  constructor(cols: number, rows: number) {
    this.body = [];
    this.body[0] = {
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    };
    this.xdir = 0;
    this.ydir = 0;
    this.nextXdir = 0;
    this.nextYdir = 0;
    this.len = 0;
  }

  facing(): { x: number; y: number } {
    if (this.xdir !== 0 || this.ydir !== 0) {
      return { x: this.xdir, y: this.ydir };
    }
    return { x: this.nextXdir, y: this.nextYdir };
  }

  /**
   * Queue a steer for the next tick.
   * Reverse is checked against facing() to prevent fast turn to 
   * 180° into the body, and queued steers still block reverse direction.
   */
  setDir(x: number, y: number): "ok" | "blocked" {
    const face = this.facing();
    if (
      (face.x !== 0 || face.y !== 0) &&
      x === -face.x &&
      y === -face.y
    ) {
      return "blocked";
    }
    this.nextXdir = x;
    this.nextYdir = y;
    return "ok";
  }

  update() {
    this.xdir = this.nextXdir;
    this.ydir = this.nextYdir;

    const head = { ...this.body[this.body.length - 1] };
    this.body.shift();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
  }

  grow() {
    const head = { ...this.body[this.body.length - 1] };
    this.len += 1;
    this.body.push(head);
  }

  endGame() {
    const x = this.body[this.body.length - 1].x;
    const y = this.body[this.body.length - 1].y;
    if (x > COLS - 1 || x < 0 || y > ROWS - 1 || y < 0) {
      return true;
    }

    for (let i = 0; i < this.body.length - 1; i += 1) {
      const part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }

  eat(pos: { x: number; y: number }) {
    const x = this.body[this.body.length - 1].x;
    const y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }
}
