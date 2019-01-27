const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function compile() {
  return new Promise(resolve => {
    rimraf(path.resolve(__dirname, "../../../dist/"), {}, () => {
      mkdirp(path.resolve(__dirname, "../../../dist/"), async err => {
        if (err) console.error(err);
        else {
          try {
            fs.mkdirSync(
              path.resolve(__dirname, "../../../dist/node_modules/")
            );
            fs.mkdirSync(
              path.resolve(__dirname, "../../../dist/node_modules/pux-react/")
            );
            fs.mkdirSync(path.resolve(__dirname, "../../../dist/app/"));
          } catch (e) {
            console.log(e);
          }
          if (fs.existsSync(path.resolve(__dirname, "../../../app/public"))) {
            ncp(
              path.resolve(__dirname, "../../../app/public"),
              path.resolve(__dirname, "../../../dist/app/public"),
              function(err) {
                if (err) {
                  return console.error(err);
                }
              }
            );
          }
          ncp(
            path.resolve(__dirname, "../views"),
            path.resolve(
              __dirname,
              "../../../dist/node_modules/pux-react/views"
            ),
            function(err) {
              if (err) {
                return console.error(err);
              }
            }
          );

          ncp(
            path.resolve(__dirname, "../config"),
            path.resolve(
              __dirname,
              "../../../dist/node_modules/pux-react/config"
            ),
            function(err) {
              if (err) {
                return console.error(err);
              }
            }
          );

          const routes = fs.readdirSync(
            path.resolve(__dirname, "../../../app/controllers")
          );

          // pre compile
          fs.writeFileSync(
            path.resolve(__dirname, "../routes.js"),
            `var routes = []; module.exports.routes = routes;`
          );

          await exec(
            `${path.resolve(
              __dirname,
              "../../typescript/bin/tsc"
            )} --p ${path.resolve(__dirname, "../config/tsconfig.server.json")}`
          );

          const jsCode = `
          var routes = [${routes
            .map(route => {
              const importName = route.replace(".tsx", "");
              const module = require(`../../../dist/app/controllers/${importName}`);
              return `{importPath: "../../app/controllers/${importName}", path: '${
                module.default.path
              }', importFunc: function() {return import("../../app/controllers/${importName}" /* webpackChunkName:"${importName}" */);}}`;
            })
            .join(",")}]
          module.exports = {routes};
          `;

          fs.writeFileSync(path.resolve(__dirname, "../routes.ts"), jsCode);
          resolve(true);
        }
      });
    });
  });
}

module.exports = compile;
