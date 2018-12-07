/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const strftime = require("strftime");
const Iterable = require("./iterable");
const { flatten } = require("./helpers");

const toNumber = input => Number(input);

const toObjectString = Object.prototype.toString;
const { hasOwnProperty } = Object.prototype;

const isString = input => toObjectString.call(input) === "[object String]";

const isArray = input => Array.isArray(input);

const isArguments = input => toObjectString(input) === "[object Arguments]";

// from jQuery
const isNumber = input => !isArray(input) && ((input - parseFloat(input)) >= 0);

var toString = function(input) {
  if (input == null) {
    return "";
  } else if (isString(input)) {
    return input;
  } else if (typeof input.toString === "function") {
    return toString(input.toString());
  } else {
    return toObjectString.call(input);
  }
};

const toIterable = input => Iterable.cast(input);

const toDate = function(input) {
  if (input == null) { return; }
  if (input instanceof Date) { return input; }
  if (input === 'now') { return new Date(); }

  if (isNumber(input)) {
    input = parseInt(input);
  } else {
    input = toString(input);
    if (input.length === 0) { return; }
    input = Date.parse(input);
  }

  if (input != null) { return new Date(input); }
};

// from underscore.js
const has = (input, key) => (input != null) && hasOwnProperty.call(input, key);

// from underscore.js
const isEmpty = function(input) {
  if (input == null) { return true; }
  if (isArray(input) || isString(input) || isArguments(input)) { return input.length === 0; }
  for (let key in input) { if (has(key, input)) { return false; } }
  return true;
};

const isBlank = input => !(isNumber(input) || (input === true)) && isEmpty(input);

const HTML_ESCAPE = function(chr) {
  switch (chr) {
    case "&": return '&amp;';
    case ">": return '&gt;';
    case "<": return '&lt;';
    case '"': return '&quot;';
    case "'": return '&#39;';
  }
};

const HTML_ESCAPE_ONCE_REGEXP = /["><']|&(?!([a-zA-Z]+|(#\d+));)/g;

const HTML_ESCAPE_REGEXP = /([&><"'])/g;


module.exports = {

  size(input) {
    return (input != null ? input.length : undefined) != null ? (input != null ? input.length : undefined) : 0;
  },

  downcase(input) {
    return toString(input).toLowerCase();
  },

  upcase(input) {
    return toString(input).toUpperCase();
  },

  append(input, suffix) {
    return toString(input) + toString(suffix);
  },

  prepend(input, prefix) {
    return toString(prefix) + toString(input);
  },

  empty(input) {
    return isEmpty(input);
  },

  capitalize(input) {
    return toString(input).replace(/^([a-z])/, (m, chr) => chr.toUpperCase());
  },

  sort(input, property) {
    if (property == null) { return toIterable(input).sort(); }

    return toIterable(input)
    .map(item =>
      Promise.resolve(item != null ? item[property] : undefined)
      .then(key => ({ key, item })))
    .then(array =>
      array.sort(function(a, b) {
        let left, left1;
        return (left = a.key > b.key) != null ? left : {1 : ((left1 = a.key === b.key) != null ? left1 : {0 : -1})};}).map(a => a.item)
    );
  },

  map(input, property) {
    if (property == null) { return input; }

    return toIterable(input)
    .map(e => e != null ? e[property] : undefined);
  },

  escape(input) {
    return toString(input).replace(HTML_ESCAPE_REGEXP, HTML_ESCAPE);
  },

  escape_once(input) {
    return toString(input).replace(HTML_ESCAPE_ONCE_REGEXP, HTML_ESCAPE);
  },

  // References:
  // - http://www.sitepoint.com/forums/showthread.php?218218-Javascript-Regex-making-Dot-match-new-lines
  strip_html(input) {
    return toString(input)
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]*?>/g, "");
  },

  strip_newlines(input) {
    return toString(input).replace(/\r?\n/g, "");
  },

  newline_to_br(input) {
    return toString(input).replace(/\n/g, "<br />\n");
  },

  // To be accurate, we might need to escape special chars in the string
  //
  // References:
  // - http://stackoverflow.com/a/1144788/179691
  replace(input, string, replacement) {
    if (replacement == null) { replacement = ""; }
    return toString(input).replace(new RegExp(string, 'g'), replacement);
  },

  replace_first(input, string, replacement) {
    if (replacement == null) { replacement = ""; }
    return toString(input).replace(string, replacement);
  },

  remove(input, string) {
    return this.replace(input, string);
  },

  remove_first(input, string) {
    return this.replace_first(input, string);
  },

  truncate(input, length, truncateString) {
    if (length == null) { length = 50; }
    if (truncateString == null) { truncateString = '...'; }
    input = toString(input);
    truncateString = toString(truncateString);

    length = toNumber(length);
    let l = length - truncateString.length;
    if (l < 0) { l = 0; }

    if (input.length > length) { return input.slice(0, l) + truncateString; } else { return input; }
  },

  truncatewords(input, words, truncateString) {
    if (words == null) { words = 15; }
    if (truncateString == null) { truncateString = '...'; }
    input = toString(input);

    const wordlist = input.split(" ");
    words = Math.max(1, toNumber(words));

    if (wordlist.length > words) {
      return wordlist.slice(0, words).join(" ") + truncateString;
    } else {
      return input;
    }
  },

  split(input, pattern) {
    input = toString(input);
    if (!input) { return; }
    return input.split(pattern);
  },

  //# TODO!!!

  flatten(input) {
    return toIterable(input).toArray().then(a => flatten(a));
  },

  join(input, glue) {
    if (glue == null) { glue = ' '; }
    return this.flatten(input).then(a => a.join(glue));
  },

  //# TODO!!!


  // Get the first element of the passed in array
  //
  // Example:
  //    {{ product.images | first | to_img }}
  //
  first(input) {
    return toIterable(input).first();
  },

  // Get the last element of the passed in array
  //
  // Example:
  //    {{ product.images | last | to_img }}
  //
  last(input) {
    return toIterable(input).last();
  },

  plus(input, operand) {
    return toNumber(input) + toNumber(operand);
  },

  minus(input, operand) {
    return toNumber(input) - toNumber(operand);
  },

  times(input, operand) {
    return toNumber(input) * toNumber(operand);
  },

  dividedBy(input, operand) {
    return toNumber(input) / toNumber(operand);
  },

  divided_by(input, operand) {
    return this.dividedBy(input, operand);
  },

  round(input, operand) {
    return toNumber(input).toFixed(operand);
  },

  modulo(input, operand) {
    return toNumber(input) % toNumber(operand);
  },

  date(input, format) {
    input = toDate(input);

    if (input == null) {
      return "";
    } else if (toString(format).length === 0) {
      return input.toUTCString();
    } else {
      return strftime(format, input);
    }
  },

  default(input, defaultValue) {
    let left;
    if (arguments.length < 2) { defaultValue = ''; }
    const blank = (left = __guardMethod__(input, 'isBlank', o => o.isBlank())) != null ? left : isBlank(input);
    if (blank) { return defaultValue; } else { return input; }
  }
};

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}