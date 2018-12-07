/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require("../liquid");
const liquid = require("../index.js");

module.exports = (Liquid.Engine = class Engine {

  constructor() {
    this.tags = {};
    this.Strainer = function(context) {
      this.context = context;
    };
    this.registerFilters(Liquid.StandardFilters);
    this.fileSystem = new Liquid.BlankFileSystem;

    var isSubclassOf = function(klass, ofKlass) {
      if (typeof klass !== 'function') {
        return false;
      } else if (klass === ofKlass) {
        return true;
      } else {
        return isSubclassOf(klass.__proto__ != null && klass.__proto__.name !== 'Object' ? klass.__proto__ : undefined, ofKlass);
      }
    };

    for (let tagName of Object.keys(Liquid || {})) {
      const tag = Liquid[tagName];
      if (!isSubclassOf(tag, Liquid.Tag)) { continue; }
      const isBlockOrTagBaseClass = [Liquid.Tag,
                               Liquid.Block].indexOf(tag.constructor) >= 0;
      if (!isBlockOrTagBaseClass) { this.registerTag(tagName.toLowerCase(), tag); }
    }
  }

  registerTag(name, tag) {
    return this.tags[name] = tag;
  }

  registerFilters(...filters) {
    return filters.forEach(filter => {
      return (() => {
        const result = [];
        for (let k of Object.keys(filter || {})) {
          const v = filter[k];
          if (v instanceof Function) { result.push(this.Strainer.prototype[k] = v); } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    });
  }

  parse(source) {
    const template = new Liquid.Template;
    return template.parse(this, source);
  }

  parseAndRender(source, ...args) {
    return this.parse(source).then(template => template.render(...Array.from(args || [])));
  }

  registerFileSystem(fileSystem) {
    if (!(fileSystem instanceof Liquid.BlankFileSystem)) { throw Liquid.ArgumentError("Must be subclass of Liquid.BlankFileSystem"); }
    return this.fileSystem = fileSystem;
  }
});
