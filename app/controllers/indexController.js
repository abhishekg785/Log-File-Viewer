/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

var fs = require('fs');

exports.processLogFile = function(req, res) {
	var filePath = req.body.filePath;
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
		if(!err) {
			console.log(data);
		}
		else {
			console.log(err);
		}
	});
}