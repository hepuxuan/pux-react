#!/usr/bin/env node

const compile = require("./compile");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

compile().then(async () => {
  try {
    await exec(
      `tsc --p ${path.resolve(__dirname, "../config/tsconfig.server.json")}`
    );
    await exec(
      `webpack --config ${path.resolve(__dirname, "../config/webpack.js")}`
    );
  } catch (e) {
    console.log(e);
  }
});
