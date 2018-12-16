import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppRoutes } from "./components/AppRoutes";
import { BrowserRouter, matchPath } from "react-router-dom";
const { routes } = require("./routes");

declare global {
  interface Window {
    __MODULE__: any;
  }
}

const matchRoute: any = routes.find(
  (route: any) =>
    !!matchPath(window.location.pathname, {
      path: route.path,
      exact: true,
      strict: false
    })
);

if (matchRoute) {
  matchRoute.importFunc().then((module: any) => {
    window.__MODULE__ = module.default;
    ReactDOM.hydrate(
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>,
      document.getElementById("root")
    );
  });
}
