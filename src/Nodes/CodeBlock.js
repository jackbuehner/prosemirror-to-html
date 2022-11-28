const Node = require('./Node');

class CodeBlock extends Node {
  name = 'codeBlock';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['pre', ['code', this.node.attrs, 0]];
  }
}

module.exports = CodeBlock;
