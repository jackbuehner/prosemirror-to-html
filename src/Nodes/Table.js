const Node = require('./Node');

class Table extends Node {
  name = 'table';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['table', this.node.attrs, ['tbody', 0]];
  }
}

module.exports = Table;
