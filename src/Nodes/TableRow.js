const Node = require('./Node');

class TableRow extends Node {
  name = 'tableRow';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['tr', this.node.attrs, 0];
  }
}

module.exports = TableRow;
