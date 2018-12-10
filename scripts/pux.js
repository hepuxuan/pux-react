#!/usr/bin/env node
const dev = require("./dev");
const build = require("./build");
const start = require("./start");
const args = process.argv.slice(2);
const script = args[0];

switch (script) {
  case "dev":
    dev();
    break;
  case "build":
    build();
    break;
  case "start":
    start();
    break;
  default:
    console.error("invalid arg");
}
