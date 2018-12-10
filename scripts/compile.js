const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

function compile() {
  return new Promise(resolve => {
    rimraf(path.resolve(__dirname, "../../../dist/"), {}, () => {
      mkdirp(path.resolve(__dirname, "../../../dist/"), err => {
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
          ncp(
            path.resolve(__dirname, "../../../app/public"),
            path.resolve(__dirname, "../../../dist/app/public"),
            function(err) {
              if (err) {
                return console.error(err);
              }
            }
          );
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

          const controllers = routes.map((route, index) => {
            const importName = route.replace(".tsx", "");

            return {
              import: `var Route${index} = require("../../app/controllers/${importName}").default;`,
              moduleName: `Route${index}`
            };
          });

          const appRoutes = controllers.map(contoller => ({
            component: contoller.moduleName,
            path: `${contoller.moduleName}.path`,
            getInitialProps: `${contoller.moduleName}.getInitialProps`
          }));

          const jsCode = `
          ${controllers.map(controller => controller.import).join("")}
          var routes = ${JSON.stringify(appRoutes).replace(/\"/g, "")};
          module.exports.routes = routes;
          `;

          fs.writeFileSync(path.resolve(__dirname, "../routes.js"), jsCode);
          resolve(true);
        }
      });
    });
  });
}

module.exports = compile;
