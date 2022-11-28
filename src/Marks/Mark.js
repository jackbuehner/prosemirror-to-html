// @ts-check

/**
 * @template {import('../Renderer').ProsemirrorDocMark['attrs']} Attrs
 */
class Mark {
  /**
   * @typedef {import('../Renderer').ProsemirrorDocMark & { attrs?: Attrs }} MarkType
   */

  /**
   * The name of the mark type.
   *
   * @type {string}
   */
  name = 'mark';

  /**
   * @type {MarkType}
   */
  mark;

  /**
   * @param {MarkType?} markToProcess
   */
  constructor(markToProcess) {
    // @ts-ignore
    if (!markToProcess) this.mark = { type: '', attrs: {} };
    else this.mark = markToProcess;
  }

  /**
   * Whether the mark type matches.
   *
   * @returns {boolean}
   */
  matching() {
    return false;
  }

  /**
   * The DOM output [specification](https://prosemirror.net/docs/ref/version/0.18.0.html#model.DOMOutputSpec) for this node. It must be an array.
   *
   * @param {string} text The text value of the node with this mark.
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM(text) {
    return ['span', this.mark.attrs || {}, 0];
  }
}

module.exports = Mark;
