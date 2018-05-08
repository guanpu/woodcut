const os = require("os");
const path = require("path");
const util = require("../libs/utilities");

function blockHandler(scope){ 
  this.scope = scope;
  this._template = [];
  this._content = "";
  return this;
}
  
blockHandler.prototype.parse = function() {
  let me = this;
  if(Array.isArray(me.scope)) {    
    return me.scope.reduce((glob,item)=>{
      return glob + me._template.reduce((local, line)=>{
        return local + lineReplacer(item,line) + os.EOL;
      },"");  
    },"");
  } else {
    return me._template.reduce((str, item)=>{
      return str + lineReplacer(me.scope,item) + os.EOL;
    },"");
  }
}

function lineReplacer(ctx, line) {
  let func = /__func:form__/g;
  let isFunc = func.exec(line);
  if(isFunc) {
    return util.loadHtmlSnippet(path.resolve(__dirname,"../templates/views/form.html"),ctx.component);
  } else {
    let reg = /__([A-Za-z0-9\.\-\'\"]*)__/g;  
    return line.replace(reg, (match, p1, offset, original) => {
      let k = p1.split("\.");
      let toReturn = ctx;
      while (k.length > 0) {
        let z = k.shift();
        toReturn = toReturn[z];
      }
      return toReturn;
    });
  }
}

blockHandler.prototype.addTemplate = function(line) {
  this._template.push(line);
}
blockHandler.prototype.getTemplate = function(line) {
  return this._template;
}
module.exports = blockHandler;
