const Node = require('./Node');

class ItemList extends Node {
  name = 'listItem';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['li', this.node.attrs, 0];
  }
}

module.exports = ItemList;
