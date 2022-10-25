const { htmlEntities, arrayify, findKey } = require('./utils');

class Renderer {
  constructor() {
    this.document = undefined;
    this.nodes = [
      require('./Nodes/Blockquote'),
      require('./Nodes/BulletList'),
      require('./Nodes/CodeBlock'),
      require('./Nodes/Heading'),
      require('./Nodes/HorizontalRule'),
      require('./Nodes/ListItem'),
      require('./Nodes/OrderedList'),
      require('./Nodes/Paragraph'),
      require('./Nodes/Image'),
      require('./Nodes/Table'),
      require('./Nodes/TableCell'),
      require('./Nodes/TableHeader'),
      require('./Nodes/TableRow'),
    ];
    this.marks = [
      require('./Marks/Bold'),
      require('./Marks/Code'),
      require('./Marks/Italic'),
      require('./Marks/Link'),
    ];
  }

  /**
   * Sets the document property in the constructor to the prosemirror document.
   * @param {string | array | {[key: string]: any}} value prosemirror document
   */
  setDocument(value) {
    // ensure the the prosmirror document is an object
    if (typeof value === 'string') {
      value = JSON.parse(value);
    } else if (typeof value === 'array') {
      value = JSON.parse(JSON.stringify(value));
    }

    // set the document property in the constuctor
    this.document = value;
  }

  /**
   * Renders a node to html.
   *
   * @param {*} node
   * @returns
   */
  renderNode(node) {
    let html = [];

    // if the node has marks, render the opening tag
    if (node.marks) {
      node.marks.forEach((mark) => {
        // loop through each renderable mark type to find a compatable mark type
        for (let i in this.marks) {
          const MarkClass = this.marks[i];
          const renderClass = new MarkClass(mark);

          // if the mark type matches, render the opening tag for the mark
          if (renderClass.matching()) {
            html.push(this.renderOpeningTag(renderClass.tag()));
          }
        }
      });
    }

    let renderClass;

    // loop through node type that can be rendered to find a compatable node type
    for (let i in this.nodes) {
      const NodeClass = this.nodes[i];
      renderClass = new NodeClass(node);

      // if the node type matches, render the node
      if (renderClass.matching()) {
        const DOMOutputSpec = arrayify(renderClass.toDOM());
        const specObj = this.generateSpecObject(DOMOutputSpec);

        const render = (children) => {
          children.map(({ tag, hole, attrs, children }) => {
            // render opening tag
            html.push(this.renderOpeningTag({ tag, attrs }));

            // render content or text (if applicable to this node)
            if (hole) {
              if (node.content) {
                for (let i in node.content) {
                  const nestedNode = node.content[i];
                  // render the nested node and push its output to the rendered html array
                  html.push(this.renderNode(nestedNode));
                }
              }
            }

            // render children only if they exist and the hole was not rendered for the same tag
            // (the hole must be the only child)
            else if (children) {
              render(children);
            }

            // render closing tag if it is not a self-closing tag
            if (!renderClass.selfClosing()) html.push(this.renderClosingTag(tag));
          });
        };

        render([specObj]);

        break;
      }
    }

    // if the node is text, render it to html
    if (node.text) {
      // convert special symbols to html entities and push the output to the rendered html array
      html.push(htmlEntities(node.text));
    } else if (renderClass.text()) {
      // push the text to the rendered html array
      html.push(renderClass.text());
    }

    // if the node has marks, render the closing tag
    if (node.marks) {
      node.marks
        .slice()
        .reverse()
        .forEach((mark) => {
          // loop through each renderable mark type to find a compatable mark type
          for (let i in this.marks) {
            const MarkClass = this.marks[i];
            const renderClass = new MarkClass(mark);

            // if the mark type matches, render the opening tag for the mark
            if (renderClass.matching()) {
              html.push(this.renderClosingTag(renderClass.tag()));
            }
          }
        });
    }

    // join the html strings and return it as the rendered node html
    return html.join('');
  }

  /**
   * Converts the spec to an object with all relevant properties.
   *
   * - tag
   * - hole (where content is inserted)
   * - attrs (attributes for each tag)
   * - children (nested tags)
   *
   * @param {*} spec
   */
  generateSpecObject(spec) {
    let specHierarchy = [{}];
    const processDOMOutputSpec = (spec, level = 0, parentTag = undefined, tagArray = undefined) => {
      // if the spec argument is an array, send it through the function again
      if (Array.isArray(spec)) {
        spec.map((sp, i) => {
          processDOMOutputSpec(
            sp,
            i === 0 ? level : level + 1,
            i === 0 ? parentTag : spec[0],
            spec
          );
        });
      }

      // if the spec argument is a string, spec is the name of the tag and `tagArray` is defined
      // `tagArray` is one of these options: [tagName], [tagName, 0], [tagName, attrs], [tagName, attrs, 0]
      // see https://prosemirror.net/docs/ref/#model.DOMOutputSpec
      if (tagArray && typeof spec === 'string') {
        const obj = {
          tag: tagArray[0],
          hole: tagArray[1] === 0 || tagArray[2] === 0,
          attrs:
            Object.prototype.toString.call(tagArray[1]) === '[object Object]' ? tagArray[1] : {},
          children: [],
        };
        if (level === 0) specHierarchy = [obj];
        else findKey(specHierarchy, { tag: parentTag }).children.push(obj);
      }
    };
    processDOMOutputSpec(spec);

    // return the spec as an object
    return specHierarchy[0];
  }

  /**
   * Renders the opening tags for a node or mark from an array of tags.
   *
   * Tags in the array may be strings or an object with `tag` and `attrs` property.
   *
   * _This function only creates the opening tags for html (`<div>`)._
   *
   * __Example input:__
   *
   * ```
   * renderOpeningTag(['div', 'span'])
   * ```
   *
   * ```
   * renderOpeningTag(
   *   [
   *     'div',
   *     {
   *       tag: 'span',
   *       attrs: {
   *         style: 'color: red;'
   *       }
   *     }
   *   ]
   * )
   * ```
   *
   * @param {string | string[] | {tag: string; attrs: {[key: string]: string};} | {tag: string; attrs: {[key: string]: string};}} tags
   * @returns
   */
  renderOpeningTag(tags) {
    // ensure that tags are an array
    tags = arrayify(tags);

    // if there are no tags, return null
    if (!tags || !tags.length) {
      return null;
    }

    return tags
      .map((item) => {
        // if the item is only a string, treat the string as the tag name
        if (typeof item === 'string') {
          return `<${item}>`;
        }

        // build a string representation of the node attributes
        let attrs = '';
        if (item.attrs) {
          for (let attribute in item.attrs) {
            const value = item.attrs[attribute];
            if (value) {
              attrs += ` ${attribute}="${value}"`;
            }
          }
        }

        // return the tag and its attributes
        return `<${item.tag}${attrs}>`;
      })
      .join('');
  }

  /**
   * Renders the closing tags for a node or mark from an array of tags.
   *
   * Tags in the array may be strings or an object with `tag` and `attrs` property.
   *
   * _This function only creates the closing tags for html (`</div>`)._
   *
   * ```
   *
   * @param {string | string[] | {tag: string; attrs: {[key: string]: string};} | {tag: string; attrs: {[key: string]: string};}} tags
   * @returns
   */
  renderClosingTag(tags) {
    // ensure that tags are an array
    tags = arrayify(tags);

    // reverse the order of the tags array since these are closing tags
    tags = tags.slice().reverse();

    // if there are no tags, return null
    if (!tags || !tags.length) {
      return null;
    }

    return tags
      .map((item) => {
        // if the item is only a string, treat the string as the tag name
        if (typeof item === 'string') {
          return `</${item}>`;
        }

        // if the item is an object, get the tag name from the `tag` property
        return `</${item.tag}>`;
      })
      .join('');
  }

  /**
   * Converts a given prosemirror doc into html.
   * @param value prosemirror doc
   * @returns html string
   */
  render(value) {
    // set the document propery in the constructor the prosemirror doc
    this.setDocument(value);

    // store each rendered node as an array of html strings
    let html = [];

    // loop through the document content
    for (const i in this.document.content) {
      let node = this.document.content[i];
      // push the rendered node to the array of html strings
      html.push(this.renderNode(node));
    }

    // join the html strings and return it as the rendered html
    return html.join('');
  }

  /**
   * Add instructions for rendering a node.
   *
   * @param {*} node
   */
  addNode(node) {
    this.nodes.push(node);
  }

  /**
   * Add instructions for rendering a set of nodes.
   *
   * @param {*} nodes
   */
  addNodes(nodes) {
    for (const i in nodes) {
      this.addNode(nodes[i]);
    }
  }

  /**
   * Add instructions for rending a mark.
   *
   * @param {*} mark
   */
  addMark(mark) {
    this.marks.push(mark);
  }

  /**
   * Add instructions for rendering a set of marks.
   * @param {*} marks
   */
  addMarks(marks) {
    for (const i in marks) {
      this.addMark(marks[i]);
    }
  }
}

module.exports = Renderer;
