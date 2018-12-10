## How to use

* install dependencies

  `npm install react react-dom react-router-dom pux-react`

* create `app/controllers` folder in your project
  
  `mkdir -p app/controllers`

* create your page index.tsx
  
  ```
  import * as React from "react";
  export default class Index extends React.Component<{}> {
    public static path = "/"; // This is react router format path
    public static title = "Index"; // This is document.title

    public render() {
      return <div>Hello Pux</div>;
    }
  }
  ```

* add script to package.json file
  
  ```"scripts": { "dev": "pux dev", "build": "pux build", "start": "pux start" }```

* run `npm run dev` to start the app, go to `localhost:3000`

## Features
* Typescript runtime
* server side rendering
* static assets serving
* 0 config
* start app in cluster mode in production environment
* start app as daemon process in production environment
* automatic data fetching
* write client side and server side code in the same file

## Demo App

Go to demos/newsApp

## Data fetching
```
  import * as React from "react";
  import { match as Match, Link } from "react-router-dom";

  export default class Index extends React.Component<{}> {
    public static path = "/";
    public static getInitialProps(match: Match) {
      return Promise.resolve({hello: "world"})
    }
    public render() {
      return <div>Hello ${this.props.hello}</div>;
    }
  }
  ```

`getInitialProps` will be executed on both server side and client and we defer the execution of render funtion until the promise is resolved.

## static assets serving

Any files placed under `app/public` folder will be served as static assets.

## sever specific code

```
  import * as React from "react";
  import { proxy } from "pux-react";

  export default class Index extends React.Component<{}> {
    ...
    @proxy
    public static readFile(fileName: string) {
      const fs = require('fs')
      return new Promise(function(resolve, reject){
        fs.readFile(fileName, null, (err, data) => {
            err ? reject(err) : resolve(data);
        });
      });
    }
    
    componentDidMount() {
      Index.readFile('fileName').then(data => {
        this.setState({data})
      })
    }
    render() {
      ...
    }
  }
  
  ```
  
  Method decorated with proxy will be executed as regular function on the server side. However on the client, the arguments will be serialized as json and submitted as a RPC call to the server to let server handle the call, the response will again be serialized as json and return to the client
  
## Run in production

`npm install`

`npm start`

This will start the app as a daemon process.
  
## TODO:

* Support css module
* Custom layout
* Custom server code
* Support custom config when starting in cluster mode
* HMR
* Code split
* Add test
* http2
* Support PWA
