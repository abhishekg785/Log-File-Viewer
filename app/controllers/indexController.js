/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 */

var readLargeFiles = require('./readLargeFile');
var file_module = require('./file_module2');

var exports = module.exports;

(function(exports) {

	'use strict'

	exports.GetIndex = function(req, res) {
		console.log(readLargeFiles.setGlobalsVarToZero());
		res.render('index');
	}

	exports.ProcessLogFile = function(req, res) {
		var filePath = req.body.filePath;
		var action = req.body.action;
		//var readFile = readLargeFiles.ReadLargeFiles(filePath, action);
		var obj = new file_module.ReadFile('/var/log/demo.txt', 2, action);
		obj.readFile(obj.reader);
	}

})(exports);
