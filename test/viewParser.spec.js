const entity = require("./models/test.json");
const conf = require("../templates/config.json");
const assert = require("assert");
const parser = require("../libs/viewParser");
const fs = require("fs");
const path = require("path");
describe("Can Parse HTML template", function() {
  before(function() {
    let fileToBeCreated = path.resolve(__dirname, `../src/js/viewModels/${entity.name}.js`);
    if (fs.existsSync(fileToBeCreated)) {
      fs.unlinkSync(fileToBeCreated);
    }
  });
  it("Can replace entity properties", function(done) {
    let epoch = new Date();
    parser("js", entity, conf);
    setTimeout(() => {
      let stat = fs.statSync(path.resolve(__dirname, `../src/js/viewModels/${entity.name}.js`));
      assert.ok(stat.size > 0);
      assert.ok(stat.mtime > epoch);
      done();
    }, 2000);
  }).timeout(3000);
  xit("Support foreach syntax", function() {

  });
  after(function() {
    fs.unlinkSync(path.resolve(__dirname, `../src/js/viewModels/${entity.name}.js`));
  })
});
