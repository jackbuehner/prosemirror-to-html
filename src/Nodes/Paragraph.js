const Node = require('./Node');

class Paragraph extends Node {
  name = 'paragraph';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['p', this.node.attrs, 0];
  }
}

module.exports = Paragraph;
