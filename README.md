## Features

- Typescript runtime
- server side rendering
- static assets serving
- 0 config
- Route based code split
- start app in cluster mode in production environment
- start app as daemon process in production environment
- automatic data fetching

## How to use

- install dependencies

  `npm install react react-dom react-router-dom pux-react`

- create `app/controllers` folder in your project

  `mkdir -p app/controllers`

- create your page index.tsx

  ```tsx
  import * as React from "react";
  export default class Index extends React.Component<{}> {
    public static path = "/"; // This is react router format path
    public static title = "Index"; // This is document.title

    public render() {
      return <div>Hello Pux</div>;
    }
  }
  ```

- add script to package.json file

  `"scripts": { "dev": "pux dev", "build": "pux build", "start": "pux start" }`

- run `npm run dev` to start the app, go to `localhost:3000`

## Demo App

Go to demos/newsApp

## Data fetching

```tsx
import * as React from "react";
import { match as Match, Link } from "react-router-dom";

export default class Index extends React.Component<{}> {
  public static path = "/";
  public static getInitialProps(match: Match, query: {}) {
    return Promise.resolve({ hello: "world" });
  }
  public render() {
    return <div>Hello ${this.props.hello}</div>;
  }
}
```

`getInitialProps(match: Match, query: any)` will be executed on both server side and client and we defer the execution of render funtion until the promise is resolved.

## static assets serving

Any files placed under `app/public` folder will be served as static assets.

## sever specific code

- Create file `/apis/index.ts`.

- `/apis/index.ts` should export a default object with a list of methods. Example:

  ```ts
  function hello(hello: string) {
    return Promise.resolve({
      hello: `${hello} world`
    });
  }

  export default {
    hello
  };
  ```

- In your component, you could access your api functions using `injectApi` HOC. Example:

  ```tsx
  import * as React from "react";
  import { injectApi } from "pux-react";

  interface IProps extends RouteComponentProps {
    hello: (hello: string) => Promise<any>;
  }

  class Hello extends React.Component<IProps> {
    public componentDidMount() {
      this.props.hello("hello").then(hello => {
        this.setState({
          hello
        });
      });
    }

    public state = {
      hello: ""
    };

    public render() {
      return <div>{this.state.hellp}</div>;
    }
  }

  export default injectApi("hello")(Hello);
  ```

## Run in production

`npm install`

`npm start`

This will start the app as a daemon process.

## Custom Loader

Create `Loader.tsx` file in `app/components` folder(This component will be used when fetching data and async route). Loader.tsx file should export the component as default.

example:

```tsx
import * as React from "react";

const Loader: React.SFC = () => <div>My Loader</div>;

export default Loader;
```

## TODO:

- Support css module
- Custom layout
- Custom server code
- Support custom config when starting in cluster mode
- HMR
- Add test
- http2
- Support PWA
- docker??
