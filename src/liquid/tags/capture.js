/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Capture;
const Liquid = require("../../liquid");

// Capture stores the result of a block into a variable without rendering it inplace.
//
//   {% capture heading %}
//     Monkeys!
//   {% endcapture %}
//   ...
//   <h1>{{ heading }}</h1>
//
// Capture is useful for saving content for use later in your template, such as
// in a sidebar or footer.
//
module.exports = (Capture = (function() {
  let Syntax = undefined;
  let SyntaxHelp = undefined;
  Capture = class Capture extends Liquid.Block {
    static initClass() {
      Syntax = /(\w+)/;
      SyntaxHelp = "Syntax Error in 'capture' - Valid syntax: capture [var]";
    }

    constructor(template, tagName, markup) {
      {
        // Hack: trick Babel/TypeScript into allowing this before super.
        if (false) { super(); }
        let thisFn = (() => { return this; }).toString();
        let thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
        eval(`${thisName} = this;`);
      }
      const match = Syntax.exec(markup);

      if (match) {
        this.to = match[1];
      } else {
        throw new Liquid.SyntaxError(SyntaxHelp);
      }

      super(...arguments);
    }

    render(context) {
      return super.render(...arguments).then(chunks => {
        const output = Liquid.Helpers.toFlatString(chunks);
        context.lastScope()[this.to] = output;
        return "";
      });
    }
  };
  Capture.initClass();
  return Capture;
})());
