/**
 * Generates a random identifier using the Web Crypto API.
 * The identifier is created from a random byte array and converted to a string.
 *
 * @returns {string} A random identifier consisting of 5 bytes, with commas removed.
 */
export function randomId() {
  const buf = new Uint8Array(5);
  window.crypto.getRandomValues(buf);
  const id = buf.toString();
  return id.replaceAll(",", "");
}
