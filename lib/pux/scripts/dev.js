#!/usr/bin/env node

const compile = require("./compile");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const { spawn } = require("child_process");

compile().then(() => {
  try {
    exec(
      `tsc -w --p ${path.resolve(__dirname, "../config/tsconfig.server.json")}`
    );
    const process = spawn("nodemon", [
      path.resolve(__dirname, "../../../dist/lib/pux/server.js")
    ]);
    process.stdout.on("data", function(data) {
      console.log(data.toString());
    });
    process.on("exit", function(code) {
      console.log("child process exited with code " + code.toString());
    });
  } catch (e) {
    console.log(e);
  }
});