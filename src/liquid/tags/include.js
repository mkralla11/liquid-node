/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Include;
const Liquid = require("../../liquid");


module.exports = (Include = (function() {
  let Syntax = undefined;
  let SyntaxHelp = undefined;
  Include = class Include extends Liquid.Tag {
    static initClass() {
      Syntax = /([a-z0-9\/\\_-]+)/i;
      SyntaxHelp = `Syntax Error in 'include' - \
Valid syntax: include [templateName]`;
    }

    constructor(template, tagName, markup, tokens) {
      super(...arguments);
      const match = Syntax.exec(markup);
      if (!match) { throw new Liquid.SyntaxError(SyntaxHelp); }

      this.filepath = match[1];
      this.subTemplate = template.engine.fileSystem.readTemplateFile(this.filepath)
        .then(src => template.engine.parse(src));

    }

    render(context) {
      return this.subTemplate.then(i => i.render(context));
    }
  };
  Include.initClass();
  return Include;
})());
