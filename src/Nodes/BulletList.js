const Node = require('./Node');

class BulletList extends Node {
  name = 'bulletList';

  matching() {
    return this.node.type === this.name;
  }

  toDOM() {
    return ['ul', this.node.attrs, 0];
  }
}

module.exports = BulletList;
