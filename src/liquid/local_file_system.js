/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require("../liquid");
const Fs = require("fs");
const Path = require("path");

const readFile = (fpath, encoding) =>
  new Promise(function(resolve, reject) {
    return Fs.readFile(fpath, encoding, function(err, content) {
      if (err) {
        return reject(err);
      } else {
        return resolve(content);
      }
    });
  })
;


module.exports = (function() {
  let PathPattern = undefined;
  const Cls = (Liquid.LocalFileSystem = class LocalFileSystem extends Liquid.BlankFileSystem {
    static initClass() {
  
      PathPattern = new RegExp(`^[^.\\/][a-zA-Z0-9-_\\/]+$`);
    }

    constructor(root, extension) {
      super(root, extension)
      if (extension == null) { extension = "html"; }
      this.root = root;
      this.fileExtension = extension;
    }

    readTemplateFile(templatePath) {
      return this.fullPath(templatePath)
        .then(fullPath =>
          readFile(fullPath, 'utf8').catch(function(err) {
            throw new Liquid.FileSystemError(`Error loading template: ${err.message}`);
          })
      );
    }

    fullPath(templatePath) {
      if (PathPattern.test(templatePath)) {
        return Promise.resolve(Path.resolve(Path.join(this.root, templatePath + `.${this.fileExtension}`)));
      } else {
        return Promise.reject(new Liquid.ArgumentError(`Illegal template name '${templatePath}'`));
      }
    }
  });
  Cls.initClass();
  return Cls;
})();
