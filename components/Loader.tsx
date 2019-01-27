import * as React from "react";

let Loader: React.ComponentType;

try {
  require.resolve("../../../app/components/Loader");
  Loader = require("../../../app/components/Loader").default;
} catch (e) {
  Loader = () => <div>Loading</div>;
}

export { Loader };
