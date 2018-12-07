/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require("../liquid");

module.exports = (Liquid.Document = class Document extends Liquid.Block {
  // we don't need markup to open this block
  constructor(template) {
      // Hack: trick Babel/TypeScript into allowing this before super.
    super(template);
    this.template = template;
  }

  // There isn't a real delimter
  blockDelimiter() {
    return [];
  }

  // Document blocks don't need to be terminated since they are
  // not actually opened
  assertMissingDelimitation() {}
});
