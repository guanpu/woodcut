const assert = require("assert");
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const util = require("./utilities");
const blockHandler = require("./blockHandler");
const _ = require("underscore");

//Mocking a queue, something like a AST.
let stack = [];
let lastBlocker = {};
/**
 * 1. We are chooing __ as our template wrapper 
 * as typical meaningful & expressive symbol as occupied by OJET in HTML.
 * 2. Content currently allowed to appear in a binding only consist of digits,
 * alphabetical characters(lower and upper case), hyphens, periods as well as single and double quotes.
 */
function lineHandler(me) {
  let ctx = me;
  ctx.skip = false;
  ctx.parent = null;
  let curr = new blockHandler(ctx);
  lastBlocker=curr;
  
  return function _lineHandler(line) {
    let seperator = /__(foreach|if):([^_]*)__/.exec(line);
    if (seperator != null) {
      if(seperator[1]==='foreach') {
        stack.push(curr);

        let oldctx = _.clone(ctx);
        ctx = oldctx[seperator[2]];
        ctx.parent = oldctx;

        curr = new blockHandler(ctx);
        lastBlocker =curr;
      } else if(seperator[1]==='if') {
        let func = new Function("return " + seperator[2]);
        let p = func.bind(ctx);
          stack.push(curr);

          let oldctx = _.clone(ctx);
          oldctx.skip = !p();
          ctx = oldctx;
          curr = new blockHandler(ctx);
          lastBlocker = curr;
      }
      return;
    }
    let endBlock = /__end(foreach|if)__/.exec(line);
    // TODO: add check so that not-matching __end**__ would throw error instead of fail silently.
    if (endBlock != null) {
      if(endBlock[1]==='foreach') {      
        stack.push(curr);
        ctx = ctx.parent;
        curr = new blockHandler(ctx);
        lastBlocker = curr;        
      } else if(endBlock[1]==='if') {
        stack.push(curr);
        let newctx = _.clone(ctx);
        newctx.skip = false; // __if:xxx__ can't be nested
        ctx = newctx;
        curr = new blockHandler(ctx);
        lastBlocker = curr;
      }
      return;
    }
    if(!ctx.skip) {
      curr.addTemplate(line);
    }
  }
}

function parse(type, model_s, config_s) {
  let model;
  let config;
  if(typeof model_s==='string') {
    model = JSON.parse(model_s);
  } else if(typeof model_s==='object') {
    model = model_s;
  } else {
    throw new TypeError("Invalid type of model");
  }

  if(typeof config_s==='string') {
    config = JSON.parse(config_s);
  } else if(typeof config_s==='object') {
    config = config_s;
  } else {
    throw new TypeError("Invalid type of config");
  }
  assert.ok(config.hasOwnProperty("template"));
  assert.ok(config.hasOwnProperty("options"));
  assert.ok(model.hasOwnProperty("name"));
  let tempPath;
  let targetPath;
  if(type === 'js') {
    tempPath = `templates/viewModels/${util.toFileName(config.template)}.js`;
    targetPath = `src/js/viewModels/${util.toFileName(model.name)}.js`;
  } else if(type === 'html') {
    tempPath= `templates/views/${util.toFileName(config.template)}.html`;
    targetPath = `src/js/views/${util.toFileName(model.name)}.html`;
  }
  //The template to be read from
  const fl = fs.createReadStream(path.resolve(process.cwd(),tempPath), {
    flags: "r",
    encoding: "utf8",
    autoClose: true
  });

  //The target file to be write to
  const target = fs.createWriteStream(path.resolve(process.cwd(),targetPath), {
    flag: "w"
  });

  const rl = readline.createInterface({
    input: fl
  });

  rl.on("line", lineHandler(model));
  rl.on("close", () => {
    stack.push(lastBlocker);
    while(true) {
      item = stack.shift();
      if(item && typeof item.parse==='function') {
        let s = item.parse();
        target.write(s);
      } else {
        break;
      }
    }
    process.stdout.write(`the ${type} file ${util.toFileName(model.name)}.${type} has been created. \n`);
    target.end();
  });
}

module.exports = parse;
