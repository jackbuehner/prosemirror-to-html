class Node {
  name;

  constructor(node) {
    this.node = node;
  }

  matching() {
    return false;
  }

  selfClosing() {
    return false;
  }

  toDOM() {
    return null;
  }

  text() {
    return null;
  }
}

module.exports = Node;
