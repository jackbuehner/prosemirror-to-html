const Mark = require('./Mark');

class Bold extends Mark {
  name = 'bold';

  matching() {
    return this.mark.type === this.name;
  }

  tag() {
    return 'strong';
  }
}

module.exports = Bold;
