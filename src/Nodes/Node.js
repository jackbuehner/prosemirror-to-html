// @ts-check

/**
 * @template {import('../Renderer').ProsemirrorDocNode['attrs']} Attrs
 */
class Node {
  /**
   * @typedef {import('../Renderer').ProsemirrorDocNode & { attrs?: Attrs }} NodeType
   */

  /**
   * The name of the node type.
   *
   * @type {string}
   */
  name = 'node';

  /**
   * @type {NodeType}
   */
  node;

  /**
   *
   * @param {NodeType?} nodeToProcess
   */
  constructor(nodeToProcess) {
    // @ts-ignore
    if (!nodeToProcess) this.node = { type: '', attrs: {} };
    else this.node = nodeToProcess;
  }

  /**
   * Whether the node type matches.
   *
   * @returns {boolean}
   */
  matching() {
    return false;
  }

  /**
   * Whether the node uses self-closing tags.
   *
   * @returns {boolean}
   */
  selfClosing() {
    return false;
  }

  /**
   * The DOM output [specification](https://prosemirror.net/docs/ref/version/0.18.0.html#model.DOMOutputSpec) for this node. It must be an array.
   *
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['div', this.node.attrs || {}, 0];
  }

  /**
   * The text value of the node.
   *
   * @returns {string | null}
   */
  text() {
    return null;
  }
}

module.exports = Node;
