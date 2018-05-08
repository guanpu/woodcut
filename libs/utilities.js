const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
const fs = require("fs");

function toFileName(s) {
  let bare = s.trim();
  return bare.charAt(0).toLowerCase() + bare.slice(1);
}
/**
 * Return the HTML String
 * @param {File} path The path to the template HTML file
 * @param {String} component_type The type of the target component
 */
function loadHtmlSnippet(path, component_type) {
  let id = "base-" + component_type;
  let temp = fs.readFileSync(path,{
    encoding: "utf8",
    flag: "r"
  });
  const { document } = (new JSDOM(temp)).window;
  return document.getElementById(id).innerHTML;
}
module.exports = {
  toFileName,
  loadHtmlSnippet,
}
