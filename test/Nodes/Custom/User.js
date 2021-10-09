const Node = require('../../../src/Nodes/Node');

class User extends Node {
  matching() {
    return this.node.type === 'user';
  }

  text() {
    return ['Foobar', this.node.attrs, 0];
  }
}

module.exports = User;
