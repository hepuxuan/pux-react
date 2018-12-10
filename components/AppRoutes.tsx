import * as React from "react";
import { Route, Switch, match as Match } from "react-router-dom";
import { AsyncRoute } from "./AsyncRoute";
import { StaticContext, RouteComponentProps } from "react-router";
import { Loader } from "./Loader";
import { routes } from "../routes";

const AppRoutes: React.SFC<{}> = () => (
  <Switch>
    {routes.map(({ component }) => (
      <Route
        key={component.path}
        path={component.path}
        render={({
          staticContext,
          ...props
        }: {
          staticContext?: StaticContext;
        } & RouteComponentProps) => {
          return (
            <AsyncRoute
              component={component}
              staticContext={staticContext}
              loader={Loader}
              {...props}
            />
          );
        }}
      />
    ))}
  </Switch>
);

export { AppRoutes };
