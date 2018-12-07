/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const reduce = (collection, reducer, value) =>
  Promise.all(collection).then(items =>
    items.reduce((promise, item, index, length) =>
      promise.then(value => reducer(value, item, index, length))
    
    , Promise.resolve(value))
  )
;


module.exports = reduce;
