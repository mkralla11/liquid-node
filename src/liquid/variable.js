/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Variable;
const Liquid = require("../liquid");
const PromiseReduce = require("../promise_reduce");

// Holds variables. Variables are only loaded "just in time"
// and are not evaluated as part of the render stage
//
//   {{ monkey }}
//   {{ user.name }}
//
// Variables can be combined with filters:
//
//   {{ user | link }}
//
module.exports = (Variable = (function() {
  let VariableNameFragment = undefined;
  let FilterListFragment = undefined;
  let FilterArgParser = undefined;
  Variable = class Variable {
    static initClass() {
      this.FilterParser = new RegExp(`(?:${Liquid.FilterSeparator.source}|(?:\\s*(?!(?:${Liquid.FilterSeparator.source}))(?:${Liquid.QuotedFragment.source}|\\S+)\\s*)+)`);
      VariableNameFragment = new RegExp(`\\s*(${Liquid.QuotedFragment.source})(.*)`);
      FilterListFragment = new RegExp(`${Liquid.FilterSeparator.source}\\s*(.*)`);
      FilterArgParser = new RegExp(`(?:${Liquid.FilterArgumentSeparator.source}|${Liquid.ArgumentSeparator.source})\\s*(${Liquid.QuotedFragment.source})`);
    }

    constructor(markup) {
      this.markup = markup;
      this.name = null;
      this.filters = [];

      let match = VariableNameFragment.exec(this.markup);
      if (!match) { return; }

      this.name = match[1];

      match = FilterListFragment.exec(match[2]);
      if (!match) { return; }

      const filters = Liquid.Helpers.scan(match[1], Liquid.Variable.FilterParser);
      filters.forEach(filter => {
        match = /\s*(\w+)/.exec(filter);
        if (!match) { return; }
        const filterName = match[1];
        let filterArgs = Liquid.Helpers.scan(filter, FilterArgParser);
        filterArgs = Liquid.Helpers.flatten(filterArgs);
        return this.filters.push([filterName, filterArgs]);
    });
    }

    render(context) {
      let filtered;
      if (this.name == null) { return ''; }

      const reducer = (input, filter) => {
        const filterArgs = filter[1].map(a => context.get(a));

        return Promise.all([input, ...Array.from(filterArgs)]).then(results => {
          input = results.shift();
          try {
            return context.invoke(filter[0], input, ...Array.from(results));
          } catch (e) {
            if (!(e instanceof Liquid.FilterNotFound)) { throw e; }
            throw new Liquid.FilterNotFound(`Error - filter '${filter[0]}' in '${this.markup}' could not be found.`);
          }
        })
      };

      const value = Promise.resolve(context.get(this.name));
      // debugger
      switch (this.filters.length) {
        case 0:
          filtered = Promise.resolve(value);
          break;
        case 1:
          // Special case since Array#reduce doesn't call
          // reducer if element has only a single element.
          filtered = reducer(value, this.filters[0]);
          break;
        default:
          filtered = PromiseReduce(this.filters, reducer, value);
      }

      return filtered.then(function(f) {
        if (!(f instanceof Liquid.Drop)) { return f; }
        f.context = context;
        return f.toString();}).catch(e => context.handleError(e));
    }
  };
  Variable.initClass();
  return Variable;
})());
