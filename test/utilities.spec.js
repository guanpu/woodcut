const assert = require("assert");
const util = require("../libs/utilities");
const path = require("path");
describe("Switch to proper filename", function() {
  it("First letter should be switched to lower case", function() {
    let fn = util.toFileName("ABC");
    assert.equal(fn, "aBC");
  });
  it("String should be trimed", function() {
    let fn = util.toFileName(" cBC ");
    assert.equal(fn, "cBC");
  });
});
describe("Can load HTML snippet", function(){
  it("Load input text", function(){
    let str = path.resolve(__dirname, "../templates/views/form.html");
    let res = util.loadHtmlSnippet(str,"input-text");
    assert.ok(res.includes("oj-input-text"));
  });

  it("Load input time", function(){
    let str = path.resolve(__dirname, "../templates/views/form.html");
    let res = util.loadHtmlSnippet(str,"input-time");
    assert.ok(res.includes("oj-input-time"));
  });

  it("Load input date time", function(){
    let str = path.resolve(__dirname, "../templates/views/form.html");
    let res = util.loadHtmlSnippet(str,"input-date-time");
    assert.ok(res.includes("oj-input-date-time"));
  });
});
