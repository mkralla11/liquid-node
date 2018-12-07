/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Tag;
module.exports = (Tag = class Tag {
  constructor(template, tagName, markup) {
    this.template = template;
    this.tagName = tagName;
    this.markup = markup;
  }

  parseWithCallbacks(...args) {
    let parse;
    if (this.afterParse) {
      parse = () => this.parse(...Array.from(args || [])).then(() => this.afterParse(...Array.from(args || [])));
    } else {
      parse = () => this.parse(...Array.from(args || []));
    }

    if (this.beforeParse) {
      return Promise.resolve(this.beforeParse(...Array.from(args || []))).then(parse);
    } else {
      return parse();
    }
  }

  parse() {}

  name() {
    return this.constructor.name.toLowerCase();
  }

  render() {
    return "";
  }
});
