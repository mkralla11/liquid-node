/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Liquid = require("../liquid");

module.exports = (Liquid.Template = class Template {

  // creates a new <tt>Template</tt> from an array of tokens.
  // Use <tt>Template.parse</tt> instead
  constructor() {
    this.registers = {};
    this.assigns = {};
    this.instanceAssigns = {};
    this.tags = {};
    this.errors = [];
    this.rethrowErrors = true;
  }

  // Parse source code.
  // Returns self for easy chaining
  parse(engine, source) {
    this.engine = engine;
    if (source == null) { source = ""; }
    return Promise.resolve().then(() => {
      const tokens = this._tokenize(source);

      this.tags = this.engine.tags;
      this.root = new Liquid.Document(this);
      return this.root.parseWithCallbacks(tokens).then(() => this);
    });
  }

  // Render takes a hash with local variables.
  //
  // if you use the same filters over and over again consider
  // registering them globally
  // with <tt>Template.register_filter</tt>
  //
  // Following options can be passed:
  //
  //  * <tt>filters</tt> : array with local filters
  //  * <tt>registers</tt> : hash with register variables. Those can
  //    be accessed from filters and tags and might be useful to integrate
  //    liquid more with its host application
  //
  render(...args) {
    return Promise.resolve().then(() => this._render(...Array.from(args || [])));
  }

  _render(assigns, options) {
    if (this.root == null) { throw new Error("No document root. Did you parse the document yet?"); }

    const context = (() => {
      if (assigns instanceof Liquid.Context) {
      return assigns;
    } else if (assigns instanceof Object) {
      assigns = [assigns, this.assigns];
      return new Liquid.Context(this.engine, assigns, this.instanceAssigns, this.registers, this.rethrowErrors);
    } else if ((assigns == null)) {
      return new Liquid.Context(this.engine, this.assigns, this.instanceAssigns, this.registers, this.rethrowErrors);
    } else {
      throw new Error(`Expected Object or Liquid::Context as parameter, but was ${typeof assigns}.`);
    }
    })();

    if (options != null ? options.registers : undefined) {
      for (let k of Object.keys(options.registers || {})) {
        const v = options.registers[k];
        this.registers[k] = v;
      }
    }

    if (options != null ? options.filters : undefined) {
      context.registerFilters(...Array.from(options.filters || []));
    }

    const copyErrors = actualResult => {
      this.errors = context.errors;
      return actualResult;
    };

    return this.root.render(context)
    .then(chunks => Liquid.Helpers.toFlatString(chunks)).then((result)=>{
      this.errors = context.errors;
      return result;
    }
    , (error)=>{
      this.errors = context.errors;
      throw error;
    });
  }

  // Uses the <tt>Liquid::TemplateParser</tt> regexp to tokenize
  // the passed source
  _tokenize(source) {
    source = String(source);
    if (source.length === 0) { return []; }
    const tokens = source.split(Liquid.TemplateParser);

    let line = 1;
    let col = 1;

    return tokens
    .filter(token => token.length > 0).map(function(value) {
      const result = { value, col, line };

      const lastIndex = value.lastIndexOf("\n");

      if (lastIndex < 0) {
        col += value.length;
      } else {
        const linebreaks = value.split("\n").length - 1;
        line += linebreaks;
        col = value.length - lastIndex;
      }

      return result;
    });
  }
});
