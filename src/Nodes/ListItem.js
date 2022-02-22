const Node = require('./Node');

class ItemList extends Node {
  matching() {
    return this.node.type === 'listItem';
  }

  toDOM() {
    return ['li', this.node.attrs, 0];
  }
}

module.exports = ItemList;
