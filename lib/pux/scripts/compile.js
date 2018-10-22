const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;

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
    import: `var Route${index} = require("../../app/controllers/${importName}").default;`,
    moduleName: `Route${index}`
  };
});

const appRoutes = controllers.map(contoller => ({
  component: contoller.moduleName,
  path: `${contoller.moduleName}.path`,
  resolve: `${contoller.moduleName}.resolve`
}));

const jsCode = `
${controllers.map(controller => controller.import).join("")}
module.exports = ${JSON.stringify(appRoutes).replace(/\"/g, "")}
`;

fs.writeFileSync(path.resolve(__dirname, "../routes.js"), jsCode);
fs.writeFileSync(
  path.resolve(__dirname, "../../../dist/lib/pux/routes.js"),
  jsCode
);
