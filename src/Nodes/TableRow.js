const Node = require('./Node');

class TableRow extends Node {
  matching() {
    return this.node.type === 'tableRow';
  }

  toDOM() {
    return ['tr', this.node.attrs, 0];
  }
}

module.exports = TableRow;
