/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Increment;
const Liquid = require("../../liquid");

// increment is used in a place where one needs to insert a counter
//     into a template, and needs the counter to survive across
//     multiple instantiations of the template.
//     (To achieve the survival, the application must keep the context)
//
//     if the variable does not exist, it is created with value 0.

//   Hello: {% increment variable %}
//
// gives you:
//
//    Hello: 0
//    Hello: 1
//    Hello: 2
//

module.exports = (Increment = class Increment extends Liquid.Tag {
  constructor(template, tagName, markup) {
    super(...arguments);
    this.variable = markup.trim();
  }

  render(context) {
    const value = context.environments[0][this.variable] != null ? context.environments[0][this.variable] : (context.environments[0][this.variable] = 0);
    context.environments[0][this.variable] = value + 1;
    return String(value);
  }
});
