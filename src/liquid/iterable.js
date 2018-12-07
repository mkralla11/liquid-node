/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Iterable;
const Range = require("./range");

const isString = input => Object.prototype.toString.call(input) === "[object String]";

module.exports = (Iterable = class Iterable {
  first() {
    return this.slice(0, 1).then(a => a[0]);
  }

  map() {
    const args = arguments;
    return this.toArray().then(a => Promise.all(a.map(...Array.from(args || []))));
  }

  sort() {
    const args = arguments;
    return this.toArray().then(a => a.sort(...Array.from(args || [])));
  }

  toArray() {
    return this.slice(0);
  }

  slice() {
    throw new Error(`${this.constructor.name}.slice() not implemented`);
  }

  last() {
    throw new Error(`${this.constructor.name}.last() not implemented`);
  }

  static cast(v) {
    if (v instanceof Iterable) {
      return v;
    } else if (v instanceof Range) {
      return new IterableForArray(v.toArray());
    } else if (Array.isArray(v) || isString(v)) {
      return new IterableForArray(v);
    } else if (v != null) {
      return new IterableForArray([v]);
    } else {
      return new IterableForArray([]);
    }
  }
});

class IterableForArray extends Iterable {
  constructor(array) {
    super(array)
    this.array = array;
  }

  slice() {
    return Promise.resolve(this.array.slice(...arguments));
  }

  last() {
    return Promise.resolve(this.array[this.array.length - 1]);
  }
}
