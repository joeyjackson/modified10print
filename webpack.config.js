const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"), 
    filename: "index.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.scss?$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ]
      },
      {
        test: /\.ts?$/i,
        loader: "ts-loader",
        exclude: /node_modules/
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".scss", ".css", ".json"]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: path.resolve(__dirname, "public", "favicon.ico"),
      inject: "body",
      title: "Lines",
    })
  ]
}