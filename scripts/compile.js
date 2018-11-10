const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const mkdirp = require("mkdirp");
// node_modules/pux-react/
function compile() {
  return new Promise(resolve => {
    mkdirp(path.resolve(__dirname, "../../../dist/"), err => {
      if (err) console.error(err);
      else {
        try {
          fs.mkdirSync(path.resolve(__dirname, "../../../dist/node_modules/"));
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
          path.resolve(__dirname, "../../../dist/node_modules/pux-react/views"),
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
            import: `import Route${index} from "../../app/controllers/${importName}";`,
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
        const routes = ${JSON.stringify(appRoutes).replace(/\"/g, "")};
        export default routes;
        `;

        fs.writeFileSync(path.resolve(__dirname, "../routes.ts"), jsCode);
        resolve(true);
      }
    });
  });
}

module.exports = compile;
