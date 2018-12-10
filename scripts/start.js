const path = require("path");
const forever = require("forever");

function startCluster() {
  process.env.NODE_ENV = "production";
  forever.startDaemon(
    path.resolve(__dirname, "../../../dist/node_modules/pux-react/server.js")
  );
}

module.exports = startCluster;
