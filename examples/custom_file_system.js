/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require('../src');

class CustomFileSystem extends Liquid.BlankFileSystem {
  readTemplateFile(path) {
    return new Promise(function(resolve, reject) {
      if (path === 'foo') {
        return resolve('FOO');
      } else if (path === 'bar') {
        return resolve('BAR');
      } else {
        return reject('not foo or bar');
      }
    });
  }
}

const engine = new Liquid.Engine;
engine.fileSystem = new CustomFileSystem;

engine.parse('{% include foo %} {% include bar %}')
.then(parsed => parsed.render()).then(result => console.log(`Rendered: ${result}`)).catch(err => console.log(`Failed: ${err}`));
