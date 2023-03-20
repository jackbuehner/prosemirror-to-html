// @ts-check

const Node = require('./Node');
const { slugify } = require('../utils');

class Heading extends Node {
  name = 'heading';

  matching() {
    return this.node.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    const id = this.node.content
      ? slugify(
          this.node.content
            .filter((node) => node.type === 'text')
            .map((node) => node.text)
            .join('')
        )
      : undefined;
    return [`h${this.node.attrs.level}`, { id, ...this.node.attrs }, 0];
  }
}

module.exports = Heading;
