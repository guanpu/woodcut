#! /usr/bin/env node
const fs = require("fs");
const util = require("../libs/utilities");
const path = require("path");
const assert = require("assert");
// const viewParser = require("../libs/viewParser");
const child_process = require("child_process");
const conf = require(path.resolve(process.cwd(),"templates/config.json"));

function main() {
  let entities = [];  
  let modelFile = process.argv[2];
  if (!!modelFile && (path.extname(modelFile) === '.json' || path.extname(modelFile) === '.JSON')) {
    try {
      entities.push(require(path.resolve(__dirname, modelFile)));
      assert.ok(entity.hasOwnProperty("name"));
    } catch (error) {
      console.log(error);
      process.stdout.write(`the specified model file ${modelFile} doesn't exist: \n`);
      process.exit(1);
    }
  } else {
    let modelDir = path.resolve(process.cwd(),"models/");
    let files = fs.readdirSync(modelDir);
    for (const file of files) {
      if((path.extname(file) === '.json') || path.extname(file) === '.JSON') {
        entities.push(require(path.resolve(modelDir, file)));        
      }
    }
  }

  for(let entity of entities) {
    try {
      child_process.fork(path.resolve(__dirname,"./parserProcess"),['js', JSON.stringify(entity), JSON.stringify(conf)]);
      child_process.fork(path.resolve(__dirname,"./parserProcess"),['html', JSON.stringify(entity), JSON.stringify(conf)]);
      // viewParser('js',entity, conf);
      // viewParser('html', entity,conf);
      // generateI18nResource();
    } catch (error) {
      revert(entity.name);
      process.exit();
    }
  }

}
/**
 * The funcion to clear up failed generation.
 * @param {String} name the entity name
 */
function revert(name) {
  let view = path.resolve(process.cwd(),`src/js/views/${util.toFileName(name)}.html`);
  if (fs.existsSync(view)) {
    fs.unlinkSync(view);
  }
  let vm = path.resolve(process.cwd(),`src/js/viewModels/${util.toFileName(name)}.js`);
  if (fs.existsSync(vm)) {
    fs.unlinkSync(vm);
  }
  //TODO: think more about resources file name
  let rs = path.resolve(process.cwd(),`src/resources/${util.toFileName(name)}.local`);
  if (fs.existsSync(rs)) {
    fs.unlinkSync(rs);
  }
}

main();
