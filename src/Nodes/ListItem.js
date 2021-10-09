const Node = require('./Node');

class ItemList extends Node {
  matching() {
    return this.node.type === 'list_item';
  }

  toDOM() {
    return ['li', this.node.attrs, 0];
  }
}

module.exports = ItemList;
