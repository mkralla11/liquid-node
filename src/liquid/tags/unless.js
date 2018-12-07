/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Unless;
const Liquid = require("../../liquid");

module.exports = (Unless = class Unless extends Liquid.If {

  // Unless is a conditional just like 'if' but works on the inverse logic.
  //
  //   {% unless x < 0 %} x is greater than zero {% end %}
  //
  parse() {
    return super.parse(...arguments).then(() => {
      return this.blocks[0].negate = true;
    });
  }
});
