const Node = require('./Node');
const { slugify } = require('../utils');

class Heading extends Node {
  matching() {
    return this.node.type === 'heading';
  }

  toDOM() {
    const id = slugify(
      this.node.content
        ?.filter((node) => node.type === 'text')
        .map((node) => node.text)
        .join('')
    );
    return [`h${this.node.attrs.level}`, { id, ...this.node.attrs }, 0];
  }
}

module.exports = Heading;
