const Node = require('./Node');

class TableCell extends Node {
  matching() {
    return this.node.type === 'tableCell';
  }

  toDOM() {
    return ['td', this.node.attrs, 0];
  }
}

module.exports = TableCell;
