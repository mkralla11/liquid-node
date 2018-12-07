/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Case;
const Liquid = require("../../liquid");
const PromiseReduce = require("../../promise_reduce");

module.exports = (Case = (function() {
  let SyntaxHelp = undefined;
  let Syntax = undefined;
  let WhenSyntax = undefined;
  Case = class Case extends Liquid.Block {
    static initClass() {
      SyntaxHelp = "Syntax Error in tag 'case' - Valid syntax: case [expression]";
  
      Syntax     = new RegExp(`(${Liquid.QuotedFragment.source})`);
  
      WhenSyntax = new RegExp(`\
(${Liquid.QuotedFragment.source})\
(?:\
(?:\\s+or\\s+|\\s*\\,\\s*)\
(${Liquid.QuotedFragment.source})\
)?\
`);
    }

    constructor(template, tagName, markup) {
      {
        // Hack: trick Babel/TypeScript into allowing this before super.
        if (false) { super(); }
        let thisFn = (() => { return this; }).toString();
        let thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
        eval(`${thisName} = this;`);
      }
      this.blocks = [];

      const match = Syntax.exec(markup);
      if (!match) { throw new Liquid.SyntaxError(SyntaxHelp); }

      this.markup = markup;
      super(...arguments);
    }

    unknownTag(tag, markup) {
      if (["when", "else"].includes(tag)) {
        return this.pushBlock(tag, markup);
      } else {
        return super.unknownTag(...arguments);
      }
    }

    render(context) {
      return context.stack(() => {
        return PromiseReduce(this.blocks, function(chosenBlock, block) {
          if (chosenBlock != null) { return chosenBlock; } // short-circuit

          return Promise.resolve()
            .then(() => block.evaluate(context)).then(function(ok) {
              if (ok) { return block; }
          });
        }
        , null)
        .then(block => {
          if (block != null) {
            return this.renderAll(block.attachment, context);
          } else {
            return "";
          }
        });
      });
    }

    // private

    pushBlock(tag, markup) {
      let block;
      if (tag === "else") {
        block = new Liquid.ElseCondition();
        this.blocks.push(block);
        return this.nodelist = block.attach([]);
      } else {
        const expressions = Liquid.Helpers.scan(markup, WhenSyntax);

        const nodelist = [];

        return (() => {
          const result = [];
          for (let value of Array.from(expressions[0])) {
            if (value) {
              block = new Liquid.Condition(this.markup, '==', value);
              this.blocks.push(block);
              result.push(this.nodelist = block.attach(nodelist));
            } else {
              result.push(undefined);
            }
          }
          return result;
        })();
      }
    }
  };
  Case.initClass();
  return Case;
})());
