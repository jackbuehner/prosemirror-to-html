// @ts-check

const Mark = require('./Mark');

class Bold extends Mark {
  name = 'bold';

  matching() {
    return this.mark.type === this.name;
  }

  /**
   * @returns {import('../Renderer').DOMOutputSpec}
   */
  toDOM() {
    return ['strong', this.mark.attrs, 0];
  }
}

module.exports = Bold;
