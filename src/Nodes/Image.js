const Node = require('./Node');

class Image extends Node {
  matching() {
    return this.node.type === 'image';
  }

  selfClosing() {
    return true;
  }

  toDOM() {
    return ['img', this.node.attrs, 0];
  }
}

module.exports = Image;
