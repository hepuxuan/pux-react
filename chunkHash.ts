import fs = require("fs");
import path = require("path");
let chunkMap: any;

if (process.env.NODE_ENV === "production") {
  chunkMap = JSON.parse(
    fs
      .readFileSync(path.resolve(__dirname, "../../../assetsInfo.json"))
      .toString()
  );
} else {
  chunkMap = {
    app: {
      js: "app.dev.js"
    },
    vendors: {
      js: "vendors.dev.js"
    }
  };
}

function getChunkHash(chunk: string): string {
  return chunkMap[chunk].js;
}

export { getChunkHash };
