const Node = require('../../../src/Nodes/Node');

class HardBreak extends Node {
  matching() {
    return this.node.type === 'hard_break';
  }

  selfClosing() {
    return true;
  }

  toDOM() {
    return ['br', this.node.attrs, 0];
  }
}

module.exports = HardBreak;
