const compile = require("./compile");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const nodemon = require("nodemon");

function dev() {
  compile().then(() => {
    try {
      const tsc = path.resolve(__dirname, "../../typescript/bin/tsc");
      exec(
        `${tsc} --p ${path.resolve(
          __dirname,
          "../config/tsconfig.server.json"
        )}`
      ).then(() => {
        exec(
          `${tsc} -w --p ${path.resolve(
            __dirname,
            "../config/tsconfig.server.json"
          )}`
        );
        nodemon(
          path.resolve(
            __dirname,
            "../../../dist/node_modules/pux-react/server.js"
          )
        );
      });
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = dev;
