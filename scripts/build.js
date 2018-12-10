const compile = require("./compile");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

function build() {
  compile().then(async () => {
    try {
      await exec(
        `${path.resolve(
          __dirname,
          "../../typescript/bin/tsc"
        )} --p ${path.resolve(__dirname, "../config/tsconfig.server.json")}`
      );
      exec(
        `${path.resolve(
          __dirname,
          "../../webpack/bin/webpack.js"
        )} --config ${path.resolve(__dirname, "../config/webpack.js")}`
      );
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = build;
