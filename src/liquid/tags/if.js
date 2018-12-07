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
let If;
const Liquid = require("../../liquid");
const PromiseReduce = require("../../promise_reduce");

module.exports = (If = (function() {
  let SyntaxHelp = undefined;
  let Syntax = undefined;
  let ExpressionsAndOperators = undefined;
  If = class If extends Liquid.Block {
    static initClass() {
      SyntaxHelp = "Syntax Error in tag 'if' - Valid syntax: if [expression]";
  
      Syntax = new RegExp(`\
(${Liquid.QuotedFragment.source})\\s*\
([=!<>a-z_]+)?\\s*\
(${Liquid.QuotedFragment.source})?\
`);
  
      ExpressionsAndOperators = new RegExp(`\
(?:\
\\b(?:\\s?and\\s?|\\s?or\\s?)\\b\
|\
(?:\\s*\
(?!\\b(?:\\s?and\\s?|\\s?or\\s?)\\b)\
(?:${Liquid.QuotedFragment.source}|\\S+)\
\\s*)\
+)\
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
      this.pushBlock('if', markup);
      super(...arguments);
    }

    unknownTag(tag, markup) {
      if (["elsif", "else"].includes(tag)) {
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
              if (block.negate) { ok = !ok; }
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
      const block = (() => {
        if (tag === "else") {
        return new Liquid.ElseCondition();
      } else {
        let expressions = Liquid.Helpers.scan(markup, ExpressionsAndOperators);
        expressions = expressions.reverse();
        let match = Syntax.exec(expressions.shift());

        if (!match) { throw new Liquid.SyntaxError(SyntaxHelp); }

        let condition = new Liquid.Condition(...Array.from(match.slice(1, 4) || []));

        while (expressions.length > 0) {
          const operator = String(expressions.shift()).trim();

          match = Syntax.exec(expressions.shift());
          if (!match) { throw new SyntaxError(SyntaxHelp); }

          const newCondition = new Liquid.Condition(...Array.from(match.slice(1, 4) || []));
          newCondition[operator].call(newCondition, condition);
          condition = newCondition;
        }

        return condition;
      }
      })();

      this.blocks.push(block);
      return this.nodelist = block.attach([]);
    }
  };
  If.initClass();
  return If;
})());
