import { BNode } from "./_bnode_";

/**
 * A class representing a 2D canvas that can be used for rendering graphics.
 * It extends the BNode class to support hierarchical structures.
 * Each instance creates a new canvas element on the DOM acting like a new layer.
 */
export class Canvas2D extends BNode {
  /**
   * Creates an instance of Canvas2D and initializes the canvas element and its properties.
   *
   * @param {Object} cp - Configuration properties to initialize the canvas.
   */
  constructor(cp) {
    super(cp);
    Object.assign(this, cp);

    // Initialize/Create properties
    this.__nname = Canvas2D.name;

    /**
     * @type {Dimensions}
     * @description The dimensions of the canvas, initialized to the window size.
     */
    this.dim = { w: window.innerWidth, h: window.innerHeight };

    /**
     * @type {CanvasRenderingContext2D|null}
     * @description The 2D rendering context for the canvas.
     */
    this.context = null;

    /**
     * @type {HTMLCanvasElement|null}
     * @description The HTML canvas element.
     */
    this.element = null;

    /**
     * @type {BNode|null}
     * @description A reference to the parent node in the hierarchy.
     */
    this.parent = null;

    // Element properties
    this.element = document.createElement("canvas");
    this.element.width = this.dim.w;
    this.element.height = this.dim.h;
    this.element.style.position = "absolute";
    this.element.style.top = `${this.pos.x}px`;
    this.element.style.left = `${this.pos.y}px`;
    this.element.style.width = "100%";
    this.element.style.height = "100%";
    this.element.style.objectFit = "contain";
    document.body.append(this.element);

    // Context properties
    this.context = this.element.getContext("2d");

    // Only in dev
    this.element.style.backgroundColor = "teal";

    // Bind the resize handler
    this.resizeHandler = this._handleResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);

    return this;
  }

  /**
   * Handles the window resize event.
   */
  _handleResize() {
    // Update dimensions
    this.dim.w = window.innerWidth;
    this.dim.h = window.innerHeight;

    // Update canvas size
    this.element.width = this.dim.w;
    this.element.height = this.dim.h;

    // Optionally, redraw the canvas content
    this.clear();
    this.draw();
  }

  /**
   * Draws the contents of the canvas. This method can be overridden by subclasses to implement custom rendering.
   */
  draw() { }

  /**
   * Clears the canvas by resetting its content.
   */
  clear() {
    this.context.clearRect(0, 0, this.dim.w, this.dim.h);
  }

  /**
   * Saves the current drawing state and sets a clipping region based on the canvas position and dimensions.
   */
  pushClip() {
    const ctx = this.context;
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    ctx.clip();
  }

  /**
   * Restores the previous drawing state, removing the clipping region.
   */
  popClip() {
    this.context.restore();
  }

  /**
   * Cleans up the event listener when the instance is destroyed.
   */
  destroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }
}

