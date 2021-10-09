const Node = require('./Node');

class BulletList extends Node {
  matching() {
    return this.node.type === 'bullet_list';
  }

  toDOM() {
    return ['ul', this.node.attrs, 0];
  }
}

module.exports = BulletList;
