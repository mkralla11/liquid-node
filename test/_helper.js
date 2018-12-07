/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let chai, expect, sinon;
global.requireLiquid = () => require(`../${process.env.LIQUID_NODE_COVERAGE ? "lib" : "src"}/index`);
const Liquid = requireLiquid();

global.chai = (chai = require("chai"));
chai.use(require("chai-as-promised"));

global.sinon = (sinon = require("sinon"));
chai.use(require("sinon-chai"));

global.expect = (expect = chai.expect);

// JSON.stringify fails for circular dependencies
const stringify = function(v) {
  try {
    return JSON.stringify(v, null, 2);
  } catch (e) {
    return `Couldn't stringify: ${v}`;
  }
};

global.renderTest = function(expected, templateString, assigns, rethrowErrors) {
  if (rethrowErrors == null) { rethrowErrors = true; }
  const engine = new Liquid.Engine;

  const parser = engine.parse(templateString);

  const renderer = parser.then(function(template) {
    template.rethrowErrors = rethrowErrors;
    return template.render(assigns);
  });

  const test = renderer.then(function(output) {
    expect(output).to.be.a("string");

    if (expected instanceof RegExp) {
      return expect(output).to.match(expected);
    } else {
      return expect(output).to.eq(expected);
    }
  });

  return Promise.all([
    expect(parser).to.be.fulfilled,
    expect(renderer).to.be.fulfilled,
    test
  ]);
};


