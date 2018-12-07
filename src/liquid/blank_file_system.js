/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require("../liquid");

module.exports = (Liquid.BlankFileSystem = class BlankFileSystem {
  constructor() {}

  readTemplateFile(templatePath) {
    return Promise.reject(new Liquid.FileSystemError("This file system doesn't allow includes"));
  }
});
