const Node = require('./Node');

class CodeBlock extends Node {
  matching() {
    return this.node.type === 'code_block';
  }

  toDOM() {
    return ['pre', ['code', this.node.attrs, 0]];
  }
}

module.exports = CodeBlock;
