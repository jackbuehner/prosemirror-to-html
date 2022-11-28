// @ts-check

const Node = require('./Node');

class OrderedList extends Node {
  name = 'orderedList';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['ol', this.node.attrs, 0];
  }
}

module.exports = OrderedList;
