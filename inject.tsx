import * as React from "react";
import apis from "../../apis";

function getInjectedApiMethod<T>(action: string): T {
  const retFunc = function(...args: any[]) {
    if (process.env.IS_BROWSER) {
      return fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          params: [...args]
        })
      }).then(res => res.json());
    } else {
      return (apis as any)[action](args);
    }
  };

  return (retFunc as any) as T;
}

function injectApi(...args: string[]) {
  return function(BaseComponent: React.ComponentType): any {
    const InjectedClass = class InjectedClass extends React.Component {
      public render() {
        const newProps = { ...this.props };
        for (const arg of args) {
          (newProps as any)[arg] = getInjectedApiMethod(arg);
        }
        return <BaseComponent {...newProps} />;
      }
    };

    if ((BaseComponent as any).path) {
      (InjectedClass as any).path = (BaseComponent as any).path;
    }

    if ((BaseComponent as any).title) {
      (InjectedClass as any).title = (BaseComponent as any).title;
    }

    if ((BaseComponent as any).getInitialProps) {
      (InjectedClass as any).getInitialProps = (BaseComponent as any).getInitialProps;
    }

    return InjectedClass;
  };
}

export { injectApi, getInjectedApiMethod };
