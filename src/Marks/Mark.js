class Mark {
  name;

  constructor(mark) {
    this.mark = mark;
  }

  matching() {
    return false;
  }

  toDOM() {
    return null;
  }
}

module.exports = Mark;
