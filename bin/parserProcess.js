#! /usr/bin/env node
const parse = require("../libs/viewParser");
function main() {
  let args = process.argv.slice(2);
  parse(...args);
}
main();
