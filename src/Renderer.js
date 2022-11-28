// @ts-check

const { htmlEntities, findKey } = require('./utils');

class Renderer {
  constructor() {
    /**
     * @type {ProsemirrorDoc}
     */
    this.document = {
      type: 'doc',
      content: [],
    };

    /**
     * @type {typeof import('./Nodes/Node')[]}
     */
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

    /**
     * @type {typeof import('./Marks/Mark')[]}
     */
    this.marks = [
      require('./Marks/Bold'),
      require('./Marks/Code'),
      require('./Marks/Italic'),
      require('./Marks/Link'),
    ];
  }

  /**
   * Sets the document property in the constructor to the prosemirror document.
   * @param {ProsemirrorDoc | ProsemirrorDocNode[]} value prosemirror document
   */
  setDocument(value) {
    // ensure the the prosmirror document is an object instead of JSON string
    if (typeof value === 'string') {
      value = JSON.parse(value);
    }

    // set the document property in the instance
    if (Array.isArray(value)) {
      this.document = { type: 'doc', content: value };
    } else {
      this.document = value;
    }
  }

  /**
   * Renders a node to html.
   *
   * @param {ProsemirrorDocNode} node
   * @returns
   */
  renderNode(node) {
    const nodeText = this.getNodeText(node);
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
            const maybeDOMOutputSpec = renderClass.toDOM(nodeText);
            /**
             * @type {DOMOutputSpec}
             */
            const DOMOutputSpec = Array.isArray(maybeDOMOutputSpec)
              ? maybeDOMOutputSpec
              : ['span', {}, 0];
            const specObj = this.generateSpecObject(DOMOutputSpec);

            let holeReached = false;
            /**
             * @param {typeof specObj[]} children
             */
            const render = (children) => {
              children.map(({ tag, hole, attrs, children }) => {
                // if the hole is reached, we cannot render anything else
                // because it would be in the wrong order
                if (holeReached) return;

                // render opening tag
                html.push(this.renderOpeningTag({ tag, attrs }));

                // stop render at content or text (if applicable to this node)
                if (hole) {
                  // do nothing so that content will appear
                  holeReached = true;
                }

                // render children only if they exist and the hole was not rendered for the same tag
                // (the hole must be the only child)
                else if (children) {
                  render(children);
                }

                // if the hole is not reached, we need to make sure
                // we render closing tags
                if (!holeReached) {
                  html.push(this.renderClosingTag(tag));
                }
              });
            };

            render([specObj]);
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
        const maybeDOMOutputSpec = renderClass.toDOM();
        /**
         * @type {DOMOutputSpec}
         */
        const DOMOutputSpec = Array.isArray(maybeDOMOutputSpec)
          ? maybeDOMOutputSpec
          : ['div', {}, 0];
        const specObj = this.generateSpecObject(DOMOutputSpec);

        /**
         * @param {typeof specObj[]} children
         */
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
    } else if (renderClass?.text()) {
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

            // if the mark type matches, render the closing tag for the mark
            if (renderClass.matching()) {
              const maybeDOMOutputSpec = renderClass.toDOM(nodeText);
              /**
               * @type {DOMOutputSpec}
               */
              const DOMOutputSpec = Array.isArray(maybeDOMOutputSpec)
                ? maybeDOMOutputSpec
                : ['span', {}, 0];
              const specObj = this.generateSpecObject(DOMOutputSpec);

              let holeReached = false;
              /**
               * @param {typeof specObj[]} children
               */
              const render = (children) => {
                children.map(({ tag, hole, attrs, children }) => {
                  // after the hole, we still need to render opening tags
                  if (holeReached) {
                    html.push(this.renderOpeningTag({ tag, attrs }));
                  }

                  // render child tags before parent closing tags
                  if (children && !hole) {
                    render(children);
                  }

                  if (hole) {
                    holeReached = true;
                  }

                  // render closing tag only after hole is reached
                  // (closing tags would have already been rendered before the hole)
                  if (holeReached) {
                    html.push(this.renderClosingTag(tag));
                  }
                });
              };

              render([specObj]);
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
   * @param {DOMOutputSpec} spec
   */
  generateSpecObject(spec) {
    /**
     * @typedef {{ tag: string, hole: boolean; attrs: { [key: string]: string | number | boolean | undefined }, children: SpecObj[] }} SpecObj
     */

    /**
     * @type {SpecObj[]}
     */
    let specHierarchy = [];

    /**
     * @param {DOMOutputSpec | string} spec
     * @param {number} level
     * @param {string | undefined} parentTag
     * @param {DOMOutputSpec | undefined} tagArray
     */
    const processDOMOutputSpec = (spec, level = 0, parentTag = undefined, tagArray = undefined) => {
      // if the spec argument is an array, send it through the function again
      if (Array.isArray(spec)) {
        spec.map((sp, i) => {
          if (typeof sp === 'string') {
            processDOMOutputSpec(
              sp,
              i === 0 ? level : level + 1,
              i === 0 ? parentTag : spec[0],
              spec
            );
          }
        });
      }

      // if the spec argument is a string, spec is the name of the tag and `tagArray` is defined
      // `tagArray` is one of these options: [tagName], [tagName, 0], [tagName, attrs], [tagName, attrs, 0]
      // see https://prosemirror.net/docs/ref/#model.DOMOutputSpec
      if (tagArray && typeof spec === 'string') {
        /**
         * @type {SpecObj}
         */
        const obj = {
          tag: tagArray[0],
          hole: tagArray[1] === 0 || tagArray[2] === 0,
          // @ts-ignore
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
    return specHierarchy[0] || null;
  }

  /**
   * Gets the text content of the node by returning `node.text` for the node or its children.
   *
   * @param {ProsemirrorDocNode} node
   * @returns {string}
   */
  getNodeText(node) {
    if (node.text) return node.text;

    if (this.nodes) {
      const NodeClass = new (this.nodes?.find((Node) => new Node(null).name === node.type) ||
        require('./Nodes/Node'))(null);
      if (typeof NodeClass.text() === 'string') return NodeClass.text() || '';
    }

    return node.content?.map((_node) => this.getNodeText.apply(this, [_node])).join('') || '';
  }

  /**
   * Renders an opening tags for a node or mark from a tag name and its attributes.
   *
   * Tags in the array may be an object with `tag` and `attrs` property.
   *
   * _This function only creates the opening tags for html (`<div>`)._
   *
   * __Example input:__
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
   * @param {{ tag: string; attrs: { [key: string]: string | number | boolean | undefined }; }} input
   * @returns
   */
  renderOpeningTag(input) {
    // build a string representation of the node attributes
    let attrs = '';
    if (input.attrs) {
      for (let attribute in input.attrs) {
        const value = input.attrs[attribute];
        if (value) {
          attrs += ` ${attribute}="${value}"`;
        }
      }
    }

    // return the tag and its attributes
    return `<${input.tag}${attrs}>`;
  }

  /**
   * Renders a closing tag for a node or mark from an input tag.
   *
   * _This function only creates the closing tags for html (`</div>`)._
   *
   * @param {string} tag
   * @returns
   */
  renderClosingTag(tag) {
    return `</${tag}>`;
  }

  /**
   * Converts a given prosemirror doc into html.
   * @param {ProsemirrorDoc | ProsemirrorDocNode[]} value prosemirror doc
   * @returns html string
   */
  render(value) {
    // set the document propery in the constructor the prosemirror doc
    this.setDocument(value);

    // store each rendered node as an array of html strings
    /**
     * @type {string[]}
     */
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
   * @param {typeof import('./Nodes/Node')} node
   */
  addNode(node) {
    const currentIndex = this.marks.findIndex(
      (Node) => new Node(null).name === new node(null).name
    );
    if (currentIndex >= 0) {
      this.nodes[currentIndex] = node;
    } else {
      this.nodes.push(node);
    }
  }

  /**
   * Add instructions for rendering a set of nodes.
   *
   * @param {typeof import('./Nodes/Node')[]} nodes
   */
  addNodes(nodes) {
    for (const i in nodes) {
      this.addNode(nodes[i]);
    }
  }

  /**
   * Add instructions for rending a mark.
   *
   * @param {typeof import('./Marks/Mark')} mark
   */
  addMark(mark) {
    const currentIndex = this.marks.findIndex(
      (Mark) => new Mark(null).name === new mark(null).name
    );
    if (currentIndex >= 0) {
      this.marks[currentIndex] = mark;
    } else {
      this.marks.push(mark);
    }
  }

  /**
   * Add instructions for rendering a set of marks.
   *
   * @param {typeof import('./Marks/Mark')[]} marks
   */
  addMarks(marks) {
    for (const i in marks) {
      this.addMark(marks[i]);
    }
  }
}

/**
 * @typedef {[string, Record<string, string | number | boolean | undefined> | 0 | DOMOutputSpec, ...(DOMOutputSpec | 0)[]]} DOMOutputSpec
 */

/**
 * @typedef {{ type: 'doc', content: ProsemirrorDocNode[] }} ProsemirrorDoc
 * @typedef {{ type: string, attrs?: {[key: string]: string | number | boolean | undefined }, text?: string, content: ProsemirrorDocNode[], marks: ProsemirrorDocMark[] }} ProsemirrorDocNode
 * @typedef {{ type: string, attrs?: {[key: string]: string | number | boolean | undefined } }} ProsemirrorDocMark
 */

module.exports = Renderer;
