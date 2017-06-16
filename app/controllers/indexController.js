/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

var async = require('async');
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

		var obj = new file_module.ReadFile(filePath, 10, action);
		async.waterfall([
			obj.readFile.bind(obj),
			function(data, callback) {
				res.end(JSON.stringify(data));
				callback(null);
			},
			obj.readLimiter.bind(obj)
		],
		function(err, data) {
			if(!err) {
				console.log(err);
			}
			else {
				console.log(data);
			}
		});
	}

})(exports);
