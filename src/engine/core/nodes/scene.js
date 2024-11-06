import { BNode } from "./_bnode_";
import { Canvas2D } from "./canvas";

/**
 * Represents a scene that can contain layers and children elements.
 * Extends the BNode class to manage a hierarchy of graphical objects.
 */
export class Scene extends BNode {
  /** @type {string} */
  __nname = Scene.name;

  /** @type {Array} */
  children = [];

  /** @type {Array} */
  layers = [];

  /**
   * Creates an instance of Scene.
   * @param {Object} cp - Configuration parameters for the scene.
   */
  constructor(cp) {
    super(cp);
    Object.assign(this, cp);
  }

  /**
   * Starts the scene by initializing layers and preparing children.
   * @throws {Error} Throws an error if any child is not an instance of Canvas2D.
   */
  start() {
    for (const layer of this.children) {
      if ((!layer) instanceof Canvas2D) {
        throw new Error(`Element is not a canvas object.`);
      }
      this.layers.push(layer);
      this._setCanvasAndContext(layer, layer.children);
    }

    const newChildrenList = [];
    this._prepareChildrenListAndStart(newChildrenList, this.children);
    this.children = newChildrenList;
  }

  /**
   * Clears all layers in the scene.
   */
  clearLayers() {
    for (const l of this.layers) {
      l.clear();
    }
  }

  /**
   * Updates all children in the scene with the given delta time.
   * @param {number} dt - The delta time to update the children.
   */
  update(dt) {
    for (const c of this.children) {
      for (const cc of c.children) {
        cc.update(dt);
        cc.e_postUpdate(dt);
        cc.draw();
      }
    }
  }

  /**
   * Sets the canvas and context for each child element recursively.
   * @param {Canvas2D} canvas - The canvas to set for the children.
   * @param {Array} children - The list of children to set the canvas and context for.
   * @private
   */
  _setCanvasAndContext(canvas, children) {
    for (const child of children) {
      child.canvas = canvas;
      child.context = canvas.context;

      if (child.children.length) {
        this._setCanvasAndContext(canvas, child.children);
      }
    }
  }

  /**
   * Prepares the list of children and starts them recursively.
   * @param {Array} newChildrenList - The list to populate with new children.
   * @param {Array} children - The list of children to prepare and start.
   * @param {Scene} [parent=this] - The parent node for the children.
   * @private
   */
  _prepareChildrenListAndStart(newChildrenList, children, parent = this) {
    for (const child of children) {
      child.parent = parent;
      child.e_preStart();
      child.start();

      if (child?.children?.length) {
        newChildrenList.push(child);
        this._prepareChildrenListAndStart(
          newChildrenList,
          child.children,
          child,
        );
      }
    }
  }
}
