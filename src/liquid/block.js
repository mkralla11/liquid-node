/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Block;
const Liquid = require("../liquid");
const util = require("util");

// Iterates over promises sequentially
const Promise_each = function(promises, cb) {
  var iterator = function(index) {
    if (index >= promises.length) { return Promise.resolve(); }
    const promise = promises[index];

    return Promise.resolve(promise).then(value =>
      Promise.resolve(cb(value)).then(() => iterator(index + 1))
    );
  };

  return iterator(0);
};

module.exports = (Block = (function() {
  Block = class Block extends Liquid.Tag {
    static initClass() {
      this.IsTag             = new RegExp(`^${Liquid.TagStart.source}`);
      this.IsVariable        = new RegExp(`^${Liquid.VariableStart.source}`);
      this.FullToken         = new RegExp(`^${Liquid.TagStart.source}\\s*(\\w+)\\s*(.*)?${Liquid.TagEnd.source}$`);
      this.ContentOfVariable = new RegExp(`^${Liquid.VariableStart.source}(.*)${Liquid.VariableEnd.source}$`);
    }

    beforeParse() {
      if (this.nodelist == null) { this.nodelist = []; }
      return this.nodelist.length = 0; // clear array
    }

    afterParse() {
      // Make sure that its ok to end parsing in the current block.
      // Effectively this method will throw and exception unless the
      // current block is of type Document
      return this.assertMissingDelimitation();
    }

    parse(tokens) {
      if ((tokens.length === 0) || this.ended) { return Promise.resolve(); }
      const token = tokens.shift();

      return Promise.resolve().then(() => {
        return this.parseToken(token, tokens);
    }).catch(function(e) {
        e.message = `${e.message}\n    at ${token.value} (${token.filename}:${token.line}:${token.col})`;
        if (e.location == null) { e.location = { col: token.col, line: token.line, filename: token.filename }; }
        throw e;}).then(() => {
        return this.parse(tokens);
      });
    }

    parseToken(token, tokens) {
      if (Block.IsTag.test(token.value)) {
        const match = Block.FullToken.exec(token.value);

        if (!match) {
          throw new Liquid.SyntaxError(`Tag '${token.value}' was not properly terminated with regexp: ${Liquid.TagEnd.inspect}`);
        }

        if (this.blockDelimiter() === match[1]) { return this.endTag(); }

        const Tag = this.template.tags[match[1]];
        if (!Tag) { return this.unknownTag(match[1], match[2], tokens); }

        const tag = new Tag(this.template, match[1], match[2]);
        this.nodelist.push(tag);
        return tag.parseWithCallbacks(tokens);
      } else if (Block.IsVariable.test(token.value)) {
        return this.nodelist.push(this.createVariable(token));
      } else if (token.value.length === 0) {
        // skip empty tokens
      } else {
        return this.nodelist.push(token.value);
      }
    }

    endTag() {
      return this.ended = true;
    }

    unknownTag(tag, params, tokens) {
      if (tag === 'else') {
        throw new Liquid.SyntaxError(`${this.blockName()} tag does not expect else tag`);
      } else if (tag === 'end') {
        throw new Liquid.SyntaxError(`'end' is not a valid delimiter for ${this.blockName()} tags. use ${this.blockDelimiter()}`);
      } else {
        throw new Liquid.SyntaxError(`Unknown tag '${tag}'`);
      }
    }

    blockDelimiter() {
      return `end${this.blockName()}`;
    }

    blockName() {
      return this.tagName;
    }

    createVariable(token) {
      const match = __guard__(Liquid.Block.ContentOfVariable.exec(token.value), x => x[1]);
      if (match) { return new Liquid.Variable(match); }
      throw new Liquid.SyntaxError(`Variable '${token.value}' was not properly terminated with regexp: ${Liquid.VariableEnd.inspect}`);
    }

    render(context) {
      return this.renderAll(this.nodelist, context);
    }

    assertMissingDelimitation() {
      if (!this.ended) { throw new Liquid.SyntaxError(`${this.blockName()} tag was never closed`); }
    }

    renderAll(list, context) {
      const accumulator = [];

      return Promise_each(list, function(token) {
        if (typeof (token != null ? token.render : undefined) !== "function") {
          accumulator.push(token);
          return;
        }

        return Promise.resolve().then(() => token.render(context)).then(s => accumulator.push(s)
        , e => accumulator.push(context.handleError(e)));
    }).then(() => accumulator);
    }
  };
  Block.initClass();
  return Block;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}