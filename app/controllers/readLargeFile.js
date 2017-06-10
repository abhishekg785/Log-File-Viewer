/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

var fs = require('fs'),
		stream = require('stream'),
		eventStream = require('event-stream');

var exports = module.exports;

(function(exports) {
	'use strict'

	var _Globals = {
		LineCount : 10, // no of lines to count in a file
		CurrentBufferPosition : 0, // position in the file currently pointing to
		LastReadBufferPosition : 0, // last read position in the file
	}

	function ReadLargeFiles(filePath) {
		this.filePath = filePath;
		this.chunkSize = 0;
		this.lineNumber = 0;
		this.readStream = fs.createReadStream(filePath, {
			start : _Globals.CurrentBufferPosition
		});
		this.readFile();
	}

	ReadLargeFiles.prototype.readFile = function() {
		var that = this;
		this.readStream.pipe(eventStream.split())
			.pipe(eventStream.mapSync((line) => {

					this.chunkSize += line.length;
					this.lineNumber += 1;

					if(this.lineNumber == 10) {
						_Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
						_Globals.CurrentBufferPosition += this.chunkSize + _Globals.LastReadBufferPosition;
						console.log(_Globals);
						this.readStream.destroy();
					}

			}))
			.on('error', function(err) {
				console.log(err);
			})
			.on('end', function() {
				console.log('File has been read till end successfully');
			})
	}

	// new ReadLargeFiles('/var/log/mongodb/mongod.log');

	exports.ReadLargeFiles = ReadLargeFiles;

})(exports);
