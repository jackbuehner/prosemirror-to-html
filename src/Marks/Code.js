const Mark = require('./Mark');

class Code extends Mark {
  name = 'code';

  matching() {
    return this.mark.type === this.name;
  }

  toDOM() {
    return ['code', this.mark.attrs, 0];
  }
}

module.exports = Code;
