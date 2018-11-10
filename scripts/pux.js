#!/usr/bin/env node
const dev = require("./dev");
const args = process.argv.slice(2);
const script = args[0];

switch (script) {
  case "dev":
    dev();
}
