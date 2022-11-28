// @ts-check

const Node = require('./Node');

class TableRow extends Node {
  name = 'tableRow';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['tr', this.node.attrs, 0];
  }
}

module.exports = TableRow;
