import * as React from "react";
import { Route, Switch, match as Match } from "react-router-dom";
import { AsyncRoute } from "./AsyncRoute";
import { StaticContext, RouteComponentProps } from "react-router";
import { Loader } from "./Loader";
import { routes } from "../routes";

const AppRoutes: React.SFC<{}> = () => (
  <Switch>
    {routes.map(({ component, path, getInitialProps }) => (
      <Route
        key={path}
        path={path}
        render={({
          staticContext,
          ...props
        }: {
          staticContext?: StaticContext;
        } & RouteComponentProps) => {
          return (
            <AsyncRoute
              component={component}
              getData={getInitialProps}
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
