import express = require("express");
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter, matchPath, StaticRouterContext } from "react-router";
import serialize = require("serialize-javascript");
import { getChunkHash } from "./chunkHash";
const { routes } = require("./routes");
import { AppRoutes } from "./components/AppRoutes";
import _ = require("lodash");

const router = express.Router();

routes.map((routeDef: any) => {
  const component = require(routeDef.importPath).default;
  router.get(component.path, (req, res, next) => {
    let dataPromise;

    if (_.isFunction((component as any).getInitialProps)) {
      dataPromise = (component as any).getInitialProps(
        matchPath(req.path, {
          path: component.path,
          exact: true,
          strict: false
        }),
        req.query
      );
    } else {
      dataPromise = Promise.resolve({});
    }
    dataPromise.then((data: any) => {
      const reactBody = renderToString(
        <StaticRouter
          location={req.url}
          context={{ data } as StaticRouterContext}
        >
          <AppRoutes />
        </StaticRouter>
      );
      const sheet = new ServerStyleSheet();
      const styles = sheet.getStyleTags();

      res.render("index", {
        title: component.title,
        reactBody,
        styles,
        appHash: getChunkHash("app"),
        vendorHash: getChunkHash("vendors"),
        serverData: serialize(data)
      });
    });
  });
});

export default router;
