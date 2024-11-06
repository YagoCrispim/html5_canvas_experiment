import { BNode, Vector2D } from "../../../engine";

export const Ground = () => {
  return new class extends BNode {
    __nname__ = 'Ground';
    vel = 0;
    script = null;

    constructor(cp) {
      super(cp);
      Object.assign(this, cp);
    }

    start() {
      this.dim = {
        w: this.canvas.dim.w,
        h: 100,
      }
    }

    draw() {
      this.pos = new Vector2D(0, this.canvas.dim.h - 100);
      const c = this.context;
      c.fillSryle = this.color;
      c.beginPath();
      c.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }
  }
}
