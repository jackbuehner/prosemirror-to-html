const Mark = require('./Mark');

class Code extends Mark {
  name = 'code';

  matching() {
    return this.mark.type === this.name;
  }

  tag() {
    return 'code';
  }
}

module.exports = Code;
