import * as React from "react";
import { RouteComponentProps, match as Match } from "react-router";

interface IProps extends RouteComponentProps {
  component: React.ComponentType<any>;
  getData: (match: Match) => Promise<any>;
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
    }
  }

  componentDidMount() {
    if (!this.state.data) {
      this.props.getData(this.props.match).then(data => {
        this.setState({ data });
      });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (
      nextProps.location.pathname !== this.props.location.pathname ||
      nextProps.location.search !== this.props.location.search
    ) {
      this.setState({ data: null });
      this.props.getData(nextProps.match).then(data => {
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
      if (this.state.data) {
        return <Component {...this.state.data} {...props} />;
      } else {
        return <Loader />;
      }
    } else {
      const data = staticContext.data || {};
      return <Component {...data} {...props} />;
    }
  }
}

export { AsyncRoute };
