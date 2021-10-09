const Node = require('./Node');

class Blockquote extends Node {
  matching() {
    return this.node.type === 'blockquote';
  }

  toDOM() {
    return ['blockquote', this.node.attrs, 0];
  }
}

module.exports = Blockquote;
