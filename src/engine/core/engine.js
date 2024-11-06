/**
 * A class that manages the game engine's main loop, frame counting, and scene management.
 */
class EngineClass {
  constructor() {
    /** @type {number} The current frame count. */
    this._frameCount = 0;

    /** @type {number} The timestamp of the last frame update. */
    this._lastFrameTime = 0;

    /** @type {number} The next frame count update timestamp. */
    this._nextFrameCountUpdate = 0;

    /** @type {number} The target frames per second. */
    this._targetFps = 60;

    /** @type {number} The time per frame in milliseconds. */
    this._timePerFrame = 1000 / this._targetFps;

    /** @type {Scene|null} A reference to the current scene. */
    this._scene = null;

    /** @type {boolean} Indicates if the frame manager is paused. */
    this._paused = false;

    /**
     * @type {{ frameCounter: HTMLElement|null, targetFrameCounter: HTMLElement|null }}
     * @description UI elements for displaying frame counts.
     */
    this._uiElements = {
      frameCounter: null,
      targetFrameCounter: null,
    };
  }

  /**
   * Starts the engine and the associated scene.
   *
   * @returns {EngineClass} - Returns the instance of the EngineClass.
   * @throws {Error} - Throws an error if the scene is not defined.
   */
  start() {
    if (!this._scene) {
      throw new Error("Scene not defined.");
    }
    this._scene.start();
    this.loop();
    return this;
  }

  /**
   * Sets the scene for the engine.
   *
   * @param {Object} scene - The scene to be set for the engine.
   * @returns {EngineClass} - Returns the instance of the EngineClass.
   */
  setScene(scene) {
    this._scene = scene;
    return this;
  }

  /**
   * Checks if the engine is currently paused.
   *
   * @returns {boolean} - Returns true if the engine is paused, false otherwise.
   */
  isPaused() {
    return this._paused;
  }

  /**
   * Pauses the engine's main loop.
   */
  pause() {
    this._paused = true;
  }

  /**
   * Resumes the engine's main loop if it was paused.
   */
  resume() {
    this._paused = false;
  }

  /**
   * The main loop of the engine that updates the scene and manages frame counting.
   * This method is called recursively using requestAnimationFrame.
   */
  loop() {
    if (!this._paused) {
      const now = performance.now();
      const delta = now - this._lastFrameTime;

      if (delta >= this._timePerFrame) {
        this._scene.clearLayers();
        this._scene.update(delta);
        this._frameCount++;
        this._lastFrameTime = now;
      }

      if (now >= this._nextFrameCountUpdate) {
        this._frameCount = 0;
        this._nextFrameCountUpdate = now + 1000;
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

/**
 * An instance of the EngineClass.
 * @type {EngineClass}
 */
export const engine = new EngineClass();
