/**
 * A class that implements a simple message broker for subscribing,
 * unsubscribing, and emitting messages to topics.
 */
export class MessageBroker {
  _topics = {};

  /**
   * Subscribes a listener to a specific topic.
   *
   * @param {string} topic - The topic to subscribe to.
   * @param {Object} listener - The listener object that will receive messages.
   * @returns {boolean} - Returns true if the listener was successfully
   *     subscribed, false if the topic does not exist.
   */
  subscribe(topic, listener) {
    const topicRef = this._topics[topic];

    if (!topicRef) {
      return false;
    }

    topicRef.push(listener);
    return true;
  }

  /**
   * Unsubscribes a listener from a specific topic.
   *
   * @param {string} topic - The topic to unsubscribe from.
   * @param {Object} listener - The listener object to be removed.
   * @returns {boolean} - Returns true if the listener was successfully
   *     unsubscribed, false if the topic does not exist.
   */
  unsubscribe(topic, listener) {
    const topicRef = this._topics[topic];

    if (!topicRef) {
      return false;
    }

    this._topics[topic] = topicRef.filter((sub) => sub !== listener);
    return true;
  }

  /**
   * Emits a message to the listeners of a specific topic.
   *
   * @param {Object} msg - The message object containing the topic and payload.
   * @param {string} msg.topic - The topic to which the message is being sent.
   * @param {any} msg.payload - The payload of the message to be sent to
   *     listeners.
   * @returns {boolean|null} - Returns true if the message was successfully
   *     emitted, null if there are no listeners for the topic.
   */
  emit(msg) {
    const listeners = this._topics[msg.topic];

    if (!listeners) {
      return null;
    }

    for (const l of listeners) {
      l.notify(msg.payload);
    }

    return true;
  }

  /**
   * Creates a new topic for listeners to subscribe to.
   *
   * @param {string} name - The name of the topic to create.
   * @returns {boolean} - Returns true after creating the topic.
   */
  createTopic(name) {
    this._topics[name] = [];
    return true;
  }

  /**
   * Removes a topic and all its listeners.
   *
   * @param {string} name - The name of the topic to remove.
   * @returns {boolean} - Returns true if the topic was successfully removed,
   *     false if the topic does not exist.
   */
  removeTopic(name) {
    if (this._topics[name]) {
      delete this._topics[name];
      return true;
    }
    return false;
  }
}

/**
 * An instance of the MessageBroker class.
 * @type {MessageBroker}
 */
export const messageBroker = new MessageBroker();
