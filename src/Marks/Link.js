const Mark = require('./Mark');

class Link extends Mark {
  name = 'link';

  matching() {
    return this.mark.type === this.name;
  }

  tag() {
    return [
      {
        tag: 'a',
        attrs: {
          href: this.mark.attrs.href,
        },
      },
    ];
  }
}

module.exports = Link;
