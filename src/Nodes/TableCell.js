const Node = require('./Node');

class TableCell extends Node {
  name = 'tableCell';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['td', this.node.attrs, 0];
  }
}

module.exports = TableCell;
