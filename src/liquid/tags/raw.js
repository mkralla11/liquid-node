/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Raw;
const Liquid = require("../../liquid");

module.exports = (Raw = class Raw extends Liquid.Block {
  parse(tokens) {
    return Promise.resolve().then(() => {
      if ((tokens.length === 0) || this.ended) { return Promise.resolve(); }

      const token = tokens.shift();
      const match = Liquid.Block.FullToken.exec(token.value);

      if ((match != null ? match[1] : undefined) === this.blockDelimiter()) { return this.endTag(); }

      this.nodelist.push(token.value);
      return this.parse(tokens);
    });
  }
});
