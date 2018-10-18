import fs = require("fs");
let chunkMap: any;

if (process.env.NODE_ENV === "production") {
  chunkMap = JSON.parse(
    fs.readFileSync(__dirname + "/assetsInfo.json").toString()
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
