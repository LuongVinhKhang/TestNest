// prettier.config.cjs
// CommonJS because many CI tools and Node scripts still expect it.
// If your repo is "type": "module", use prettier.config.js with export default instead.

module.exports = {
  printWidth: 100, // balanced for tests and readable diffs
  tabWidth: 2, // common JS/TS convention
  useTabs: false,
  semi: true, // keeps statements explicit (common in TS projects)
  singleQuote: true, // popular in TS/JS projects
  trailingComma: "all", // makes diffs cleaner and plays well with multiline objects/params
  bracketSpacing: true,
  bracketSameLine: false, // JSX / TSX: newlines for elements are clearer
  arrowParens: "avoid", // avoid parentheses where possible for terser arrow functions
  endOfLine: "lf", // consistent across platforms; adjust if your team needs CRLF
  proseWrap: "preserve", // don't force rewrap on markdown
  requirePragma: false, // format everything unless asked otherwise
  plugins: [], // keep empty unless you intentionally add plugins
};
