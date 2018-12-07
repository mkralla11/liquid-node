/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = requireLiquid();

describe("Engine", function() {
  beforeEach(function() {
    return this.filters = Liquid.StandardFilters;
  });

  it("should create strainers", function() {
    const engine = new Liquid.Engine;
    const strainer = new engine.Strainer();
    return expect(strainer.size).to.exist;
  });

  return it("should create separate strainers", function() {
    const engine1 = new Liquid.Engine;
    engine1.registerFilters({foo1() { return "foo1"; }});
    const strainer1 = new engine1.Strainer();
    expect(strainer1.size).to.exist;
    expect(strainer1.foo1).to.exist;

    const engine2 = new Liquid.Engine;
    engine2.registerFilters({foo2() { return "foo2"; }});
    const strainer2 = new engine2.Strainer();
    expect(strainer2.size).to.exist;
    expect(strainer2.foo2).to.exist;

    expect(strainer1.foo2).not.to.exist;
    return expect(strainer2.foo1).not.to.exist;
  });
});
