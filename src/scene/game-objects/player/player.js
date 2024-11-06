import { BNode } from "../../../engine";

import { SpriteAnimation } from "../../nodes";

export const Player = () => {
  return new (class extends BNode {
    __nname = "Player";

    start() {
      // Set node properties
      this.vel = 0;
      this._jumpForce = 1.2;
      this._verticalVel = 0; // Vertical velocity for gradual jump

      /** @type {Dimensions} */
      this.dim = { w: 32, h: 32 };

      /** @type {number} */
      this._walkingVel = 0.4;

      /** @type {"right" | "left"} */
      this._lookingTo = "right";

      /** @type {number} */
      this._gravity = 0.1;

      /** @type {number} */
      this._scale = 3;

      /** @type {boolean} */
      this._isAtGround = true;

      this._anim = {
        /** @type {SpriteAnimation} */
        current: null,
        idle: {
          /** @type {SpriteAnimation} */
          right: null,
          /** @type {SpriteAnimation} */
          left: null,
        },
        running: {
          /** @type {SpriteAnimation} */
          right: null,
          /** @type {SpriteAnimation} */
          left: null,
        },
        falling: {
          /** @type {SpriteAnimation} */
          right: null,
          /** @type {SpriteAnimation} */
          left: null,
        },
        jump: {
          /** @type {SpriteAnimation} */
          right: null,
          /** @type {SpriteAnimation} */
          left: null,
        },
      };

      // Set animations
      const url = (initial, reverse = false) =>
        `sprites/player/${initial}_${reverse ? "left" : "right"}.png`;

      this._anim.running = {
        right: this._getAnim(url("run"), false, 12, "running-right"),
        left: this._getAnim(url("run", true), true, 12, "running-left"),
      };
      this._anim.idle = {
        right: this._getAnim(url("idle"), false, 11, "idle-right"),
        left: this._getAnim(url("idle", true), true, 11, "idle-left"),
      };
      this._anim.falling = {
        right: this._getAnim(url("fall"), false, 1, "falling-right"),
        left: this._getAnim(url("fall", true), true, 1, "falling-left"),
      };
      this._anim.jump = {
        right: this._getAnim(url("jump"), false, 1, "jump-right"),
        left: this._getAnim(url("jump"), true, 1, "jump-left"),
      };
      this._limits = {
        left: this.canvas.pos.x,
        right: this.canvas.dim.w - this.dim.w * this._scale,
      };

      this.append(this._anim.running.right);
      this.append(this._anim.running.left);
      this.append(this._anim.idle.right);
      this.append(this._anim.idle.left);
      this.append(this._anim.jump.right);
      this.append(this._anim.jump.left);
      this.append(this._anim.falling.right);
      this.append(this._anim.falling.left);

      this._anim.current = this._anim.idle[this._lookingTo].play();

      // Allow receive input events
      this.attachController(this);
    }

    update(dt) {
      // Define ground coords
      this._minY = this.canvas.dim.h - this.dim.h * this._scale;

      // Movement controller
      if (
        (this.pos.x >= this._limits.left && this.vel < 0) ||
        (this.pos.x <= this._limits.right && this.vel > 0)
      ) {
        this.pos.x += this.vel * dt;
      }

      this.pos.y += this._verticalVel * dt; // Move player based on vertical velocity
      this._verticalVel += this._gravity; // Increase vertical velocity due to gravity

      // Apply vertical movement
      if (this.pos.y < this._minY) {
        this._isAtGround = false;
        this._setCAnim(this._anim.falling);
      }

      // Check if player is on the ground
      if (this.pos.y > this._minY) {
        this.pos.y = this._minY;
        this._isAtGround = true;
        this._verticalVel = 0; // Reset vertical velocity when on the ground
      }

      // Animation Controller
      if (this.vel === 0 && this._isAtGround) {
        this._setCAnim(this._anim.idle);
      } else if (this.vel < 0) {
        this._lookingTo = "left";
        if (this._isAtGround) {
          this._setCAnim(this._anim.running);
        }
      } else if (this.vel > 0) {
        this._lookingTo = "right";
        if (this._isAtGround) {
          this._setCAnim(this._anim.running);
        }
      }
    }

    notify(e) {
      if (e.type === "keydown") {
        const value = e.value.key;
        const code = e.value.code;

        if (
          (code === "Space" || value === "Control" || value === "ArrowUp") &&
          this._isAtGround
        ) {
          this._verticalVel = -this._jumpForce; // Set initial upward velocity for jump
        }

        if (value === "ArrowRight") {
          this.vel = this._walkingVel;
        }

        if (value === "ArrowLeft") {
          this.vel = -this._walkingVel;
        }
      }

      if (e.type === "keyup") {
        const value = e.value.key;

        if (value === "ArrowRight" || value === "ArrowLeft") {
          this.vel = 0;
        }
      }
    }

    _setCAnim(anims, side = this._lookingTo) {
      const newAnim = anims[side];
      if (this._anim.current !== newAnim) {
        this._anim.current.reset();
        this._anim.current.stopDraw();
        this._anim.current = newAnim.reset().play();
      }
    }

    _getAnim(src, reverse, frames, name) {
      const sprite = new Image();
      sprite.src = src;
      return new SpriteAnimation({
        __nname: name,
        sprite,
        scale: this._scale,
        totalFrames: frames,
        tpf: 40,
        reverse,
        sizes: {
          w: 32,
          h: 32,
        },
      });
    }
  })();
};
