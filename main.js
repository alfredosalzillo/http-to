import { c as createCommonjsModule$1, r as CodeMirror } from './codemirror-12f8cfb2.js';

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = window.customElements !== undefined && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

const boundAttributeSuffix = '$lit$';
/**
 * An updateable Template that tracks the location of dynamic parts.
 */

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */

const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */

class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari dooes not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!isTemplatePartActive(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment poisition.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceeding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceeding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    template.innerHTML = this.getHTML();
    return template;
  }

}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};
const isIterable = value => {
  return Array.isArray(value) || // tslint:disable-next-line:no-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attibute. The value is only set once even if there are multiple parts
 * for an attribute.
 */

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = this.parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!isDirective(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while (isDirective(this.value)) {
      const directive = this.value;
      this.value = noChange;
      directive(this);
    }

    if (this.value === noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild(createMarker());
    this.endNode = container.appendChild(createMarker());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = createMarker());

    part.__insert(this.endNode = createMarker());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = createMarker());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while (isDirective(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === nothing) {
      this.value = nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while (isDirective(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = noChange;
      directive(this);
    }

    if (this.__pendingValue === noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // tslint:disable-next-line:no-any

      this.element[this.name] = this._getValue();
    }
  }

}
class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.

let eventOptionsSupported = false;

try {
  const options = {
    get capture() {
      eventOptionsSupported = true;
      return false;
    }

  }; // tslint:disable-next-line:no-any

  window.addEventListener('test', options, options); // tslint:disable-next-line:no-any

  window.removeEventListener('test', options, options);
} catch (_e) {}

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while (isDirective(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = noChange;
      directive(this);
    }

    if (this.__pendingValue === noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */

class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new NodePart(options);
  }

}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */

function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    removeNodes(container, container.firstChild);
    parts.set(container, part = new NodePart(Object.assign({
      templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time

(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */

const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

const defined = new Map();
const define = (Constructor, {
  name = `app-${String.fromCharCode(...[...(Date.now().toString() + Map.length)].map(n => Number(n) + 97))}`,
  ...options
} = {}) => {
  if (defined.has(Constructor)) {
    return defined.get(Constructor);
  }

  customElements.define(name, Constructor, options);
  defined.set(Constructor, name);
  return name;
};

const isHTMLElement = Constructor => {
  if (!Constructor) {
    return false;
  }

  if (Constructor === HTMLElement) {
    return true;
  }

  return isHTMLElement(Constructor.prototype);
}; // Pre parse strings and HTMLElement before pass to lit-html


var html$1 = ((strings, ...values) => {
  const parsedStrings = strings.map((string, i) => {
    const value = values[i];

    if (isHTMLElement(value)) {
      return [string, define(value)].join('');
    }

    if (typeof value === 'string') {
      return [string, value].join('');
    }

    return string;
  }).reduce((acc, string, i) => {
    const value = values[i - 1];

    if (typeof value === 'string' || isHTMLElement(value)) {
      const [last, ...rest] = acc.reverse();
      return [...rest.reverse(), [last, string].join('')];
    }

    return [...acc, string];
  }, []);
  const parsedValues = values.filter(value => !(isHTMLElement(value) || typeof value === 'string'));
  return html(parsedStrings, ...parsedValues);
});

let current;
let currentId = 0;

function setCurrent(state) {
  current = state;
}

function clear() {
  current = null;
  currentId = 0;
}

function notify() {
  return currentId++;
}

const phaseSymbol = Symbol('haunted.phase');
const hookSymbol = Symbol('haunted.hook');
const updateSymbol = Symbol('haunted.update');
const commitSymbol = Symbol('haunted.commit');
const effectsSymbol = Symbol('haunted.effects');
const layoutEffectsSymbol = Symbol('haunted.layoutEffects');
const contextEvent = 'haunted.context';

class State {
  constructor(update, host) {
    this.update = update;
    this.host = host;
    this[hookSymbol] = new Map();
    this[effectsSymbol] = [];
    this[layoutEffectsSymbol] = [];
  }

  run(cb) {
    setCurrent(this);
    let res = cb();
    clear();
    return res;
  }

  _runEffects(phase) {
    let effects = this[phase];
    setCurrent(this);

    for (let effect of effects) {
      effect.call(this);
    }

    clear();
  }

  runEffects() {
    this._runEffects(effectsSymbol);
  }

  runLayoutEffects() {
    this._runEffects(layoutEffectsSymbol);
  }

  teardown() {
    let hooks = this[hookSymbol];
    hooks.forEach(hook => {
      if (typeof hook.teardown === 'function') {
        hook.teardown();
      }
    });
  }

}

const defer = Promise.resolve().then.bind(Promise.resolve());

function runner() {
  let tasks = [];
  let id;

  function runTasks() {
    id = null;
    let t = tasks;
    tasks = [];

    for (var i = 0, len = t.length; i < len; i++) {
      t[i]();
    }
  }

  return function (task) {
    tasks.push(task);

    if (id == null) {
      id = defer(runTasks);
    }
  };
}

const read = runner();
const write = runner();

class BaseScheduler {
  constructor(renderer, host) {
    this.renderer = renderer;
    this.host = host;
    this.state = new State(this.update.bind(this), host);
    this[phaseSymbol] = null;
    this._updateQueued = false;
  }

  update() {
    if (this._updateQueued) return;
    read(() => {
      let result = this.handlePhase(updateSymbol);
      write(() => {
        this.handlePhase(commitSymbol, result);
        write(() => {
          this.handlePhase(effectsSymbol);
        });
      });
      this._updateQueued = false;
    });
    this._updateQueued = true;
  }

  handlePhase(phase, arg) {
    this[phaseSymbol] = phase;

    switch (phase) {
      case commitSymbol:
        this.commit(arg);
        this.runEffects(layoutEffectsSymbol);
        return;

      case updateSymbol:
        return this.render();

      case effectsSymbol:
        return this.runEffects(effectsSymbol);
    }

    this[phaseSymbol] = null;
  }

  render() {
    return this.state.run(() => this.renderer.call(this.host, this.host));
  }

  runEffects(phase) {
    this.state._runEffects(phase);
  }

  teardown() {
    this.state.teardown();
  }

}

const toCamelCase = (val = '') => val.replace(/-+([a-z])?/g, (_, char) => char ? char.toUpperCase() : '');

function makeComponent(render) {
  class Scheduler extends BaseScheduler {
    constructor(renderer, frag, host) {
      super(renderer, host || frag);
      this.frag = frag;
    }

    commit(result) {
      render(result, this.frag);
    }

  }

  function component(renderer, baseElementOrOptions, options) {
    const BaseElement = (options || baseElementOrOptions || {}).baseElement || HTMLElement;
    const {
      observedAttributes = [],
      useShadowDOM = true,
      shadowRootInit = {}
    } = options || baseElementOrOptions || {};

    class Element extends BaseElement {
      constructor() {
        super();

        if (useShadowDOM === false) {
          this._scheduler = new Scheduler(renderer, this);
        } else {
          this.attachShadow({
            mode: 'open',
            ...shadowRootInit
          });
          this._scheduler = new Scheduler(renderer, this.shadowRoot, this);
        }
      }

      static get observedAttributes() {
        return renderer.observedAttributes || observedAttributes || [];
      }

      connectedCallback() {
        this._scheduler.update();
      }

      disconnectedCallback() {
        this._scheduler.teardown();
      }

      attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
          return;
        }

        let val = newValue === '' ? true : newValue;
        Reflect.set(this, toCamelCase(name), val);
      }

    }

    function reflectiveProp(initialValue) {
      let value = initialValue;
      return Object.freeze({
        enumerable: true,
        configurable: true,

        get() {
          return value;
        },

        set(newValue) {
          value = newValue;

          this._scheduler.update();
        }

      });
    }

    const proto = new Proxy(BaseElement.prototype, {
      getPrototypeOf(target) {
        return target;
      },

      set(target, key, value, receiver) {
        let desc;

        if (key in target) {
          desc = Object.getOwnPropertyDescriptor(target, key);

          if (desc && desc.set) {
            desc.set.call(receiver, value);
            return true;
          }

          Reflect.set(target, key, value);
        }

        if (typeof key === 'symbol' || key[0] === '_') {
          desc = {
            enumerable: true,
            configurable: true,
            writable: true,
            value
          };
        } else {
          desc = reflectiveProp(value);
        }

        Object.defineProperty(receiver, key, desc);

        if (desc.set) {
          desc.set.call(receiver, value);
        }

        return true;
      }

    });
    Object.setPrototypeOf(Element.prototype, proto);
    return Element;
  }

  return component;
}

class Hook {
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }

}

function use(Hook, ...args) {
  let id = notify();
  let hooks = current[hookSymbol];
  let hook = hooks.get(id);

  if (!hook) {
    hook = new Hook(id, current, ...args);
    hooks.set(id, hook);
  }

  return hook.update(...args);
}

function hook(Hook) {
  return use.bind(null, Hook);
}

function createEffect(setEffects) {
  return hook(class extends Hook {
    constructor(id, state, ignored1, ignored2) {
      super(id, state);
      setEffects(state, this);
    }

    update(callback, values) {
      this.callback = callback;
      this.lastValues = this.values;
      this.values = values;
    }

    call() {
      if (!this.values || this.hasChanged()) {
        this.run();
      }
    }

    run() {
      this.teardown();
      this._teardown = this.callback.call(this.state);
    }

    teardown() {
      if (typeof this._teardown === 'function') {
        this._teardown();
      }
    }

    hasChanged() {
      return !this.lastValues || this.values.some((value, i) => this.lastValues[i] !== value);
    }

  });
}

function setEffects(state, cb) {
  state[effectsSymbol].push(cb);
}

const useEffect = createEffect(setEffects);

const useContext = hook(class extends Hook {
  constructor(id, state, _) {
    super(id, state);
    this._updater = this._updater.bind(this);
    this._ranEffect = false;
    this._unsubscribe = null;
    setEffects(state, this);
  }

  update(Context) {
    if (this.state.virtual) {
      throw new Error('can\'t be used with virtual components');
    }

    if (this.Context !== Context) {
      this._subscribe(Context);

      this.Context = Context;
    }

    return this.value;
  }

  call() {
    if (!this._ranEffect) {
      this._ranEffect = true;
      if (this._unsubscribe) this._unsubscribe();

      this._subscribe(this.Context);

      this.state.update();
    }
  }

  _updater(value) {
    this.value = value;
    this.state.update();
  }

  _subscribe(Context) {
    const detail = {
      Context,
      callback: this._updater
    };
    this.state.host.dispatchEvent(new CustomEvent(contextEvent, {
      detail,
      bubbles: true,
      cancelable: true,
      composed: true
    }));
    const {
      unsubscribe,
      value
    } = detail;
    this.value = unsubscribe ? value : Context.defaultValue;
    this._unsubscribe = unsubscribe;
  }

  teardown() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

});

function makeContext(component) {
  return defaultValue => {
    const Context = {
      Provider: class extends HTMLElement {
        constructor() {
          super();
          this.listeners = new Set();
          this.addEventListener(contextEvent, this);
        }

        disconnectedCallback() {
          this.removeEventListener(contextEvent, this);
        }

        handleEvent(event) {
          const {
            detail
          } = event;

          if (detail.Context === Context) {
            detail.value = this.value;
            detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);
            this.listeners.add(detail.callback);
            event.stopPropagation();
          }
        }

        unsubscribe(callback) {
          this.listeners.delete(callback);
        }

        set value(value) {
          this._value = value;

          for (let callback of this.listeners) {
            callback(value);
          }
        }

        get value() {
          return this._value;
        }

      },
      Consumer: component(function ({
        render
      }) {
        const context = useContext(Context);
        return render(context);
      }),
      defaultValue
    };
    return Context;
  };
}

const useMemo = hook(class extends Hook {
  constructor(id, state, fn, values) {
    super(id, state);
    this.value = fn();
    this.values = values;
  }

  update(fn, values) {
    if (this.hasChanged(values)) {
      this.values = values;
      this.value = fn();
    }

    return this.value;
  }

  hasChanged(values) {
    return values.some((value, i) => this.values[i] !== value);
  }

});

const useCallback = (fn, inputs) => useMemo(() => fn, inputs);

function setLayoutEffects(state, cb) {
  state[layoutEffectsSymbol].push(cb);
}

const useLayoutEffect = createEffect(setLayoutEffects);

const useState = hook(class extends Hook {
  constructor(id, state, initialValue) {
    super(id, state);
    this.updater = this.updater.bind(this);

    if (typeof initialValue === 'function') {
      initialValue = initialValue();
    }

    this.makeArgs(initialValue);
  }

  update() {
    return this.args;
  }

  updater(value) {
    if (typeof value === 'function') {
      const updaterFn = value;
      const [previousValue] = this.args;
      value = updaterFn(previousValue);
    }

    this.makeArgs(value);
    this.state.update();
  }

  makeArgs(value) {
    this.args = Object.freeze([value, this.updater]);
  }

});

const useReducer = hook(class extends Hook {
  constructor(id, state, _, initialState) {
    super(id, state);
    this.dispatch = this.dispatch.bind(this);
    this.currentState = initialState;
  }

  update(reducer) {
    this.reducer = reducer;
    return [this.currentState, this.dispatch];
  }

  dispatch(action) {
    this.currentState = this.reducer(this.currentState, action);
    this.state.update();
  }

});

const useRef = initialValue => useMemo(() => ({
  current: initialValue
}), []);

function haunted({
  render
}) {
  const component = makeComponent(render);
  const createContext = makeContext(component);
  return {
    component,
    createContext
  };
}

const {
  component,
  createContext
} = haunted({
  render
});

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var stylis = createCommonjsModule(function (module, exports) {
  /*
   *          __        ___
   *    _____/ /___  __/ (_)____
   *   / ___/ __/ / / / / / ___/
   *  (__  ) /_/ /_/ / / (__  )
   * /____/\__/\__, /_/_/____/
   *          /____/
   *
   * light - weight css preprocessor @licence MIT
   */
  (function (factory) {
    /* eslint-disable */
    module['exports'] = factory(null);
  })(
  /** @param {*=} options */
  function factory(options) {
    /**
     * Notes
     *
     * The ['<method name>'] pattern is used to support closure compiler
     * the jsdoc signatures are also used to the same effect
     *
     * ----
     *
     * int + int + int === n4 [faster]
     *
     * vs
     *
     * int === n1 && int === n2 && int === n3
     *
     * ----
     *
     * switch (int) { case ints...} [faster]
     *
     * vs
     *
     * if (int == 1 && int === 2 ...)
     *
     * ----
     *
     * The (first*n1 + second*n2 + third*n3) format used in the property parser
     * is a simple way to hash the sequence of characters
     * taking into account the index they occur in
     * since any number of 3 character sequences could produce duplicates.
     *
     * On the other hand sequences that are directly tied to the index of the character
     * resolve a far more accurate measure, it's also faster
     * to evaluate one condition in a switch statement
     * than three in an if statement regardless of the added math.
     *
     * This allows the vendor prefixer to be both small and fast.
     */
    var nullptn = /^\0+/g;
    /* matches leading null characters */

    var formatptn = /[\0\r\f]/g;
    /* matches new line, null and formfeed characters */

    var colonptn = /: */g;
    /* splits animation rules */

    var cursorptn = /zoo|gra/;
    /* assert cursor varient */

    var transformptn = /([,: ])(transform)/g;
    /* vendor prefix transform, older webkit */

    var animationptn = /,+\s*(?![^(]*[)])/g;
    /* splits multiple shorthand notation animations */

    var propertiesptn = / +\s*(?![^(]*[)])/g;
    /* animation properties */

    var elementptn = / *[\0] */g;
    /* selector elements */

    var selectorptn = /,\r+?/g;
    /* splits selectors */

    var andptn = /([\t\r\n ])*\f?&/g;
    /* match & */

    var escapeptn = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g;
    /* matches :global(.*) */

    var invalidptn = /\W+/g;
    /* removes invalid characters from keyframes */

    var keyframeptn = /@(k\w+)\s*(\S*)\s*/;
    /* matches @keyframes $1 */

    var plcholdrptn = /::(place)/g;
    /* match ::placeholder varient */

    var readonlyptn = /:(read-only)/g;
    /* match :read-only varient */

    var beforeptn = /\s+(?=[{\];=:>])/g;
    /* matches \s before ] ; = : */

    var afterptn = /([[}=:>])\s+/g;
    /* matches \s after characters [ } = : */

    var tailptn = /(\{[^{]+?);(?=\})/g;
    /* matches tail semi-colons ;} */

    var whiteptn = /\s{2,}/g;
    /* matches repeating whitespace */

    var pseudoptn = /([^\(])(:+) */g;
    /* pseudo element */

    var writingptn = /[svh]\w+-[tblr]{2}/;
    /* match *gradient property */

    var supportsptn = /\(\s*(.*)\s*\)/g;
    /* match supports (groups) */

    var propertyptn = /([\s\S]*?);/g;
    /* match properties leading semicolon */

    var selfptn = /-self|flex-/g;
    /* match flex- and -self in align-self: flex-*; */

    var pseudofmt = /[^]*?(:[rp][el]a[\w-]+)[^]*/;
    /* match tail whitspace */

    var dimensionptn = /stretch|:\s*\w+\-(?:conte|avail)/;
    /* match max/min/fit-content, fill-available */

    var imgsrcptn = /([^-])(image-set\()/;
    /* vendors */

    var webkit = '-webkit-';
    var moz = '-moz-';
    var ms = '-ms-';
    /* character codes */

    var SEMICOLON = 59;
    /* ; */

    var CLOSEBRACES = 125;
    /* } */

    var OPENBRACES = 123;
    /* { */

    var OPENPARENTHESES = 40;
    /* ( */

    var CLOSEPARENTHESES = 41;
    /* ) */

    var OPENBRACKET = 91;
    /* [ */

    var CLOSEBRACKET = 93;
    /* ] */

    var NEWLINE = 10;
    /* \n */

    var CARRIAGE = 13;
    /* \r */

    var TAB = 9;
    /* \t */

    var AT = 64;
    /* @ */

    var SPACE = 32;
    /*   */

    var AND = 38;
    /* & */

    var DASH = 45;
    /* - */

    var UNDERSCORE = 95;
    /* _ */

    var STAR = 42;
    /* * */

    var COMMA = 44;
    /* , */

    var COLON = 58;
    /* : */

    var SINGLEQUOTE = 39;
    /* ' */

    var DOUBLEQUOTE = 34;
    /* " */

    var FOWARDSLASH = 47;
    /* / */

    var GREATERTHAN = 62;
    /* > */

    var PLUS = 43;
    /* + */

    var TILDE = 126;
    /* ~ */

    var NULL = 0;
    /* \0 */

    var FORMFEED = 12;
    /* \f */

    var VERTICALTAB = 11;
    /* \v */

    /* special identifiers */

    var KEYFRAME = 107;
    /* k */

    var MEDIA = 109;
    /* m */

    var SUPPORTS = 115;
    /* s */

    var PLACEHOLDER = 112;
    /* p */

    var READONLY = 111;
    /* o */

    var IMPORT = 105;
    /* <at>i */

    var CHARSET = 99;
    /* <at>c */

    var DOCUMENT = 100;
    /* <at>d */

    var PAGE = 112;
    /* <at>p */

    var column = 1;
    /* current column */

    var line = 1;
    /* current line numebr */

    var pattern = 0;
    /* :pattern */

    var cascade = 1;
    /* #id h1 h2 vs h1#id h2#id  */

    var prefix = 1;
    /* vendor prefix */

    var escape = 1;
    /* escape :global() pattern */

    var compress = 0;
    /* compress output */

    var semicolon = 0;
    /* no/semicolon option */

    var preserve = 0;
    /* preserve empty selectors */

    /* empty reference */

    var array = [];
    /* plugins */

    var plugins = [];
    var plugged = 0;
    var should = null;
    /* plugin context */

    var POSTS = -2;
    var PREPS = -1;
    var UNKWN = 0;
    var PROPS = 1;
    var BLCKS = 2;
    var ATRUL = 3;
    /* plugin newline context */

    var unkwn = 0;
    /* keyframe animation */

    var keyed = 1;
    var key = '';
    /* selector namespace */

    var nscopealt = '';
    var nscope = '';
    /**
     * Compile
     *
     * @param {Array<string>} parent
     * @param {Array<string>} current
     * @param {string} body
     * @param {number} id
     * @param {number} depth
     * @return {string}
     */

    function compile(parent, current, body, id, depth) {
      var bracket = 0;
      /* brackets [] */

      var comment = 0;
      /* comments /* // or /* */

      var parentheses = 0;
      /* functions () */

      var quote = 0;
      /* quotes '', "" */

      var first = 0;
      /* first character code */

      var second = 0;
      /* second character code */

      var code = 0;
      /* current character code */

      var tail = 0;
      /* previous character code */

      var trail = 0;
      /* character before previous code */

      var peak = 0;
      /* previous non-whitespace code */

      var counter = 0;
      /* count sequence termination */

      var context = 0;
      /* track current context */

      var atrule = 0;
      /* track @at-rule context */

      var pseudo = 0;
      /* track pseudo token index */

      var caret = 0;
      /* current character index */

      var format = 0;
      /* control character formating context */

      var insert = 0;
      /* auto semicolon insertion */

      var invert = 0;
      /* inverted selector pattern */

      var length = 0;
      /* generic length address */

      var eof = body.length;
      /* end of file(length) */

      var eol = eof - 1;
      /* end of file(characters) */

      var _char = '';
      /* current character */

      var chars = '';
      /* current buffer of characters */

      var child = '';
      /* next buffer of characters */

      var out = '';
      /* compiled body */

      var children = '';
      /* compiled children */

      var flat = '';
      /* compiled leafs */

      var selector;
      /* generic selector address */

      var result;
      /* generic address */
      // ...build body

      while (caret < eof) {
        code = body.charCodeAt(caret); // eof varient

        if (caret === eol) {
          // last character + noop context, add synthetic padding for noop context to terminate
          if (comment + quote + parentheses + bracket !== 0) {
            if (comment !== 0) {
              code = comment === FOWARDSLASH ? NEWLINE : FOWARDSLASH;
            }

            quote = parentheses = bracket = 0;
            eof++;
            eol++;
          }
        }

        if (comment + quote + parentheses + bracket === 0) {
          // eof varient
          if (caret === eol) {
            if (format > 0) {
              chars = chars.replace(formatptn, '');
            }

            if (chars.trim().length > 0) {
              switch (code) {
                case SPACE:
                case TAB:
                case SEMICOLON:
                case CARRIAGE:
                case NEWLINE:
                  {
                    break;
                  }

                default:
                  {
                    chars += body.charAt(caret);
                  }
              }

              code = SEMICOLON;
            }
          } // auto semicolon insertion


          if (insert === 1) {
            switch (code) {
              // false flags
              case OPENBRACES:
              case CLOSEBRACES:
              case SEMICOLON:
              case DOUBLEQUOTE:
              case SINGLEQUOTE:
              case OPENPARENTHESES:
              case CLOSEPARENTHESES:
              case COMMA:
                {
                  insert = 0;
                }
              // ignore

              case TAB:
              case CARRIAGE:
              case NEWLINE:
              case SPACE:
                {
                  break;
                }
              // valid

              default:
                {
                  insert = 0;
                  length = caret;
                  first = code;
                  caret--;
                  code = SEMICOLON;

                  while (length < eof) {
                    switch (body.charCodeAt(length++)) {
                      case NEWLINE:
                      case CARRIAGE:
                      case SEMICOLON:
                        {
                          ++caret;
                          code = first;
                          length = eof;
                          break;
                        }

                      case COLON:
                        {
                          if (format > 0) {
                            ++caret;
                            code = first;
                          }
                        }

                      case OPENBRACES:
                        {
                          length = eof;
                        }
                    }
                  }
                }
            }
          } // token varient


          switch (code) {
            case OPENBRACES:
              {
                chars = chars.trim();
                first = chars.charCodeAt(0);
                counter = 1;
                length = ++caret;

                while (caret < eof) {
                  switch (code = body.charCodeAt(caret)) {
                    case OPENBRACES:
                      {
                        counter++;
                        break;
                      }

                    case CLOSEBRACES:
                      {
                        counter--;
                        break;
                      }

                    case FOWARDSLASH:
                      {
                        switch (second = body.charCodeAt(caret + 1)) {
                          // /*, //
                          case STAR:
                          case FOWARDSLASH:
                            {
                              caret = delimited(second, caret, eol, body);
                            }
                        }

                        break;
                      }
                    // given "[" === 91 & "]" === 93 hence forth 91 + 1 + 1 === 93

                    case OPENBRACKET:
                      {
                        code++;
                      }
                    // given "(" === 40 & ")" === 41 hence forth 40 + 1 === 41

                    case OPENPARENTHESES:
                      {
                        code++;
                      }
                    // quote tail delimiter is identical to the head delimiter hence noop,
                    // fallthrough clauses have been shifted to the correct tail delimiter

                    case DOUBLEQUOTE:
                    case SINGLEQUOTE:
                      {
                        while (caret++ < eol) {
                          if (body.charCodeAt(caret) === code) {
                            break;
                          }
                        }
                      }
                  }

                  if (counter === 0) {
                    break;
                  }

                  caret++;
                }

                child = body.substring(length, caret);

                if (first === NULL) {
                  first = (chars = chars.replace(nullptn, '').trim()).charCodeAt(0);
                }

                switch (first) {
                  // @at-rule
                  case AT:
                    {
                      if (format > 0) {
                        chars = chars.replace(formatptn, '');
                      }

                      second = chars.charCodeAt(1);

                      switch (second) {
                        case DOCUMENT:
                        case MEDIA:
                        case SUPPORTS:
                        case DASH:
                          {
                            selector = current;
                            break;
                          }

                        default:
                          {
                            selector = array;
                          }
                      }

                      child = compile(current, selector, child, second, depth + 1);
                      length = child.length; // preserve empty @at-rule

                      if (preserve > 0 && length === 0) {
                        length = chars.length;
                      } // execute plugins, @at-rule context


                      if (plugged > 0) {
                        selector = select(array, chars, invert);
                        result = proxy(ATRUL, child, selector, current, line, column, length, second, depth, id);
                        chars = selector.join('');

                        if (result !== void 0) {
                          if ((length = (child = result.trim()).length) === 0) {
                            second = 0;
                            child = '';
                          }
                        }
                      }

                      if (length > 0) {
                        switch (second) {
                          case SUPPORTS:
                            {
                              chars = chars.replace(supportsptn, supports);
                            }

                          case DOCUMENT:
                          case MEDIA:
                          case DASH:
                            {
                              child = chars + '{' + child + '}';
                              break;
                            }

                          case KEYFRAME:
                            {
                              chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''));
                              child = chars + '{' + child + '}';

                              if (prefix === 1 || prefix === 2 && vendor('@' + child, 3)) {
                                child = '@' + webkit + child + '@' + child;
                              } else {
                                child = '@' + child;
                              }

                              break;
                            }

                          default:
                            {
                              child = chars + child;

                              if (id === PAGE) {
                                child = (out += child, '');
                              }
                            }
                        }
                      } else {
                        child = '';
                      }

                      break;
                    }
                  // selector

                  default:
                    {
                      child = compile(current, select(current, chars, invert), child, id, depth + 1);
                    }
                }

                children += child; // reset

                context = 0;
                insert = 0;
                pseudo = 0;
                format = 0;
                invert = 0;
                atrule = 0;
                chars = '';
                child = '';
                code = body.charCodeAt(++caret);
                break;
              }

            case CLOSEBRACES:
            case SEMICOLON:
              {
                chars = (format > 0 ? chars.replace(formatptn, '') : chars).trim();

                if ((length = chars.length) > 1) {
                  // monkey-patch missing colon
                  if (pseudo === 0) {
                    first = chars.charCodeAt(0); // first character is a letter or dash, buffer has a space character

                    if (first === DASH || first > 96 && first < 123) {
                      length = (chars = chars.replace(' ', ':')).length;
                    }
                  } // execute plugins, property context


                  if (plugged > 0) {
                    if ((result = proxy(PROPS, chars, current, parent, line, column, out.length, id, depth, id)) !== void 0) {
                      if ((length = (chars = result.trim()).length) === 0) {
                        chars = '\0\0';
                      }
                    }
                  }

                  first = chars.charCodeAt(0);
                  second = chars.charCodeAt(1);

                  switch (first) {
                    case NULL:
                      {
                        break;
                      }

                    case AT:
                      {
                        if (second === IMPORT || second === CHARSET) {
                          flat += chars + body.charAt(caret);
                          break;
                        }
                      }

                    default:
                      {
                        if (chars.charCodeAt(length - 1) === COLON) {
                          break;
                        }

                        out += property(chars, first, second, chars.charCodeAt(2));
                      }
                  }
                } // reset


                context = 0;
                insert = 0;
                pseudo = 0;
                format = 0;
                invert = 0;
                chars = '';
                code = body.charCodeAt(++caret);
                break;
              }
          }
        } // parse characters


        switch (code) {
          case CARRIAGE:
          case NEWLINE:
            {
              // auto insert semicolon
              if (comment + quote + parentheses + bracket + semicolon === 0) {
                // valid non-whitespace characters that
                // may precede a newline
                switch (peak) {
                  case CLOSEPARENTHESES:
                  case SINGLEQUOTE:
                  case DOUBLEQUOTE:
                  case AT:
                  case TILDE:
                  case GREATERTHAN:
                  case STAR:
                  case PLUS:
                  case FOWARDSLASH:
                  case DASH:
                  case COLON:
                  case COMMA:
                  case SEMICOLON:
                  case OPENBRACES:
                  case CLOSEBRACES:
                    {
                      break;
                    }

                  default:
                    {
                      // current buffer has a colon
                      if (pseudo > 0) {
                        insert = 1;
                      }
                    }
                }
              } // terminate line comment


              if (comment === FOWARDSLASH) {
                comment = 0;
              } else if (cascade + context === 0 && id !== KEYFRAME && chars.length > 0) {
                format = 1;
                chars += '\0';
              } // execute plugins, newline context


              if (plugged * unkwn > 0) {
                proxy(UNKWN, chars, current, parent, line, column, out.length, id, depth, id);
              } // next line, reset column position


              column = 1;
              line++;
              break;
            }

          case SEMICOLON:
          case CLOSEBRACES:
            {
              if (comment + quote + parentheses + bracket === 0) {
                column++;
                break;
              }
            }

          default:
            {
              // increment column position
              column++; // current character

              _char = body.charAt(caret); // remove comments, escape functions, strings, attributes and prepare selectors

              switch (code) {
                case TAB:
                case SPACE:
                  {
                    if (quote + bracket + comment === 0) {
                      switch (tail) {
                        case COMMA:
                        case COLON:
                        case TAB:
                        case SPACE:
                          {
                            _char = '';
                            break;
                          }

                        default:
                          {
                            if (code !== SPACE) {
                              _char = ' ';
                            }
                          }
                      }
                    }

                    break;
                  }
                // escape breaking control characters

                case NULL:
                  {
                    _char = '\\0';
                    break;
                  }

                case FORMFEED:
                  {
                    _char = '\\f';
                    break;
                  }

                case VERTICALTAB:
                  {
                    _char = '\\v';
                    break;
                  }
                // &

                case AND:
                  {
                    // inverted selector pattern i.e html &
                    if (quote + comment + bracket === 0 && cascade > 0) {
                      invert = 1;
                      format = 1;
                      _char = '\f' + _char;
                    }

                    break;
                  }
                // ::p<l>aceholder, l
                // :read-on<l>y, l

                case 108:
                  {
                    if (quote + comment + bracket + pattern === 0 && pseudo > 0) {
                      switch (caret - pseudo) {
                        // ::placeholder
                        case 2:
                          {
                            if (tail === PLACEHOLDER && body.charCodeAt(caret - 3) === COLON) {
                              pattern = tail;
                            }
                          }
                        // :read-only

                        case 8:
                          {
                            if (trail === READONLY) {
                              pattern = trail;
                            }
                          }
                      }
                    }

                    break;
                  }
                // :<pattern>

                case COLON:
                  {
                    if (quote + comment + bracket === 0) {
                      pseudo = caret;
                    }

                    break;
                  }
                // selectors

                case COMMA:
                  {
                    if (comment + parentheses + quote + bracket === 0) {
                      format = 1;
                      _char += '\r';
                    }

                    break;
                  }
                // quotes

                case DOUBLEQUOTE:
                case SINGLEQUOTE:
                  {
                    if (comment === 0) {
                      quote = quote === code ? 0 : quote === 0 ? code : quote;
                    }

                    break;
                  }
                // attributes

                case OPENBRACKET:
                  {
                    if (quote + comment + parentheses === 0) {
                      bracket++;
                    }

                    break;
                  }

                case CLOSEBRACKET:
                  {
                    if (quote + comment + parentheses === 0) {
                      bracket--;
                    }

                    break;
                  }
                // functions

                case CLOSEPARENTHESES:
                  {
                    if (quote + comment + bracket === 0) {
                      parentheses--;
                    }

                    break;
                  }

                case OPENPARENTHESES:
                  {
                    if (quote + comment + bracket === 0) {
                      if (context === 0) {
                        switch (tail * 2 + trail * 3) {
                          // :matches
                          case 533:
                            {
                              break;
                            }
                          // :global, :not, :nth-child etc...

                          default:
                            {
                              counter = 0;
                              context = 1;
                            }
                        }
                      }

                      parentheses++;
                    }

                    break;
                  }

                case AT:
                  {
                    if (comment + parentheses + quote + bracket + pseudo + atrule === 0) {
                      atrule = 1;
                    }

                    break;
                  }
                // block/line comments

                case STAR:
                case FOWARDSLASH:
                  {
                    if (quote + bracket + parentheses > 0) {
                      break;
                    }

                    switch (comment) {
                      // initialize line/block comment context
                      case 0:
                        {
                          switch (code * 2 + body.charCodeAt(caret + 1) * 3) {
                            // //
                            case 235:
                              {
                                comment = FOWARDSLASH;
                                break;
                              }
                            // /*

                            case 220:
                              {
                                length = caret;
                                comment = STAR;
                                break;
                              }
                          }

                          break;
                        }
                      // end block comment context

                      case STAR:
                        {
                          if (code === FOWARDSLASH && tail === STAR && length + 2 !== caret) {
                            // /*<!> ... */, !
                            if (body.charCodeAt(length + 2) === 33) {
                              out += body.substring(length, caret + 1);
                            }

                            _char = '';
                            comment = 0;
                          }
                        }
                    }
                  }
              } // ignore comment blocks


              if (comment === 0) {
                // aggressive isolation mode, divide each individual selector
                // including selectors in :not function but excluding selectors in :global function
                if (cascade + quote + bracket + atrule === 0 && id !== KEYFRAME && code !== SEMICOLON) {
                  switch (code) {
                    case COMMA:
                    case TILDE:
                    case GREATERTHAN:
                    case PLUS:
                    case CLOSEPARENTHESES:
                    case OPENPARENTHESES:
                      {
                        if (context === 0) {
                          // outside of an isolated context i.e nth-child(<...>)
                          switch (tail) {
                            case TAB:
                            case SPACE:
                            case NEWLINE:
                            case CARRIAGE:
                              {
                                _char = _char + '\0';
                                break;
                              }

                            default:
                              {
                                _char = '\0' + _char + (code === COMMA ? '' : '\0');
                              }
                          }

                          format = 1;
                        } else {
                          // within an isolated context, sleep untill it's terminated
                          switch (code) {
                            case OPENPARENTHESES:
                              {
                                // :globa<l>(
                                if (pseudo + 7 === caret && tail === 108) {
                                  pseudo = 0;
                                }

                                context = ++counter;
                                break;
                              }

                            case CLOSEPARENTHESES:
                              {
                                if ((context = --counter) === 0) {
                                  format = 1;
                                  _char += '\0';
                                }

                                break;
                              }
                          }
                        }

                        break;
                      }

                    case TAB:
                    case SPACE:
                      {
                        switch (tail) {
                          case NULL:
                          case OPENBRACES:
                          case CLOSEBRACES:
                          case SEMICOLON:
                          case COMMA:
                          case FORMFEED:
                          case TAB:
                          case SPACE:
                          case NEWLINE:
                          case CARRIAGE:
                            {
                              break;
                            }

                          default:
                            {
                              // ignore in isolated contexts
                              if (context === 0) {
                                format = 1;
                                _char += '\0';
                              }
                            }
                        }
                      }
                  }
                } // concat buffer of characters


                chars += _char; // previous non-whitespace character code

                if (code !== SPACE && code !== TAB) {
                  peak = code;
                }
              }
            }
        } // tail character codes


        trail = tail;
        tail = code; // visit every character

        caret++;
      }

      length = out.length; // preserve empty selector

      if (preserve > 0) {
        if (length === 0 && children.length === 0 && current[0].length === 0 === false) {
          if (id !== MEDIA || current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0]) {
            length = current.join(',').length + 2;
          }
        }
      }

      if (length > 0) {
        // cascade isolation mode?
        selector = cascade === 0 && id !== KEYFRAME ? isolate(current) : current; // execute plugins, block context

        if (plugged > 0) {
          result = proxy(BLCKS, out, selector, parent, line, column, length, id, depth, id);

          if (result !== void 0 && (out = result).length === 0) {
            return flat + out + children;
          }
        }

        out = selector.join(',') + '{' + out + '}';

        if (prefix * pattern !== 0) {
          if (prefix === 2 && !vendor(out, 2)) pattern = 0;

          switch (pattern) {
            // ::read-only
            case READONLY:
              {
                out = out.replace(readonlyptn, ':' + moz + '$1') + out;
                break;
              }
            // ::placeholder

            case PLACEHOLDER:
              {
                out = out.replace(plcholdrptn, '::' + webkit + 'input-$1') + out.replace(plcholdrptn, '::' + moz + '$1') + out.replace(plcholdrptn, ':' + ms + 'input-$1') + out;
                break;
              }
          }

          pattern = 0;
        }
      }

      return flat + out + children;
    }
    /**
     * Select
     *
     * @param {Array<string>} parent
     * @param {string} current
     * @param {number} invert
     * @return {Array<string>}
     */


    function select(parent, current, invert) {
      var selectors = current.trim().split(selectorptn);
      var out = selectors;
      var length = selectors.length;
      var l = parent.length;

      switch (l) {
        // 0-1 parent selectors
        case 0:
        case 1:
          {
            for (var i = 0, selector = l === 0 ? '' : parent[0] + ' '; i < length; ++i) {
              out[i] = scope(selector, out[i], invert, l).trim();
            }

            break;
          }
        // >2 parent selectors, nested

        default:
          {
            for (var i = 0, j = 0, out = []; i < length; ++i) {
              for (var k = 0; k < l; ++k) {
                out[j++] = scope(parent[k] + ' ', selectors[i], invert, l).trim();
              }
            }
          }
      }

      return out;
    }
    /**
     * Scope
     *
     * @param {string} parent
     * @param {string} current
     * @param {number} invert
     * @param {number} level
     * @return {string}
     */


    function scope(parent, current, invert, level) {
      var selector = current;
      var code = selector.charCodeAt(0); // trim leading whitespace

      if (code < 33) {
        code = (selector = selector.trim()).charCodeAt(0);
      }

      switch (code) {
        // &
        case AND:
          {
            switch (cascade + level) {
              case 0:
              case 1:
                {
                  if (parent.trim().length === 0) {
                    break;
                  }
                }

              default:
                {
                  return selector.replace(andptn, '$1' + parent.trim());
                }
            }

            break;
          }
        // :

        case COLON:
          {
            switch (selector.charCodeAt(1)) {
              // g in :global
              case 103:
                {
                  if (escape > 0 && cascade > 0) {
                    return selector.replace(escapeptn, '$1').replace(andptn, '$1' + nscope);
                  }

                  break;
                }

              default:
                {
                  // :hover
                  return parent.trim() + selector.replace(andptn, '$1' + parent.trim());
                }
            }
          }

        default:
          {
            // html &
            if (invert * cascade > 0 && selector.indexOf('\f') > 0) {
              return selector.replace(andptn, (parent.charCodeAt(0) === COLON ? '' : '$1') + parent.trim());
            }
          }
      }

      return parent + selector;
    }
    /**
     * Property
     *
     * @param {string} input
     * @param {number} first
     * @param {number} second
     * @param {number} third
     * @return {string}
     */


    function property(input, first, second, third) {
      var index = 0;
      var out = input + ';';
      var hash = first * 2 + second * 3 + third * 4;
      var cache; // animation: a, n, i characters

      if (hash === 944) {
        return animation(out);
      } else if (prefix === 0 || prefix === 2 && !vendor(out, 1)) {
        return out;
      } // vendor prefix


      switch (hash) {
        // text-decoration/text-size-adjust/text-shadow/text-align/text-transform: t, e, x
        case 1015:
          {
            // text-shadow/text-align/text-transform, a
            return out.charCodeAt(10) === 97 ? webkit + out + out : out;
          }
        // filter/fill f, i, l

        case 951:
          {
            // filter, t
            return out.charCodeAt(3) === 116 ? webkit + out + out : out;
          }
        // color/column, c, o, l

        case 963:
          {
            // column, n
            return out.charCodeAt(5) === 110 ? webkit + out + out : out;
          }
        // box-decoration-break, b, o, x

        case 1009:
          {
            if (out.charCodeAt(4) !== 100) {
              break;
            }
          }
        // mask, m, a, s
        // clip-path, c, l, i

        case 969:
        case 942:
          {
            return webkit + out + out;
          }
        // appearance: a, p, p

        case 978:
          {
            return webkit + out + moz + out + out;
          }
        // hyphens: h, y, p
        // user-select: u, s, e

        case 1019:
        case 983:
          {
            return webkit + out + moz + out + ms + out + out;
          }
        // background/backface-visibility, b, a, c

        case 883:
          {
            // backface-visibility, -
            if (out.charCodeAt(8) === DASH) {
              return webkit + out + out;
            } // image-set(...)


            if (out.indexOf('image-set(', 11) > 0) {
              return out.replace(imgsrcptn, '$1' + webkit + '$2') + out;
            }

            return out;
          }
        // flex: f, l, e

        case 932:
          {
            if (out.charCodeAt(4) === DASH) {
              switch (out.charCodeAt(5)) {
                // flex-grow, g
                case 103:
                  {
                    return webkit + 'box-' + out.replace('-grow', '') + webkit + out + ms + out.replace('grow', 'positive') + out;
                  }
                // flex-shrink, s

                case 115:
                  {
                    return webkit + out + ms + out.replace('shrink', 'negative') + out;
                  }
                // flex-basis, b

                case 98:
                  {
                    return webkit + out + ms + out.replace('basis', 'preferred-size') + out;
                  }
              }
            }

            return webkit + out + ms + out + out;
          }
        // order: o, r, d

        case 964:
          {
            return webkit + out + ms + 'flex' + '-' + out + out;
          }
        // justify-items/justify-content, j, u, s

        case 1023:
          {
            // justify-content, c
            if (out.charCodeAt(8) !== 99) {
              break;
            }

            cache = out.substring(out.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
            return webkit + 'box-pack' + cache + webkit + out + ms + 'flex-pack' + cache + out;
          }
        // cursor, c, u, r

        case 1005:
          {
            return cursorptn.test(out) ? out.replace(colonptn, ':' + webkit) + out.replace(colonptn, ':' + moz) + out : out;
          }
        // writing-mode, w, r, i

        case 1000:
          {
            cache = out.substring(13).trim();
            index = cache.indexOf('-') + 1;

            switch (cache.charCodeAt(0) + cache.charCodeAt(index)) {
              // vertical-lr
              case 226:
                {
                  cache = out.replace(writingptn, 'tb');
                  break;
                }
              // vertical-rl

              case 232:
                {
                  cache = out.replace(writingptn, 'tb-rl');
                  break;
                }
              // horizontal-tb

              case 220:
                {
                  cache = out.replace(writingptn, 'lr');
                  break;
                }

              default:
                {
                  return out;
                }
            }

            return webkit + out + ms + cache + out;
          }
        // position: sticky

        case 1017:
          {
            if (out.indexOf('sticky', 9) === -1) {
              return out;
            }
          }
        // display(flex/inline-flex/inline-box): d, i, s

        case 975:
          {
            index = (out = input).length - 10;
            cache = (out.charCodeAt(index) === 33 ? out.substring(0, index) : out).substring(input.indexOf(':', 7) + 1).trim();

            switch (hash = cache.charCodeAt(0) + (cache.charCodeAt(7) | 0)) {
              // inline-
              case 203:
                {
                  // inline-box
                  if (cache.charCodeAt(8) < 111) {
                    break;
                  }
                }
              // inline-box/sticky

              case 115:
                {
                  out = out.replace(cache, webkit + cache) + ';' + out;
                  break;
                }
              // inline-flex
              // flex

              case 207:
              case 102:
                {
                  out = out.replace(cache, webkit + (hash > 102 ? 'inline-' : '') + 'box') + ';' + out.replace(cache, webkit + cache) + ';' + out.replace(cache, ms + cache + 'box') + ';' + out;
                }
            }

            return out + ';';
          }
        // align-items, align-center, align-self: a, l, i, -

        case 938:
          {
            if (out.charCodeAt(5) === DASH) {
              switch (out.charCodeAt(6)) {
                // align-items, i
                case 105:
                  {
                    cache = out.replace('-items', '');
                    return webkit + out + webkit + 'box-' + cache + ms + 'flex-' + cache + out;
                  }
                // align-self, s

                case 115:
                  {
                    return webkit + out + ms + 'flex-item-' + out.replace(selfptn, '') + out;
                  }
                // align-content

                default:
                  {
                    return webkit + out + ms + 'flex-line-pack' + out.replace('align-content', '').replace(selfptn, '') + out;
                  }
              }
            }

            break;
          }
        // min/max

        case 973:
        case 989:
          {
            // min-/max- height/width/block-size/inline-size
            if (out.charCodeAt(3) !== DASH || out.charCodeAt(4) === 122) {
              break;
            }
          }
        // height/width: min-content / width: max-content

        case 931:
        case 953:
          {
            if (dimensionptn.test(input) === true) {
              // stretch
              if ((cache = input.substring(input.indexOf(':') + 1)).charCodeAt(0) === 115) return property(input.replace('stretch', 'fill-available'), first, second, third).replace(':fill-available', ':stretch');else return out.replace(cache, webkit + cache) + out.replace(cache, moz + cache.replace('fill-', '')) + out;
            }

            break;
          }
        // transform, transition: t, r, a

        case 962:
          {
            out = webkit + out + (out.charCodeAt(5) === 102 ? ms + out : '') + out; // transitions

            if (second + third === 211 && out.charCodeAt(13) === 105 && out.indexOf('transform', 10) > 0) {
              return out.substring(0, out.indexOf(';', 27) + 1).replace(transformptn, '$1' + webkit + '$2') + out;
            }

            break;
          }
      }

      return out;
    }
    /**
     * Vendor
     *
     * @param {string} content
     * @param {number} context
     * @return {boolean}
     */


    function vendor(content, context) {
      var index = content.indexOf(context === 1 ? ':' : '{');
      var key = content.substring(0, context !== 3 ? index : 10);
      var value = content.substring(index + 1, content.length - 1);
      return should(context !== 2 ? key : key.replace(pseudofmt, '$1'), value, context);
    }
    /**
     * Supports
     *
     * @param {string} match
     * @param {string} group
     * @return {string}
     */


    function supports(match, group) {
      var out = property(group, group.charCodeAt(0), group.charCodeAt(1), group.charCodeAt(2));
      return out !== group + ';' ? out.replace(propertyptn, ' or ($1)').substring(4) : '(' + group + ')';
    }
    /**
     * Animation
     *
     * @param {string} input
     * @return {string}
     */


    function animation(input) {
      var length = input.length;
      var index = input.indexOf(':', 9) + 1;
      var declare = input.substring(0, index).trim();
      var out = input.substring(index, length - 1).trim();

      switch (input.charCodeAt(9) * keyed) {
        case 0:
          {
            break;
          }
        // animation-*, -

        case DASH:
          {
            // animation-name, n
            if (input.charCodeAt(10) !== 110) {
              break;
            }
          }
        // animation/animation-name

        default:
          {
            // split in case of multiple animations
            var list = out.split((out = '', animationptn));

            for (var i = 0, index = 0, length = list.length; i < length; index = 0, ++i) {
              var value = list[i];
              var items = value.split(propertiesptn);

              while (value = items[index]) {
                var peak = value.charCodeAt(0);

                if (keyed === 1 && ( // letters
                peak > AT && peak < 90 || peak > 96 && peak < 123 || peak === UNDERSCORE || // dash but not in sequence i.e --
                peak === DASH && value.charCodeAt(1) !== DASH)) {
                  // not a number/function
                  switch (isNaN(parseFloat(value)) + (value.indexOf('(') !== -1)) {
                    case 1:
                      {
                        switch (value) {
                          // not a valid reserved keyword
                          case 'infinite':
                          case 'alternate':
                          case 'backwards':
                          case 'running':
                          case 'normal':
                          case 'forwards':
                          case 'both':
                          case 'none':
                          case 'linear':
                          case 'ease':
                          case 'ease-in':
                          case 'ease-out':
                          case 'ease-in-out':
                          case 'paused':
                          case 'reverse':
                          case 'alternate-reverse':
                          case 'inherit':
                          case 'initial':
                          case 'unset':
                          case 'step-start':
                          case 'step-end':
                            {
                              break;
                            }

                          default:
                            {
                              value += key;
                            }
                        }
                      }
                  }
                }

                items[index++] = value;
              }

              out += (i === 0 ? '' : ',') + items.join(' ');
            }
          }
      }

      out = declare + out + ';';
      if (prefix === 1 || prefix === 2 && vendor(out, 1)) return webkit + out + out;
      return out;
    }
    /**
     * Isolate
     *
     * @param {Array<string>} current
     */


    function isolate(current) {
      for (var i = 0, length = current.length, selector = Array(length), padding, element; i < length; ++i) {
        // split individual elements in a selector i.e h1 h2 === [h1, h2]
        var elements = current[i].split(elementptn);
        var out = '';

        for (var j = 0, size = 0, tail = 0, code = 0, l = elements.length; j < l; ++j) {
          // empty element
          if ((size = (element = elements[j]).length) === 0 && l > 1) {
            continue;
          }

          tail = out.charCodeAt(out.length - 1);
          code = element.charCodeAt(0);
          padding = '';

          if (j !== 0) {
            // determine if we need padding
            switch (tail) {
              case STAR:
              case TILDE:
              case GREATERTHAN:
              case PLUS:
              case SPACE:
              case OPENPARENTHESES:
                {
                  break;
                }

              default:
                {
                  padding = ' ';
                }
            }
          }

          switch (code) {
            case AND:
              {
                element = padding + nscopealt;
              }

            case TILDE:
            case GREATERTHAN:
            case PLUS:
            case SPACE:
            case CLOSEPARENTHESES:
            case OPENPARENTHESES:
              {
                break;
              }

            case OPENBRACKET:
              {
                element = padding + element + nscopealt;
                break;
              }

            case COLON:
              {
                switch (element.charCodeAt(1) * 2 + element.charCodeAt(2) * 3) {
                  // :global
                  case 530:
                    {
                      if (escape > 0) {
                        element = padding + element.substring(8, size - 1);
                        break;
                      }
                    }
                  // :hover, :nth-child(), ...

                  default:
                    {
                      if (j < 1 || elements[j - 1].length < 1) {
                        element = padding + nscopealt + element;
                      }
                    }
                }

                break;
              }

            case COMMA:
              {
                padding = '';
              }

            default:
              {
                if (size > 1 && element.indexOf(':') > 0) {
                  element = padding + element.replace(pseudoptn, '$1' + nscopealt + '$2');
                } else {
                  element = padding + element + nscopealt;
                }
              }
          }

          out += element;
        }

        selector[i] = out.replace(formatptn, '').trim();
      }

      return selector;
    }
    /**
     * Proxy
     *
     * @param {number} context
     * @param {string} content
     * @param {Array<string>} selectors
     * @param {Array<string>} parents
     * @param {number} line
     * @param {number} column
     * @param {number} length
     * @param {number} id
     * @param {number} depth
     * @param {number} at
     * @return {(string|void|*)}
     */


    function proxy(context, content, selectors, parents, line, column, length, id, depth, at) {
      for (var i = 0, out = content, next; i < plugged; ++i) {
        switch (next = plugins[i].call(stylis, context, out, selectors, parents, line, column, length, id, depth, at)) {
          case void 0:
          case false:
          case true:
          case null:
            {
              break;
            }

          default:
            {
              out = next;
            }
        }
      }

      if (out !== content) {
        return out;
      }
    }
    /**
     * @param {number} code
     * @param {number} index
     * @param {number} length
     * @param {string} body
     * @return {number}
     */


    function delimited(code, index, length, body) {
      for (var i = index + 1; i < length; ++i) {
        switch (body.charCodeAt(i)) {
          // /*
          case FOWARDSLASH:
            {
              if (code === STAR) {
                if (body.charCodeAt(i - 1) === STAR && index + 2 !== i) {
                  return i + 1;
                }
              }

              break;
            }
          // //

          case NEWLINE:
            {
              if (code === FOWARDSLASH) {
                return i + 1;
              }
            }
        }
      }

      return i;
    }
    /**
     * Minify
     *
     * @param {(string|*)} output
     * @return {string}
     */


    function minify(output) {
      return output.replace(formatptn, '').replace(beforeptn, '').replace(afterptn, '$1').replace(tailptn, '$1').replace(whiteptn, ' ');
    }
    /**
     * Use
     *
     * @param {(Array<function(...?)>|function(...?)|number|void)?} plugin
     */


    function use(plugin) {
      switch (plugin) {
        case void 0:
        case null:
          {
            plugged = plugins.length = 0;
            break;
          }

        default:
          {
            if (typeof plugin === 'function') {
              plugins[plugged++] = plugin;
            } else if (_typeof(plugin) === 'object') {
              for (var i = 0, length = plugin.length; i < length; ++i) {
                use(plugin[i]);
              }
            } else {
              unkwn = !!plugin | 0;
            }
          }
      }

      return use;
    }
    /**
     * Set
     *
     * @param {*} options
     */


    function set(options) {
      for (var name in options) {
        var value = options[name];

        switch (name) {
          case 'keyframe':
            keyed = value | 0;
            break;

          case 'global':
            escape = value | 0;
            break;

          case 'cascade':
            cascade = value | 0;
            break;

          case 'compress':
            compress = value | 0;
            break;

          case 'semicolon':
            semicolon = value | 0;
            break;

          case 'preserve':
            preserve = value | 0;
            break;

          case 'prefix':
            should = null;

            if (!value) {
              prefix = 0;
            } else if (typeof value !== 'function') {
              prefix = 1;
            } else {
              prefix = 2;
              should = value;
            }

        }
      }

      return set;
    }
    /**
     * Stylis
     *
     * @param {string} selector
     * @param {string} input
     * @return {*}
     */


    function stylis(selector, input) {
      if (this !== void 0 && this.constructor === stylis) {
        return factory(selector);
      } // setup


      var ns = selector;
      var code = ns.charCodeAt(0); // trim leading whitespace

      if (code < 33) {
        code = (ns = ns.trim()).charCodeAt(0);
      } // keyframe/animation namespace


      if (keyed > 0) {
        key = ns.replace(invalidptn, code === OPENBRACKET ? '' : '-');
      } // reset, used to assert if a plugin is moneky-patching the return value


      code = 1; // cascade/isolate

      if (cascade === 1) {
        nscope = ns;
      } else {
        nscopealt = ns;
      }

      var selectors = [nscope];
      var result; // execute plugins, pre-process context

      if (plugged > 0) {
        result = proxy(PREPS, input, selectors, selectors, line, column, 0, 0, 0, 0);

        if (result !== void 0 && typeof result === 'string') {
          input = result;
        }
      } // build


      var output = compile(array, selectors, input, 0, 0); // execute plugins, post-process context

      if (plugged > 0) {
        result = proxy(POSTS, output, selectors, selectors, line, column, output.length, 0, 0, 0); // bypass minification

        if (result !== void 0 && typeof (output = result) !== 'string') {
          code = 0;
        }
      } // reset


      key = '';
      nscope = '';
      nscopealt = '';
      pattern = 0;
      line = 1;
      column = 1;
      return compress * code === 0 ? output : minify(output);
    }

    stylis['use'] = use;
    stylis['set'] = set;

    if (options !== void 0) {
      set(options);
    }

    return stylis;
  });
}); // modified from: https://github.com/threepointone/glam/blob/master/src/hash.js

/* eslint-disable no-plusplus,no-bitwise,no-plusplus,no-param-reassign */

var UInt32 = function UInt32(str, pos) {
  return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8) + (str.charCodeAt(pos++) << 16) + (str.charCodeAt(pos) << 24);
};

var UInt16 = function UInt16(str, pos) {
  return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8);
};

var Umul32 = function Umul32(n, m) {
  n |= 0;
  m |= 0;
  var nlo = n & 0xffff;
  var nhi = n >>> 16;
  return nlo * m + ((nhi * m & 0xffff) << 16) | 0;
};

var murmur2 = function murmur2(str, seed) {
  var m = 0x5bd1e995;
  var r = 24;
  var h = seed ^ str.length;
  var length = str.length;
  var currentIndex = 0;

  while (length >= 4) {
    var k = UInt32(str, currentIndex);
    k = Umul32(k, m);
    k ^= k >>> r;
    k = Umul32(k, m);
    h = Umul32(h, m);
    h ^= k;
    currentIndex += 4;
    length -= 4;
  } // eslint-disable-next-line default-case


  switch (length) {
    case 3:
      h ^= UInt16(str, currentIndex);
      h ^= str.charCodeAt(currentIndex + 2) << 16;
      h = Umul32(h, m);
      break;

    case 2:
      h ^= UInt16(str, currentIndex);
      h = Umul32(h, m);
      break;

    case 1:
      h ^= str.charCodeAt(currentIndex);
      h = Umul32(h, m);
      break;
  }

  h ^= h >>> 13;
  h = Umul32(h, m);
  h ^= h >>> 15;
  return h >>> 0;
};

var hash = function (str) {
  return murmur2(str, str.length).toString(36);
};

var parseStyle = stylis; // immutably concat strings and values together

var concat = function concat(strings, values) {
  return strings.map(function (s, i) {
    return "".concat(s).concat(values[i] || '');
  }).join('');
};

var adoptSheets = function adoptSheets(el) {
  for (var _len = arguments.length, sheets = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sheets[_key - 1] = arguments[_key];
  }

  return [el.shadowRoot, el.getRootNode()].filter(function (r) {
    return !!r;
  }).forEach(function (root) {
    // eslint-disable-next-line no-param-reassign
    root.adoptedStyleSheets = _toConsumableArray(new Set([].concat(_toConsumableArray(root.adoptedStyleSheets), sheets)));
  });
};

var factory = function factory() {
  var namespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'css';
  var style = {};

  var uniqueName = function uniqueName(rule) {
    if (rule in style) return style[rule];
    var uuid = "".concat(namespace, "-").concat(hash(rule));
    style[rule] = uuid;
    return uuid;
  }; // create and inject the css style sheet


  var sheet = new CSSStyleSheet();
  adoptSheets(document, sheet); // parse template string into class name(s)

  var css = function css(strings) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return uniqueName(concat(strings, values));
  }; // inject rules into a style tag, and into the DOM
  // TODO: find a better way


  var inject = function inject() {
    for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      classes[_key3] = arguments[_key3];
    }

    return Object.entries(style).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          uuid = _ref2[1];

      return classes.some(function (c) {
        return uuid === c;
      });
    }).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          uuid = _ref4[1];

      return _toConsumableArray(sheet.rules).every(function (r) {
        return !r.cssText.includes(".".concat(uuid));
      });
    }).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          rawRule = _ref6[0],
          uuid = _ref6[1]; // parse rule with stylis and inject at the begin of the sheet


      sheet.insertRule("@media {".concat(parseStyle(".".concat(uuid), rawRule), "}"));
    });
  };

  var injectAll = function injectAll() {
    return inject.apply(void 0, _toConsumableArray(Object.keys(style)));
  }; // stringify styles object


  var string = function string() {
    return Object.keys(style).map(function (rule) {
      return ".css-".concat(uniqueName(rule), "{ ").concat(rule, " }");
    }).join(' ');
  };

  return {
    css: css,
    inject: inject,
    injectAll: injectAll,
    sheet: sheet,
    string: string
  };
};

var _factory = factory(),
    css = _factory.css,
    inject = _factory.inject,
    sheet = _factory.sheet;

var providerSymbol = Symbol('provider');

var providerOf = function providerOf(identifier, context) {
  if (!context || context === window) {
    return undefined;
  }

  if (context[providerSymbol] === identifier) {
    return context;
  }

  if (context instanceof ShadowRoot) {
    return providerOf(identifier, context.host);
  }

  return providerOf(identifier, context.parentElement || context.parentNode);
};

var _valueOf = function valueOf(identifier, context) {
  var theNearestProvider = providerOf(identifier, context);
  return theNearestProvider && theNearestProvider.value;
};

var themeSymbol = Symbol('masquerade-theme');

var themeOf = function themeOf(context) {
  return _valueOf(themeSymbol, context);
};

var callOrValue = function callOrValue() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (fnOrValue) {
    return typeof fnOrValue === 'function' ? fnOrValue.apply(void 0, args) : fnOrValue;
  };
};

var observedAttributeSymbol = Symbol('observed-attributes');

function StyledElement(BaseElement, styler) {
  return (
    /*#__PURE__*/
    function (_BaseElement) {
      _inherits(Element, _BaseElement);

      _createClass(Element, [{
        key: "theme",
        get: function get() {
          return themeOf(this);
        }
      }]);

      function Element() {
        var _this;

        _classCallCheck(this, Element);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Element).call(this));

        _this.disposer = function () {
          return null;
        };

        _this.updateStyle = _this.updateStyle.bind(_assertThisInitialized(_this));
        return _this;
      }

      _createClass(Element, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          if (_get(_getPrototypeOf(Element.prototype), "connectedCallback", this)) {
            _get(_getPrototypeOf(Element.prototype), "connectedCallback", this).call(this);
          }

          adoptSheets(this, sheet);
          var themeProvider = providerOf(themeSymbol, this);

          if (themeProvider) {
            themeProvider.addEventListener('provider-value-change', this.updateStyle);
          }

          this.updateStyle();
        }
      }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(name, oldValue, newValue) {
          if (_get(_getPrototypeOf(Element.prototype), "attributeChangedCallback", this)) {
            _get(_getPrototypeOf(Element.prototype), "attributeChangedCallback", this).call(this, name, oldValue, newValue);
          }

          this.updateStyle();
        }
      }, {
        key: "adoptedCallback",
        value: function adoptedCallback() {
          if (_get(_getPrototypeOf(Element.prototype), "adoptedCallback", this)) {
            _get(_getPrototypeOf(Element.prototype), "adoptedCallback", this).call(this);
          }

          this.updateStyle();
        }
      }, {
        key: "disconnectCallback",
        value: function disconnectCallback() {
          var themeProvider = providerOf(themeSymbol, this);

          if (themeProvider) {
            themeProvider.removeEventListener('provider-value-change', this.updateStyle);
          }
        }
      }, {
        key: "updateStyle",
        value: function updateStyle() {
          var _this2 = this;

          var className = styler(this);
          var classes = className.split(' ');

          if (classes.some(function (c) {
            return !_this2.classList.contains(c);
          })) {
            var _this$classList;

            this.disposeLastStyle();
            inject.apply(void 0, _toConsumableArray(classes));

            (_this$classList = this.classList).add.apply(_this$classList, _toConsumableArray(classes));

            this.disposer = function () {
              var _this2$classList;

              return (_this2$classList = _this2.classList).remove.apply(_this2$classList, _toConsumableArray(classes));
            };
          }
        }
      }, {
        key: "disposeLastStyle",
        value: function disposeLastStyle() {
          if (this.disposer) {
            this.disposer();
          }
        }
      }], [{
        key: "observeAttributes",
        value: function observeAttributes(attributes) {
          Element[observedAttributeSymbol] = attributes;
          return Element;
        }
      }, {
        key: "observedAttributes",
        get: function get() {
          return [].concat(_toConsumableArray(Element[observedAttributeSymbol] || []), _toConsumableArray(_get(_getPrototypeOf(Element), "observedAttributes", this) || []));
        }
      }]);

      return Element;
    }(BaseElement)
  );
}

var styled = function styled(BaseElement) {
  return function (strings) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return StyledElement(BaseElement, function (el) {
      return css.apply(void 0, [strings].concat(_toConsumableArray(values.map(callOrValue(el)))));
    });
  };
};

styled.css = function (strings) {
  for (var _len3 = arguments.length, values = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    values[_key3 - 1] = arguments[_key3];
  }

  return concat(strings, values.map(callOrValue()));
};

styled.shadow = function (strings) {
  for (var _len4 = arguments.length, values = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    values[_key4 - 1] = arguments[_key4];
  }

  return ":global(:host(&)) { ".concat(styled.css(strings, values), " }");
}; // extending native classes is needed for babel correct transpile or don't work with js5


styled.a = styled(
/*#__PURE__*/
function (_HTMLLinkElement) {
  _inherits(_class, _HTMLLinkElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
  }

  return _class;
}(_wrapNativeSuper(HTMLLinkElement)));
styled.button = styled(
/*#__PURE__*/
function (_HTMLButtonElement) {
  _inherits(_class2, _HTMLButtonElement);

  function _class2() {
    _classCallCheck(this, _class2);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class2).apply(this, arguments));
  }

  return _class2;
}(_wrapNativeSuper(HTMLButtonElement)));
styled.div = styled(
/*#__PURE__*/
function (_HTMLDivElement) {
  _inherits(_class3, _HTMLDivElement);

  function _class3() {
    _classCallCheck(this, _class3);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class3).apply(this, arguments));
  }

  return _class3;
}(_wrapNativeSuper(HTMLDivElement)));
styled.input = styled(
/*#__PURE__*/
function (_HTMLInputElement) {
  _inherits(_class4, _HTMLInputElement);

  function _class4() {
    _classCallCheck(this, _class4);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class4).apply(this, arguments));
  }

  return _class4;
}(_wrapNativeSuper(HTMLInputElement)));
styled.p = styled(
/*#__PURE__*/
function (_HTMLParagraphElement) {
  _inherits(_class5, _HTMLParagraphElement);

  function _class5() {
    _classCallCheck(this, _class5);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class5).apply(this, arguments));
  }

  return _class5;
}(_wrapNativeSuper(HTMLParagraphElement)));
styled.span = styled(
/*#__PURE__*/
function (_HTMLSpanElement) {
  _inherits(_class6, _HTMLSpanElement);

  function _class6() {
    _classCallCheck(this, _class6);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class6).apply(this, arguments));
  }

  return _class6;
}(_wrapNativeSuper(HTMLSpanElement)));

const parseParams = uri => [...uri.matchAll(/[?&]((?<name>[^=&]*)=(?<value>[^&]*))/ig)].map(res => res.groups);

const parseUrlEncoded = string => [...string.matchAll(/[&]?((?<name>[^=&]*)=(?<value>[^&]*))/ig)].map(res => res.groups);

const parseUri = uri => ({
  type: 'uri',
  raw: uri,
  params: parseParams(uri),
  url: uri.match(/^(?<url>[^?]*)/).groups.url
});

const parseRequest = request => {
  const {
    method,
    uri,
    version = '1.1'
  } = request.match(/^(?<method>[^ ]*) *(?<uri>[^ ]*) *HTTP\/(?<version>.*)/).groups;
  return {
    method,
    version,
    uri: parseUri(uri),
    type: 'request'
  };
};

const parseHeaders = headers => headers.split('\n').map(header => ({ ...header.match(/^(?<name>[^:]*):(?<value>.*)$/).groups,
  type: 'header'
}));

const parseBody = (body, headers) => {
  const {
    value: contentType = 'application/x-www-form-urlencoded'
  } = headers.find(header => header.name.toLowerCase().trim() === 'content-type') || {};

  switch (contentType.trim().toLowerCase()) {
    case 'application/json':
      return {
        contentType,
        type: 'body',
        value: JSON.parse(body),
        text: body
      };

    case 'application/x-www-form-urlencoded':
    default:
      return {
        type: 'body',
        contentType,
        value: parseUrlEncoded(body),
        text: body
      };
  }
};

const purify = string => string.trimStart('\n').trimEnd('\n');

const parse = http => {
  var _bodyLines$join;

  const [requestLine, ...others] = purify(http).split('\n');
  const [headersLines, ...bodyLines] = others.join('\n').split('\n\n');
  const request = parseRequest(requestLine);
  const headers = parseHeaders(headersLines);
  const body = (_bodyLines$join = bodyLines.join('\n'), parseBody(_bodyLines$join, headers));
  return { ...request,
    headers,
    body
  };
};

var codemirrorCss = ".CodeMirror{font-family:monospace;height:300px;color:#000;direction:ltr}.CodeMirror-lines{padding:4px 0}.CodeMirror pre.CodeMirror-line,.CodeMirror pre.CodeMirror-line-like{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #ddd;background-color:#f7f7f7;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-fat-cursor-mark{background-color:rgba(20,255,20,.5)}.cm-animate-fat-cursor,.cm-fat-cursor-mark{-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite}.cm-animate-fat-cursor{width:auto;border:0;background-color:#7e7}@-moz-keyframes blink{50%{background-color:transparent}}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:0;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-type,.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:#a50}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0b0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#a22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#e8f2ff}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:none;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:none!important;border:none!important}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-gutter-wrapper ::selection{background-color:transparent}.CodeMirror-gutter-wrapper ::-moz-selection{background-color:transparent}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre.CodeMirror-line,.CodeMirror pre.CodeMirror-line-like{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:transparent;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:inherit;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:contextual;font-variant-ligatures:contextual}.CodeMirror-wrap pre.CodeMirror-line,.CodeMirror-wrap pre.CodeMirror-line-like{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;padding:.1px}.CodeMirror-rtl pre{direction:rtl}.CodeMirror-code{outline:none}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background-color:#ffa;background-color:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:\"\"}span.CodeMirror-selectedtext{background:none}";

var themeCss = ".cm-s-material-palenight.CodeMirror{background-color:#292d3e;color:#a6accd}.cm-s-material-palenight .CodeMirror-gutters{background:#292d3e;color:#676e95;border:none}.cm-s-material-palenight .CodeMirror-guttermarker,.cm-s-material-palenight .CodeMirror-guttermarker-subtle,.cm-s-material-palenight .CodeMirror-linenumber{color:#676e95}.cm-s-material-palenight .CodeMirror-cursor{border-left:1px solid #fc0}.cm-s-material-palenight.CodeMirror-focused div.CodeMirror-selected,.cm-s-material-palenight div.CodeMirror-selected{background:rgba(113,124,180,.2)}.cm-s-material-palenight .CodeMirror-line::selection,.cm-s-material-palenight .CodeMirror-line>span::selection,.cm-s-material-palenight .CodeMirror-line>span>span::selection{background:rgba(128,203,196,.2)}.cm-s-material-palenight .CodeMirror-line::-moz-selection,.cm-s-material-palenight .CodeMirror-line>span::-moz-selection,.cm-s-material-palenight .CodeMirror-line>span>span::-moz-selection{background:rgba(128,203,196,.2)}.cm-s-material-palenight .CodeMirror-activeline-background{background:rgba(0,0,0,.5)}.cm-s-material-palenight .cm-keyword{color:#c792ea}.cm-s-material-palenight .cm-operator{color:#89ddff}.cm-s-material-palenight .cm-variable-2{color:#eff}.cm-s-material-palenight .cm-type,.cm-s-material-palenight .cm-variable-3{color:#f07178}.cm-s-material-palenight .cm-builtin{color:#ffcb6b}.cm-s-material-palenight .cm-atom{color:#f78c6c}.cm-s-material-palenight .cm-number{color:#ff5370}.cm-s-material-palenight .cm-def{color:#82aaff}.cm-s-material-palenight .cm-string{color:#c3e88d}.cm-s-material-palenight .cm-string-2{color:#f07178}.cm-s-material-palenight .cm-comment{color:#676e95}.cm-s-material-palenight .cm-variable{color:#f07178}.cm-s-material-palenight .cm-tag{color:#ff5370}.cm-s-material-palenight .cm-meta{color:#ffcb6b}.cm-s-material-palenight .cm-attribute,.cm-s-material-palenight .cm-property{color:#c792ea}.cm-s-material-palenight .cm-qualifier,.cm-s-material-palenight .cm-type,.cm-s-material-palenight .cm-variable-3{color:#decb6b}.cm-s-material-palenight .cm-error{color:#fff;background-color:#ff5370}.cm-s-material-palenight .CodeMirror-matchingbracket{text-decoration:underline;color:#fff!important}";

var simplescrollbars = createCommonjsModule$1(function (module, exports) {
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
(function (mod) {
  mod(CodeMirror);
})(function (CodeMirror) {

  function Bar(cls, orientation, scroll) {
    this.orientation = orientation;
    this.scroll = scroll;
    this.screen = this.total = this.size = 1;
    this.pos = 0;
    this.node = document.createElement("div");
    this.node.className = cls + "-" + orientation;
    this.inner = this.node.appendChild(document.createElement("div"));
    var self = this;
    CodeMirror.on(this.inner, "mousedown", function (e) {
      if (e.which != 1) return;
      CodeMirror.e_preventDefault(e);
      var axis = self.orientation == "horizontal" ? "pageX" : "pageY";
      var start = e[axis],
          startpos = self.pos;

      function done() {
        CodeMirror.off(document, "mousemove", move);
        CodeMirror.off(document, "mouseup", done);
      }

      function move(e) {
        if (e.which != 1) return done();
        self.moveTo(startpos + (e[axis] - start) * (self.total / self.size));
      }

      CodeMirror.on(document, "mousemove", move);
      CodeMirror.on(document, "mouseup", done);
    });
    CodeMirror.on(this.node, "click", function (e) {
      CodeMirror.e_preventDefault(e);
      var innerBox = self.inner.getBoundingClientRect(),
          where;
      if (self.orientation == "horizontal") where = e.clientX < innerBox.left ? -1 : e.clientX > innerBox.right ? 1 : 0;else where = e.clientY < innerBox.top ? -1 : e.clientY > innerBox.bottom ? 1 : 0;
      self.moveTo(self.pos + where * self.screen);
    });

    function onWheel(e) {
      var moved = CodeMirror.wheelEventPixels(e)[self.orientation == "horizontal" ? "x" : "y"];
      var oldPos = self.pos;
      self.moveTo(self.pos + moved);
      if (self.pos != oldPos) CodeMirror.e_preventDefault(e);
    }

    CodeMirror.on(this.node, "mousewheel", onWheel);
    CodeMirror.on(this.node, "DOMMouseScroll", onWheel);
  }

  Bar.prototype.setPos = function (pos, force) {
    if (pos < 0) pos = 0;
    if (pos > this.total - this.screen) pos = this.total - this.screen;
    if (!force && pos == this.pos) return false;
    this.pos = pos;
    this.inner.style[this.orientation == "horizontal" ? "left" : "top"] = pos * (this.size / this.total) + "px";
    return true;
  };

  Bar.prototype.moveTo = function (pos) {
    if (this.setPos(pos)) this.scroll(pos, this.orientation);
  };

  var minButtonSize = 10;

  Bar.prototype.update = function (scrollSize, clientSize, barSize) {
    var sizeChanged = this.screen != clientSize || this.total != scrollSize || this.size != barSize;

    if (sizeChanged) {
      this.screen = clientSize;
      this.total = scrollSize;
      this.size = barSize;
    }

    var buttonSize = this.screen * (this.size / this.total);

    if (buttonSize < minButtonSize) {
      this.size -= minButtonSize - buttonSize;
      buttonSize = minButtonSize;
    }

    this.inner.style[this.orientation == "horizontal" ? "width" : "height"] = buttonSize + "px";
    this.setPos(this.pos, sizeChanged);
  };

  function SimpleScrollbars(cls, place, scroll) {
    this.addClass = cls;
    this.horiz = new Bar(cls, "horizontal", scroll);
    place(this.horiz.node);
    this.vert = new Bar(cls, "vertical", scroll);
    place(this.vert.node);
    this.width = null;
  }

  SimpleScrollbars.prototype.update = function (measure) {
    if (this.width == null) {
      var style = window.getComputedStyle ? window.getComputedStyle(this.horiz.node) : this.horiz.node.currentStyle;
      if (style) this.width = parseInt(style.height);
    }

    var width = this.width || 0;
    var needsH = measure.scrollWidth > measure.clientWidth + 1;
    var needsV = measure.scrollHeight > measure.clientHeight + 1;
    this.vert.node.style.display = needsV ? "block" : "none";
    this.horiz.node.style.display = needsH ? "block" : "none";

    if (needsV) {
      this.vert.update(measure.scrollHeight, measure.clientHeight, measure.viewHeight - (needsH ? width : 0));
      this.vert.node.style.bottom = needsH ? width + "px" : "0";
    }

    if (needsH) {
      this.horiz.update(measure.scrollWidth, measure.clientWidth, measure.viewWidth - (needsV ? width : 0) - measure.barLeft);
      this.horiz.node.style.right = needsV ? width + "px" : "0";
      this.horiz.node.style.left = measure.barLeft + "px";
    }

    return {
      right: needsV ? width : 0,
      bottom: needsH ? width : 0
    };
  };

  SimpleScrollbars.prototype.setScrollTop = function (pos) {
    this.vert.setPos(pos);
  };

  SimpleScrollbars.prototype.setScrollLeft = function (pos) {
    this.horiz.setPos(pos);
  };

  SimpleScrollbars.prototype.clear = function () {
    var parent = this.horiz.node.parentNode;
    parent.removeChild(this.horiz.node);
    parent.removeChild(this.vert.node);
  };

  CodeMirror.scrollbarModel.simple = function (place, scroll) {
    return new SimpleScrollbars("CodeMirror-simplescroll", place, scroll);
  };

  CodeMirror.scrollbarModel.overlay = function (place, scroll) {
    return new SimpleScrollbars("CodeMirror-overlayscroll", place, scroll);
  };
});
});

var scrollCss = ".CodeMirror-simplescroll-horizontal div,.CodeMirror-simplescroll-vertical div{position:absolute;background:#ccc;-moz-box-sizing:border-box;box-sizing:border-box;border:1px solid #bbb;border-radius:2px}.CodeMirror-simplescroll-horizontal,.CodeMirror-simplescroll-vertical{position:absolute;z-index:6;background:#eee}.CodeMirror-simplescroll-horizontal{bottom:0;left:0;height:8px}.CodeMirror-simplescroll-horizontal div{bottom:0;height:100%}.CodeMirror-simplescroll-vertical{right:0;top:0;width:8px}.CodeMirror-simplescroll-vertical div{right:0;width:100%}.CodeMirror-overlayscroll .CodeMirror-gutter-filler,.CodeMirror-overlayscroll .CodeMirror-scrollbar-filler{display:none}.CodeMirror-overlayscroll-horizontal div,.CodeMirror-overlayscroll-vertical div{position:absolute;background:#bcd;border-radius:3px}.CodeMirror-overlayscroll-horizontal,.CodeMirror-overlayscroll-vertical{position:absolute;z-index:6}.CodeMirror-overlayscroll-horizontal{bottom:0;left:0;height:6px}.CodeMirror-overlayscroll-horizontal div{bottom:0;height:100%}.CodeMirror-overlayscroll-vertical{right:0;top:0;width:6px}.CodeMirror-overlayscroll-vertical div{right:0;width:100%}";

var style = ".root{position:relative}.root .action-container{position:absolute;top:.25rem;right:.3rem;opacity:0;transition:opacity .3s}.root:hover .action-container{opacity:1;z-index:100}.root .action-container .action{font-family:Hack,monospace!important;float:right;background:#282a36;padding:.5rem 1rem;font-size:14px;line-height:133%;border:none;color:#fff;text-transform:uppercase;cursor:pointer;border-radius:3px;transition:all .5s ease-in-out}.root .action-container .action[disabled]{color:#c3e88d}.root .CodeMirror{padding:.5rem;border-radius:.2rem}";

/**
 * @return HTMLElement
 * */

var useHost = hook(class UseHost extends Hook {
  update() {
    return this.state.host;
  }

});

/**
* @param css {String}
* */

var useCss = (css => {
  const {
    shadowRoot: root
  } = useHost();
  useEffect(() => {
    const cssStyleSheet = new CSSStyleSheet();
    cssStyleSheet.insertRule(`@media { ${css} }`); // eslint-disable-next-line no-param-reassign

    root.adoptedStyleSheets = root.adoptedStyleSheets.concat(cssStyleSheet);
  }, []);
});

const importLanguage = language => {
  switch (language) {
    case 'http':
      return import('./http-57e6a621.js');

    case 'javascript':
      return import('./javascript-f97dda94.js');

    case 'dart':
      return import('./dart-8612f164.js');

    default:
      throw new Error(`language ${language} not supported`);
  }
};
/**
 * @param host {HTMLElement}
 * @return CodeMirror.Editor
 * */


const useCodemirror = host => useMemo(() => CodeMirror(host, {
  theme: 'material-palenight',
  smartIndent: true,
  lineWiseCopyCut: true,
  lineWrapping: true,
  scrollbarStyle: 'overlay'
}), []);

const CodeBlock = ({
  code = '',
  language = 'javascript',
  readonly = false,
  onLoad = () => null,
  onChange = () => null
}) => {
  useCss(style);
  useCss(codemirrorCss);
  useCss(themeCss);
  useCss(scrollCss);
  const host = useMemo(() => document.createElement('div'), []);
  const codemirror = useCodemirror(host);
  useEffect(() => {
    codemirror.on('change', onChange);
  }, [onChange]);
  useEffect(() => {
    codemirror.setValue(code);
    onLoad();
  }, [code]);
  useEffect(async () => {
    await importLanguage(language);
    codemirror.setOption('mode', language);
  }, [language]);
  useEffect(() => {
    codemirror.setOption('readOnly', readonly);
  }, [readonly]);
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => navigator.clipboard.writeText(code).then(() => setCopied(true)).then(() => setTimeout(() => setCopied(false), 1500)), [code]);
  return html`
    <div class="root">
        <div class="action-container">
            <button 
                class="action" 
                @click=${onCopy}
                ?disabled=${copied}
            >${copied ? 'Copied' : 'Copy'}</button>
        </div>
        ${host}
    </div>
  `;
};

CodeBlock.observedAttributes = ['code', 'language', 'readonly', 'onLoad', 'onChange'];
var CodeBlock$1 = component(CodeBlock, {
  useShadowDOM: true
});

const stringify = thigh => JSON.stringify(thigh, null, 4).replace(/}$/, '  }');

const writeBody = ({
  contentType,
  value,
  text
}) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: JSON.stringify(${stringify(value)})`;

    default:
      return `body: \`${text}\``;
  }
};

const writeHeaders = headers => {
  var _ref, _headers$map;

  return _ref = (_headers$map = headers.map(({
    name,
    value
  }) => [name, value.trimStart()]), Object.fromEntries(_headers$map)), stringify(_ref);
};

var toJavascriptFetch = (({
  method,
  uri,
  headers,
  body
}) => `
fetch('${uri.raw}', {
  method: '${method}',
  headers: ${writeHeaders(headers)},
  ${body.text && `${writeBody(body)},`}
})
`.replace(/^\n*/, '').replace(/\n*$/, ''));

const writeBody$1 = ({
  contentType,
  value,
  text
}) => {
  switch (contentType.trim().toLocaleLowerCase()) {
    case 'application/json':
      return `body: json.encode(${stringify(value)})`;

    default:
      return `body: '${text}'`;
  }
};

const writeHeader = headers => {
  var _ref, _headers$map;

  return _ref = (_headers$map = headers.map(({
    name,
    value
  }) => [name, value.trimStart()]), Object.fromEntries(_headers$map)), stringify(_ref);
};

var toDartHttp = (({
  method,
  uri,
  headers,
  body
}) => `
import 'dart:convert';
import 'package:http/http.dart' as http;

http.${method.toLowerCase()}('${uri.raw}',
  headers: ${writeHeader(headers)}${body.text && ','}
  ${body.text && `${writeBody$1(body)}`}
);
`.replace(/^\n*/, '').replace(/\n*$/, ''));

var useSavedState = ((key, defaultValue) => {
  const {
    [key]: savedValue
  } = localStorage;
  const [value, setValue] = useState(savedValue || defaultValue);
  const setValueAndSave = useCallback(newValue => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  }, [key, setValue]);
  return [value, setValueAndSave];
});

const languagesMapping = {
  javascript: toJavascriptFetch,
  dart: toDartHttp
};

const convertTo = (language, code) => {
  var _parseHttp;

  return _parseHttp = parse(code), languagesMapping[language](_parseHttp);
};

define(CodeBlock$1, {
  name: 'code-block'
});
define(styled.div`
    :global(body) {
      background-color: #646464;
      width: 100vw;
      height: 100vh;
      margin: 0;
    }

    display: block;
    max-width: 800px;
    margin: auto;
    padding: 1rem;
    
    .toolbar,
    .footer {
      font-family: Hack, monospace !important;
      color: white;
      display: block;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
      margin: auto auto;
    }

    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;

      & a {
        text-decoration: none;
        color: #caddf5;
      }
    }

    h1, .subtitle {
      color: white;
      font-family: Hack, monospace !important;
      text-align: center;
      width: 100%;
    }

    .subtitle {
      padding: 20px;
      font-weight: bold;
    }

    select {
      background: #282a36;
      padding: 0.5rem 1rem;
      font-size: 14px;
      line-height: 133%;
      font-family: Hack, monospace !important;
      border: none;
      color: white;
      text-transform: lowercase;
      appearance: none;
      border-radius: 3px;
    }

    button {
      float: right;
    }
  
    .code-container {
      display: block;
      padding-top: 2px;
      padding-left: 47px;
      padding-right: 47px;
    }
`, {
  name: 'app-div',
  extends: 'div'
});
define(styled.button`
    background: #282a36;
    padding: 0.5rem 1rem;
    font-size: 14px;
    line-height: 133%;
    font-family: Hack, monospace !important;
    border: none;
    color: white;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    border-radius: 3px;

    &:disabled {
      border-radius: 3px;
      background-color: #505254;
    }
`, {
  name: 'fancy-button',
  extends: 'button'
});
const exampleHttp = `
POST https://jsonplaceholder.typicode.com/posts HTTP/1.1
Authorization: Bearer ${btoa(`admin:pwd-${Math.random()}-end`)}
Content-Type: application/json

{
  "id": 1,
  "title": "Lorem Ipsum",
  "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, neque et placerat elementum, nisl ipsum gravida sapien, quis auctor quam lorem sit amet dolor."
}
`.trimStart();
var App = define(component(() => {
  var _useMemo;

  const input = useRef(exampleHttp);
  const onInputChange = useCallback(e => {
    input.current = e.getValue();
  }, [input]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useSavedState('language', 'javascript');
  const [code, setCode] = (_useMemo = useMemo(() => convertTo(language, exampleHttp), []), useState(_useMemo));
  const onConvert = useCallback(() => {
    setCode(convertTo(language, input.current));
  }, [setCode, language, input]);
  useEffect(() => {
    if (code) {
      setLoading(true);
    }
  }, [code]);
  const onCodeLoadComplete = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  const onLanguageChange = useCallback(e => {
    setLanguage(e.target.value);
  }, [language, setCode, input]);
  useEffect(() => onConvert(), [language]);
  return html`
    <div is="app-div">
        <h1>HTTP-TO</h1>
        <div class="subtitle">Convert HTTP request to other languages</div>      
        <div class="code-container">
             <code-block
                language="http"
                .code=${input.current} 
                .onChange=${onInputChange}
            ></code-block>
        </div>
        <div class="toolbar">
            <select @change=${onLanguageChange}>
                ${Object.keys(languagesMapping).map(lan => html`
                        <option 
                            .value=${lan} 
                            ?selected=${lan === language}
                        >${lan}</option>
                `)}
            </select>
            <button is="fancy-button" 
                @click=${onConvert} 
                ?loading=${loading}
                ?disabled=${loading}
             >Convert</button>    
        </div>
         <div class="code-container">
            <code-block
                .code=${code} 
                .language=${language}
                readonly="true"
                .onLoad=${onCodeLoadComplete}
            ></code-block>
        </div>
        <div class="footer">
            find on <a href="https://github.com/alfredosalzillo/http-to">github</a>
        </div>
    </div>
  `;
}));

render(html$1`
  <${App}></${App}>
`, document.getElementById('root'));
