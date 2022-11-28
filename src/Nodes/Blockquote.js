const Node = require('./Node');

class Blockquote extends Node {
  name = 'blockquote';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['blockquote', this.node.attrs, 0];
  }
}

module.exports = Blockquote;
