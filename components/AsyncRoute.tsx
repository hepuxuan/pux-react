import * as React from "react";
import { RouteComponentProps, match as Match } from "react-router";
import isFunction = require("lodash/isFunction");
import { parse } from "qs";

interface IProps extends RouteComponentProps {
  component: React.ComponentType<any>;
  staticContext: any;
  loader: React.ComponentType;
}

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

class AsyncRoute extends React.Component<IProps, { data?: object }> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: process.env.IS_BROWSER ? window.__INITIAL_DATA__ : undefined
    };

    if (process.env.IS_BROWSER) {
      delete window.__INITIAL_DATA__;
      document.title = (this.props.component as any).title;
    }
  }

  componentDidMount() {
    if (!this.state.data && (this.props.component as any).getInitialProps) {
      (this.props.component as any)
        .getInitialProps(this.props.match, parse(this.props.location.search))
        .then((data: any) => {
          this.setState({ data });
        });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (
      (this.props.component as any).getInitialProps &&
      (nextProps.location.pathname !== this.props.location.pathname ||
        nextProps.location.search !== this.props.location.search)
    ) {
      this.setState({ data: null });
      (this.props.component as any)
        .getInitialProps(
          nextProps.match,
          this.props.location.search,
          parse(this.props.location.search)
        )
        .then((data: any) => {
          this.setState({ data });
        });
    }
  }

  public render() {
    const {
      component: Component,
      staticContext,
      loader: Loader,
      ...props
    } = this.props;

    if (process.env.IS_BROWSER) {
      if (isFunction((this.props.component as any).getInitialProps)) {
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
