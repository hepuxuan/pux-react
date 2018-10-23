const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const mkdirp = require("mkdirp");

function compile() {
  return new Promise(resolve => {
    mkdirp(path.resolve(__dirname, "../../../dist/lib/pux/"), err => {
      if (err) console.error(err);
      else {
        ncp(
          path.resolve(__dirname, "../views"),
          path.resolve(__dirname, "../../../dist/lib/pux/views"),
          function(err) {
            if (err) {
              return console.error(err);
            }
          }
        );

        ncp(
          path.resolve(__dirname, "../config"),
          path.resolve(__dirname, "../../../dist/lib/pux/config"),
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
