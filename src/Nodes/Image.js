const Node = require('./Node');

class Image extends Node {
  name = 'image';

  matching() {
    return this.node.type === this.name;
  }

  selfClosing() {
    return true;
  }

  toDOM() {
    return ['img', this.node.attrs, 0];
  }
}

module.exports = Image;
