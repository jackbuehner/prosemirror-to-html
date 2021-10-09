const Node = require('../../../src/Nodes/Node');

class Div extends Node {
  matching() {
    return this.node.type === 'div';
  }

  toDOM() {
    return ['div', this.node.attrs, 0];
  }
}

module.exports = Div;
