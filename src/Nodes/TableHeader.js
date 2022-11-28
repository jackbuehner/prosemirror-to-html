// @ts-check

const Node = require('./Node');

class TableHeader extends Node {
  name = 'tableHeader';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['th', this.node.attrs, 0];
  }
}

module.exports = TableHeader;
