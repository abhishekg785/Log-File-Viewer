/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

var readLargeFiles = require('./readLargeFile');
var exports = module.exports;

(function(exports) {

	'use strict'

	exports.GetIndex = function(req, res) {
		res.render('index');
	}

	exports.ProcessLogFile = function(req, res) {
		console.log(req.body);
		var filePath = req.body.filePath;
		console.log(filePath);
		var readFile = new readLargeFiles.ReadLargeFiles(filePath);
	}

})(exports);
