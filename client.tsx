import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppRoutes } from "./components/AppRoutes";
import { BrowserRouter } from "react-router-dom";

ReactDOM.hydrate(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
  document.getElementById("root")
);
