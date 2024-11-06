import { BNode } from "../../engine";

/**
 * Represents a sprite animation that supports single line sprite sheets.
 * Extends the BNode class to manage the animation of sprites.
 */
export class SpriteAnimation extends BNode {
  /** @type {string} */
  __nname = SpriteAnimation.name;

  /** @type {Array<string>} */
  __inherit = ["context"];

  /** @type {number} Time per frame in milliseconds. */
  tpf = 0;

  /** @type {number} Scale factor for the sprite. */
  scale = 1;

  /** @type {HTMLImageElement|null} The sprite sheet image. */
  sprite = null;

  /** @type {number|null} Total number of frames in the sprite sheet. */
  totalFrames = null;

  /** @type {boolean} Indicates if the animation should play in reverse. */
  reverse = false;

  /** @type {{h: number, w: number}} Dimensions of each sprite frame. */
  sizes = { h: 0, w: 0 };

  /** @type {number} The current frame index. */
  _currentFrame = 0;

  /** @type {boolean} Indicates if drawing is allowed. */
  _allowDraw = false;

  /** @type {number} Time until the next frame should be displayed. */
  _nextFrametime = 1;

  /** @type {boolean} Indicates if updates are allowed. */
  _allowUpdate = false;

  /**
   * Creates an instance of SpriteAnimation.
   * @param {Object} cp - Configuration parameters for the sprite animation.
   */
  constructor(cp) {
    super(cp);
    Object.assign(this, cp);
  }

  /**
   * Initializes the dimensions of the sprite frames.
   */
  start() {
    this._calcDim();
  }

  /**
   * Updates the current frame based on the elapsed time.
   * @param {number} dt - The delta time since the last update.
   */
  update(dt) {
    if (!this._allowUpdate) {
      return;
    }
    this._nextFrametime += dt;

    if (this._nextFrametime >= this.tpf) {
      if (!this.reverse) {
        this._currentFrame = (this._currentFrame + 1) % this.totalFrames;
      } else {
        this._currentFrame =
          (this._currentFrame - 1 + this.totalFrames) % this.totalFrames;
      }
      this._nextFrametime = 0;
    }
  }

  /**
   * Draws the current frame of the sprite animation on the canvas.
   */
  draw() {
    if (!this._allowDraw) {
      return;
    }
    if (this.sprite.complete) {
      const xFramePos = this._currentFrame * this.sizes.w;
      const yFramePos = 0;

      const sw = this.sizes.w * this.scale;
      const sh = this.sizes.h * this.scale;

      const c = this.context;

      // Draw the image
      c.drawImage(
        this.sprite,
        xFramePos,
        yFramePos,
        this.sizes.w,
        this.sizes.h,
        this.pos.x, // The x coordinate where to place the image on the canvas
        // (already adjusted)
        this.pos.y, // The y coordinate where to place the image on the canvas
        // (already adjusted)
        sw,
        sh,
      );
    }
  }

  /**
   * Starts the animation playback.
   * @returns {SpriteAnimation} The current instance for chaining.
   */
  play() {
    this._allowDraw = true;
    this._allowUpdate = true;
    return this;
  }

  /**
   * Pauses the animation playback.
   * @returns {SpriteAnimation} The current instance for chaining.
   */
  pause() {
    this._allowUpdate = false;
    return this;
  }

  /**
   * Allows drawing of the animation.
   * @returns {SpriteAnimation} The current instance for chaining.
   */
  allowDraw() {
    this._allowDraw = true;
    return this;
  }

  /**
   * Stops drawing of the animation.
   * @returns {SpriteAnimation} The current instance for chaining.
   */
  stopDraw() {
    this._allowDraw = false;
    return this;
  }

  /**
   * Resets the animation to the first frame.
   * @returns {SpriteAnimation} The current instance for chaining.
   */
  reset() {
    this._currentFrame = 0;
    return this;
  }

  /**
   * Calculates the dimensions of the sprite frames based on the scale.
   * @private
   */
  _calcDim() {
    this.dim = { w: this.sizes.w * this.scale, h: this.sizes.h * this.scale };
  }
}
