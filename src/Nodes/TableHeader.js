const Node = require('./Node');

class TableHeader extends Node {
  matching() {
    return this.node.type === 'tableHeader';
  }

  toDOM() {
    return ['th', this.node.attrs, 0];
  }
}

module.exports = TableHeader;
