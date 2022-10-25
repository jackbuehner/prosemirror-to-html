const Node = require('./Node');

class HorizontalRule extends Node {
  matching() {
    return this.node.type === 'horizontalRule';
  }

  toDOM() {
    return ['hr', this.node.attrs];
  }
}

module.exports = HorizontalRule;
