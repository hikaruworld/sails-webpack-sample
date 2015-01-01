"use strict";

var path = require("path");
var entry = require("./tasks/entry");

var webpack = require("webpack");

module.exports = {
  cache: true,
  entry: (function() {
    var valueGenerator = function(filename) { return "./assets/js/" + entry.splitext(filename); };
    var _entry = entry.entryFiles("./views", undefined, valueGenerator);

    return _entry;
  }()),
  output: {
    path: path.join(__dirname, ".tmp/public/dist/js"),
    publicPath: "dist/",
    filename: "[name].js",
    chunkFilename: "[chunkhash].js"
  },
  resolve: {
    modulesDirectories: ["node_modules"]
  }
};
