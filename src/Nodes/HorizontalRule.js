// @ts-check

const Node = require('./Node');

class HorizontalRule extends Node {
  name = 'horizontalRule';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['hr', this.node.attrs];
  }
}

module.exports = HorizontalRule;
