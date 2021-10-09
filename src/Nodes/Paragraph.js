const Node = require('./Node');

class Paragraph extends Node {
  matching() {
    return this.node.type === 'paragraph';
  }

  toDOM() {
    return ['p', this.node.attrs, 0];
  }
}

module.exports = Paragraph;
