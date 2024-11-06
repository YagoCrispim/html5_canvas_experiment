/**
 * Represents a 2D vector with x and y components.
 */
export class Vector2D {
  /** @type {number} */
  x = 0;

  /** @type {number} */
  y = 0;

  /**
   * Creates an instance of Vector2D.
   * @param {number} x - The x component of the vector.
   * @param {number} y - The y component of the vector.
   */
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /**
   * Assigns new values to the x and y components of the vector.
   * @param {number} x - The new x component.
   * @param {number} y - The new y component.
   */
  assign(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a copy of the current vector.
   * @returns {Vector2D} A new Vector2D instance with the same x and y values.
   */
  copy() {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Adds another vector to the current vector.
   * @param {Vector2D} v - The vector to add.
   * @returns {Vector2D} A new Vector2D instance representing the sum.
   */
  add(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtracts another vector from the current vector.
   * @param {Vector2D} v - The vector to subtract.
   * @returns {Vector2D} A new Vector2D instance representing the difference.
   */
  sub(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  /**
   * Calculates the magnitude (length) of the vector.
   * @returns {number} The magnitude of the vector.
   */
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Multiplies the vector by a scalar value.
   * @param {number} num - The scalar value to multiply by.
   * @returns {Vector2D} A new Vector2D instance representing the scaled vector.
   */
  mul(num) {
    return new Vector2D(this.x * num, this.y * num);
  }

  /**
   * Returns a unit vector in the same direction as the current vector.
   * @returns {Vector2D} A new Vector2D instance representing the unit vector.
   */
  unit() {
    const mag = this.mag();
    if (mag === 0) {
      return new Vector2D(0, 0);
    }
    return new Vector2D(this.x / mag, this.y / mag);
  }

  /**
   * Draws the vector on a canvas for debugging purposes.
   * @param {Canvas2D} canvas - The canvas to draw on.
   * @param {number} x - The starting x coordinate.
   * @param {number} y - The starting y coordinate.
   * @param {number} value - The length multiplier for the vector.
   * @param {string} color - The color of the line.
   */
  debug(canvas, x, y, value, color) {
    const context = canvas.context;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + this.x * value, y + this.y * value);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }
}
