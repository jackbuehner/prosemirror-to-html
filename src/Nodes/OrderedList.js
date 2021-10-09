const Node = require('./Node');

class OrderedList extends Node {
  matching() {
    return this.node.type === 'ordered_list';
  }

  toDOM() {
    return ['ol', this.node.attrs, 0];
  }
}

module.exports = OrderedList;
