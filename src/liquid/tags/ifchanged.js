/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let IfChanged;
const Liquid = require("../../liquid");

module.exports = (IfChanged = class IfChanged extends Liquid.Block {
  render(context) {
    return context.stack(() => {
      const rendered = this.renderAll(this.nodelist, context);

      return Promise.resolve(rendered).then(function(output) {
        output = Liquid.Helpers.toFlatString(output);

        if (output !== context.registers.ifchanged) {
          return context.registers.ifchanged = output;
        } else {
          return "";
        }
      });
    });
  }
});
