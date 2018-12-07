/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Condition;
const Liquid = require("../liquid");

// Container for liquid nodes which conveniently wraps decision making logic
//
// Example:
//
//   c = Condition.new('1', '==', '1')
//   c.evaluate #=> true
//
module.exports = (Condition = (function() {
  let LITERALS = undefined;
  Condition = class Condition {
    static initClass() {
      this.operators = {
        '=='(cond, left, right) {  return cond.equalVariables(left, right); },
        'is'(cond, left, right) {  return cond.equalVariables(left, right); },
        '!='(cond, left, right) { return !cond.equalVariables(left, right); },
        '<>'(cond, left, right) { return !cond.equalVariables(left, right); },
        'isnt'(cond, left, right) { return !cond.equalVariables(left, right); },
        '<'(cond, left, right) { return left < right; },
        '>'(cond, left, right) { return left > right; },
        '<='(cond, left, right) { return left <= right; },
        '>='(cond, left, right) { return left >= right; },
        'contains'(cond, left, right) { return __guardMethod__(left, 'indexOf', o => o.indexOf(right)) >= 0; }
      };
  
      LITERALS = {
        empty(v) { return !((v != null ? v.length : undefined) > 0); }, // false for non-collections
        blank(v) { return !v || (v.toString().length === 0); }
      };
    }

    constructor(left, operator, right) {
      this.left = left;
      this.operator = operator;
      this.right = right;
      this.childRelation = null;
      this.childCondition = null;
    }

    evaluate(context) {
      if (context == null) { context = new Liquid.Context(); }

      const result = this.interpretCondition(this.left, this.right, this.operator, context);

      switch (this.childRelation) {
        case "or":
          return Promise.resolve(result).then(result => {
            return result || this.childCondition.evaluate(context);
          });
        case "and":
          return Promise.resolve(result).then(result => {
            return result && this.childCondition.evaluate(context);
          });
        default:
          return result;
      }
    }

    or(childCondition) {
      this.childCondition = childCondition;
      return this.childRelation = "or";
    }

    and(childCondition) {
      this.childCondition = childCondition;
      return this.childRelation = "and";
    }

    // Returns first agument
    attach(attachment) {
      return this.attachment = attachment;
    }

    // private API

    equalVariables(left, right) {
      if (typeof left === "function") {
        return left(right);
      } else if (typeof right === "function") {
        return right(left);
      } else {
        return left === right;
      }
    }

    resolveVariable(v, context) {
      if (v in LITERALS) {
        return Promise.resolve(LITERALS[v]);
      } else {
        return context.get(v);
      }
    }

    interpretCondition(left, right, op, context) {
      // If the operator is empty this means that the decision statement is just
      // a single variable. We can just poll this variable from the context and
      // return this as the result.
      if (op == null) { return this.resolveVariable(left, context); }

      const operation = Condition.operators[op];
      if (operation == null) { throw new Error(`Unknown operator ${op}`); }

      left = this.resolveVariable(left, context);
      right = this.resolveVariable(right, context);

      return Promise.all([left, right]).then((...args) => {
        let left, right;
        [left, right] = Array.from(args[0]);
        return operation(this, left, right);
      });
    }
  };
  Condition.initClass();
  return Condition;
})());

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}