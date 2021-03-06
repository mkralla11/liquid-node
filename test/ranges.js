/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = requireLiquid();

describe("Range", function() {
  it("can be converted to array", function() {
    expect(new Liquid.Range(0, 1).toArray()).to.deep.equal([0]);
    expect(new Liquid.Range(0, 2).toArray()).to.deep.equal([0, 1]);
    return expect(new Liquid.Range(1, 2).toArray()).to.deep.equal([1]);
});

  it("has a length", function() {
    expect(new Liquid.Range(0, 1).length).to.equal(1);
    expect(new Liquid.Range(0, 2).length).to.equal(2);
    return expect(new Liquid.Range(1, 2).length).to.equal(1);
  });

  it("has a step", function() {
    expect(new Liquid.Range(0, 4, 2).toArray()).to.deep.equal([0, 2]);
    return expect(new Liquid.Range(0, 5, 2).toArray()).to.deep.equal([0, 2, 4]);
});

  it("can have a negative step", function() {
    expect(new Liquid.Range(2, 0).toArray()).to.deep.equal([2, 1]);
    return expect(new Liquid.Range(5, 0, -2).toArray()).to.deep.equal([5, 3, 1]);
});

  return describe(".some", () =>
    it("behaves as Array.some()", function() {
      expect(new Liquid.Range(0, 4).some(v => v === 2)).to.be.ok;
      expect(new Liquid.Range(4, 0).some(v => v === 2)).to.be.ok;
      expect(new Liquid.Range(0, 4).some(v => v === 10)).to.not.be.ok;
      return expect(new Liquid.Range(4, 0).some(v => v === 10)).to.not.be.ok;
    })
  );
});
