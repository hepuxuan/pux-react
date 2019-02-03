import express = require("express");
import * as React from "react";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter, matchPath, StaticRouterContext } from "react-router";
import serialize = require("serialize-javascript");
import { getChunkHash } from "./chunkHash";
const { routes } = require("./routes");
import { AppRoutes } from "./components/AppRoutes";
import _ = require("lodash");

const router = express.Router();

function getTemplatePart1(title: string) {
  return `<!DOCTYPE html><html><head><title>${title}</title></head><body><div id="root">`;
}

function getTemplatePart2(
  serverData: any,
  chunkHash: string,
  vendorHash: string
) {
  return `</div><script>window.__INITIAL_DATA__=${serialize(
    serverData
  )}</script><script src="/public/webpack/${chunkHash}"></script><script src="/public/webpack/${vendorHash}"></script></body></html>`;
}

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

    res.write(getTemplatePart1(component.title));

    dataPromise.then((data: any) => {
      const stream = renderToNodeStream(
        <StaticRouter
          location={req.url}
          context={{ data } as StaticRouterContext}
        >
          <AppRoutes />
        </StaticRouter>
      );

      stream.pipe(
        res,
        { end: false }
      );

      stream.on("end", () => {
        res.write(
          getTemplatePart2(data, getChunkHash("app"), getChunkHash("vendors"))
        );
        res.end();
      });
    });
  });
});

export default router;
