import * as React from "react";
import { RouteComponentProps, match as Match } from "react-router-dom";
import isFunction = require("lodash/isFunction");
import { parse } from "qs";

interface IProps extends RouteComponentProps {
  importPath: string;
  staticContext: any;
  loader: React.ComponentType;
  importFunc: any;
}

declare global {
  interface Window {
    __INITIAL_DATA__: any;
    __MODULE__: any;
  }
}

class AsyncRoute extends React.Component<
  IProps,
  { data?: object; component?: React.ComponentType<any> }
> {
  constructor(props: IProps) {
    super(props);
    if (process.env.IS_BROWSER) {
      if (window.__MODULE__) {
        const module = window.__MODULE__;
        this.state = {
          data: window.__INITIAL_DATA__,
          component: module
        };
        delete window.__MODULE__;
        if (!this.state.data && module.getInitialProps) {
          module
            .getInitialProps(
              this.props.match,
              parse(this.props.location.search, { ignoreQueryPrefix: true })
            )
            .then((data: any) => {
              this.setState({ data });
            });
        }
      } else {
        this.state = {
          data: window.__INITIAL_DATA__,
          component: null
        };
        props.importFunc().then(({ default: module }: { default: any }) => {
          this.setState({
            component: module
          });
          document.title = module.title;
          if (!this.state.data && module.getInitialProps) {
            module
              .getInitialProps(
                this.props.match,
                parse(this.props.location.search, { ignoreQueryPrefix: true })
              )
              .then((data: any) => {
                this.setState({ data });
              });
          }
        });
      }

      delete window.__INITIAL_DATA__;
    } else {
      this.state = {
        data: undefined,
        component: require(`../${props.importPath}`).default
      };
    }
  }

  // componentWillReceiveProps(nextProps: IProps) {
  //   if (
  //     (this.props.component as any).getInitialProps &&
  //     (nextProps.location.pathname !== this.props.location.pathname ||
  //       nextProps.location.search !== this.props.location.search)
  //   ) {
  //     this.setState({ data: null });
  //     (this.props.component as any)
  //       .getInitialProps(
  //         nextProps.match,
  //         parse(nextProps.location.search, { ignoreQueryPrefix: true })
  //       )
  //       .then((data: any) => {
  //         this.setState({ data });
  //       });
  //   }
  // }

  public render() {
    const { staticContext, loader: Loader, ...props } = this.props;
    const { component: Component } = this.state;

    if (process.env.IS_BROWSER) {
      if (!Component) {
        return null;
      }
      if (isFunction((Component as any).getInitialProps)) {
        if (this.state.data) {
          return <Component {...this.state.data} {...props} />;
        } else {
          return <Loader />;
        }
      } else {
        return <Component {...props} />;
      }
    } else {
      const data = staticContext.data || {};
      return <Component {...data} {...props} />;
    }
  }
}

export { AsyncRoute };
