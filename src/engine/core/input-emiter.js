import { messageBroker } from "./message-broker";

/**
 * A class that emits input events (keyup and keydown) to a message broker.
 */
export class InputEmitter {
  _topic = "__input__";

  /**
   * Creates an instance of InputEmitter and sets up event listeners for keyup and keydown events.
   * It also creates a topic in the message broker for input events.
   */
  constructor() {
    messageBroker.createTopic(this._topic);

    document.addEventListener("keyup", (event) => {
      messageBroker.emit({
        topic: this._topic,
        payload: {
          type: "keyup",
          value: event,
        },
      });
    });

    document.addEventListener("keydown", (event) => {
      messageBroker.emit({
        topic: this._topic,
        payload: {
          type: "keydown",
          value: event,
        },
      });
    });
  }

  /**
   * Subscribes a listener to the input events topic.
   *
   * @param {Object} listener - The listener object that will receive input events.
   * @returns {boolean} - Returns true if the listener was successfully subscribed, false if the topic does not exist.
   */
  subscribe(listener) {
    return messageBroker.subscribe(this._topic, listener);
  }

  /**
   * Unsubscribes a listener from the input events topic.
   *
   * @param {Object} listener - The listener object to be removed.
   * @returns {boolean} - Returns true if the listener was successfully unsubscribed, false if the topic does not exist.
   */
  unsubscribe(listener) {
    return messageBroker.unsubscribe(this._topic, listener);
  }
}

/**
 * An instance of the InputEmitter class.
 * @type {InputEmitter}
 */
export const inputEmitter = new InputEmitter();
