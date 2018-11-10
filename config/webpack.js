const webpack = require("webpack");
const path = require("path");
const _ = require("lodash");
const fs = require("fs");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: require.resolve("./tsconfig.json")
            }
          }
        ]
      }
    ]
  },

  node: {
    fs: "empty"
  },

  entry: {
    app: [
      path.join(__dirname, "../polyfill.ts"),
      path.join(__dirname, "../client.tsx")
    ]
  },

  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "../../../dist/public/webpack"),
    publicPath: "/webpack/"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  mode: "production",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      },

      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        IS_BROWSER: JSON.stringify("true"),
        NODE_ENV: JSON.stringify("production")
      }
    }),
    function OutputHash() {
      this.plugin("done", stats => {
        const assetsByChunkName = stats.toJson().assetsByChunkName;
        for (let key in assetsByChunkName) {
          if (key === "vendor") {
            assetsByChunkName[key] = { js: assetsByChunkName[key] };
          } else {
            // const assetsList = assetsByChunkName[key];
            // const css = _.find(assetsList, s => /\.(css)$/.test(s));
            // const js = _.find(assetsList, s => /\.(js)$/.test(s));

            assetsByChunkName[key] = {
              css: undefined,
              js: assetsByChunkName[key]
            };
          }
        }

        fs.writeFileSync(
          path.join(__dirname, "../../../dist/lib/pux/assetsInfo.json"),
          JSON.stringify(assetsByChunkName)
        );
      });
    }
  ]
};
