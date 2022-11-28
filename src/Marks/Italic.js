const Mark = require('./Mark');

class Italic extends Mark {
  name = 'italic';

  matching() {
    return this.mark.type === this.name;
  }

  tag() {
    return 'em';
  }
}

module.exports = Italic;
