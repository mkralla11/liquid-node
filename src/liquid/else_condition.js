let ElseCondition;
const Liquid = require("../liquid");

module.exports = (ElseCondition = class ElseCondition extends Liquid.Condition {
  evaluate() { return true; }
});
