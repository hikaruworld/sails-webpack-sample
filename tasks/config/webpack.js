"use strict";

/**
 * Compile WebPack
 *
 * ---------------------------------------------------------------
 */
module.exports = function(grunt) {

  var webpackConfig = require("../../webpack.config.js");

	grunt.config.set("webpack", {
		options: webpackConfig,
		build: {
		}
	});

	grunt.loadNpmTasks("grunt-webpack");
};
