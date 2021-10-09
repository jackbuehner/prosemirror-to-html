const Node = require('./Node');

class Heading extends Node {
  matching() {
    return this.node.type === 'heading';
  }

  toDOM() {
    return [`h${this.node.attrs.level}`, this.node.attrs, 0];
  }
}

module.exports = Heading;
