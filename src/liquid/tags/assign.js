/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Assign;
const Liquid = require("../../liquid");

module.exports = (Assign = (function() {
  let SyntaxHelp = undefined;
  let Syntax = undefined;
  Assign = class Assign extends Liquid.Tag {
    static initClass() {
      SyntaxHelp = "Syntax Error in 'assign' - Valid syntax: assign [var] = [source]";
      Syntax = new RegExp(`\
((?:${Liquid.VariableSignature.source})+)\
\\s*=\\s*\
(.*)\\s*\
`);
    }

    constructor(template, tagName, markup) {
      let match;
      super(...arguments);

      if (match = Syntax.exec(markup)) {
        this.to = match[1];
        this.from = new Liquid.Variable(match[2]);
      } else {
        throw new Liquid.SyntaxError(SyntaxHelp);
      }

    }

    render(context) {
      context.lastScope()[this.to] = this.from.render(context);
      return super.render(context);
    }
  };
  Assign.initClass();
  return Assign;
})());
