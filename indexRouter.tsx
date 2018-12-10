import express = require("express");
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { StaticRouter, matchPath, StaticRouterContext } from "react-router";
import serialize = require("serialize-javascript");
import { getChunkHash } from "./chunkHash";
import { routes } from "./routes";
import { AppRoutes } from "./components/AppRoutes";
import _ = require("lodash");

const router = express.Router();

routes.map(route => {
  router.get(route.path, (req, res, next) => {
    let dataPromise;
    if (_.isFunction(route.getInitialProps)) {
      dataPromise = route.getInitialProps(
        matchPath(req.url, {
          path: route.path,
          exact: true,
          strict: false
        })
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
        title: "Express",
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