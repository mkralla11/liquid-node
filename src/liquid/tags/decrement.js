/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Decrement;
const Liquid = require("../../liquid");

// decrement is used in a place where one needs to insert a counter
//     into a template, and needs the counter to survive across
//     multiple instantiations of the template.
//     NOTE: decrement is a pre-decrement, --i,
//           while increment is post:      i++.
//
//     (To achieve the survival, the application must keep the context)
//
//     if the variable does not exist, it is created with value 0.

//   Hello: {% decrement variable %}
//
// gives you:
//
//    Hello: -1
//    Hello: -2
//    Hello: -3
//
module.exports = (Decrement = class Decrement extends Liquid.Tag {
  constructor(template, tagName, markup) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { return this; }).toString();
      let thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
      eval(`${thisName} = this;`);
    }
    this.variable = markup.trim();
    super(...arguments);
  }

  render(context) {
    let value = context.environments[0][this.variable] || (context.environments[0][this.variable] = 0);
    value = value - 1;
    context.environments[0][this.variable] = value;
    return value.toString();
  }
});
