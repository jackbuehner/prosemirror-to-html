const Mark = require('./Mark');

class Link extends Mark {
  name = 'link';

  matching() {
    return this.mark.type === this.name;
  }

  toDOM() {
    return ['a', this.mark.attrs, 0];
  }
}

module.exports = Link;
