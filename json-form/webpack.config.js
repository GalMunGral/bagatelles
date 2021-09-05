const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.form\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
              plugins: [["./babel-plugin-json-form.js", { test: 111 }]],
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // devtool: false,
  plugins: [new HtmlWebpackPlugin()],
};
