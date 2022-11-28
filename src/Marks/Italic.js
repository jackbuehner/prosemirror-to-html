// @ts-check

const Mark = require('./Mark');

class Italic extends Mark {
  name = 'italic';

  matching() {
    return this.mark.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['em', this.mark.attrs, 0];
  }
}

module.exports = Italic;
