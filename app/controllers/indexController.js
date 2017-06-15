/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 */

var file_module = require('./fileProcess.js'); // module for handling the files

exports = module.exports;

;(function(exports) {

	'use strict'

	exports.GetIndex = function(req, res) {
		file_module.SetGlobalsVarToZero();
		res.render('index');
	}

	exports.ProcessLogFile = function(req, res) {
		var filePath = req.body.filePath;
		var action = req.body.action;

		try {
			var obj = new file_module.ReadFile(filePath, 10, action);
			obj.readFile(function(data) {
				res.end(JSON.stringify(data)); // send the data to the client
			}, obj.reader);
		}
		catch(ex) {
			console.log(ex);
		}
	}

})(exports);
