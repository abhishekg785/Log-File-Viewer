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

		try {
			var obj = new file_module.ReadFile(filePath, 10, action);
			obj.readFile(function(data) {
				console.log(data);
				res.end(JSON.stringify(data));
			}, obj.reader);
		}
		catch(ex) {
			console.log(ex);
		}
	}

})(exports);
