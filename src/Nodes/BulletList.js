// @ts-check

const Node = require('./Node');

class BulletList extends Node {
  name = 'bulletList';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['ul', this.node.attrs, 0];
  }
}

module.exports = BulletList;
