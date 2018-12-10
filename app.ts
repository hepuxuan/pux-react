import cookieParser = require("cookie-parser");
import express = require("express");
import logger = require("morgan");
import path = require("path");

import indexRouter from "./indexRouter";
import apiRouter from "./apiRouter";

const app = express();

// view engine setup
app.engine("pug", require("pug").__express);
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  const webpack = require("webpack");
  const middleware = require("webpack-dev-middleware");
  const compiler = webpack(
    require("../../../node_modules/pux-react/config/webpack.dev")
  );
  app.use(
    middleware(compiler, {
      publicPath: "/public/webpack/"
    })
  );
}

app.use("/public", express.static(path.join(__dirname, "../../public/")));

app.use("/", indexRouter);
app.use("/", apiRouter);
// comment out when having an actual favicon
app.get("/favicon.ico", (_, res) => res.status(204));

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // set locals, only providing error in development
    const message = err.message;
    const error = process.env.NODE_ENV === "Production" ? {} : err;

    // render the error page
    res.status(500);
    res.render("error", {
      error,
      message,
      status: 500
    });
  }
);

export default app;
