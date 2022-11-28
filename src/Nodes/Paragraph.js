// @ts-check

const Node = require('./Node');

class Paragraph extends Node {
  name = 'paragraph';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['p', this.node.attrs, 0];
  }
}

module.exports = Paragraph;
