import { COLS, ROWS } from "./constants";

export class Snake {
  body: { x: number; y: number }[];
  xdir: number;
  ydir: number;
  len: number;

  constructor(cols: number, rows: number) {
    this.body = [];
    this.body[0] = {
      x: Math.floor(cols / 2),
      y: Math.floor(rows / 2),
    };
    this.xdir = 0;
    this.ydir = 0;
    this.len = 0;
  }

  setDir(x: number, y: number) {
    this.xdir = x;
    this.ydir = y;
  }

  update() {
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
