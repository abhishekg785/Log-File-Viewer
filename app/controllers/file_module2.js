/*
* author : abhishek goswami
* abhishekg785@gmail.com
*/

var fs = require('fs');
var es = require('event-stream');

var _Globals = {
  LineCount: 2, // no of lines to count in a file
  CurrentBufferPosition: 0, // position in the file currently pointing to
  LastReadBufferPosition: 0, // last read position in the file
  SecondLastBufferPosition: 0
}

exports = module.exports;

(function(exports) {

  function ReadFile(filePath, lineCount, action) {
    this.filePath = filePath;
    this.chunkSize = 0;
    this.startPosition = 0;
    this.currentLineNumber = 0;
    this.lineCount = lineCount;
    this.data = [];
    this.action = action;
    try {
      this.readStream = fs.createReadStream(filePath, {
        start: _Globals.CurrentBufferPosition
      });
    }
    catch(ex) {
      console.log(ex);
    }
  }

  ReadFile.prototype.readFile = function (sendData, callback) {
    var _this = this;
    this.readStream.pipe(es.split())
    .pipe(es.mapSync(function(line) {
      _this.readStream.pause();
      _this.chunkSize += line.length + 1;
      _this.currentLineNumber += 1;
      _this.data.push(line);
      if(_this.currentLineNumber == _this.lineCount) {
        sendData(_this.data);
        callback.call(_this, _this.data); // binding _this to the function
        _Globals.SecondLastBufferPosition = _Globals.LastReadBufferPosition;
        _Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
        _Globals.CurrentBufferPosition = _this.chunkSize + _Globals.LastReadBufferPosition;
        // console.log(_Globals);
        _this.readStream.destroy();
      }
    }))
  }

  ReadFile.prototype.reader = function(data) {
    console.log(this);
    this.data = [];
    this.readStream.resume();
  }

  exports.ReadFile = ReadFile;

})(exports);
