const Node = require('./Node');

class Table extends Node {
  matching() {
    return this.node.type === 'table';
  }

  toDOM() {
    return ['table', this.node.attrs, ['tbody', 0]];
  }
}

module.exports = Table;
