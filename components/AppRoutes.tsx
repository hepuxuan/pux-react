import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { AsyncRoute } from "./AsyncRoute";
import { StaticContext, RouteComponentProps } from "react-router";
import { Loader } from "./Loader";
const { routes } = require("../routes");

const AppRoutes: React.SFC<{}> = () => (
  <Switch>
    {routes.map(
      ({
        importPath,
        path,
        importFunc
      }: {
        importPath: string;
        path: string;
        importFunc: any;
      }) => (
        <Route
          key={path}
          exact
          path={path}
          render={({
            staticContext,
            ...props
          }: {
            staticContext?: StaticContext;
          } & RouteComponentProps) => {
            return (
              <AsyncRoute
                importPath={importPath}
                importFunc={importFunc}
                staticContext={staticContext}
                loader={Loader}
                {...props}
              />
            );
          }}
        />
      )
    )}
  </Switch>
);

export { AppRoutes };
