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
    if(action == 'start-nav') {
      console.log('start-nav');
      _Globals.CurrentBufferPosition = 0;
    }
    this.filePath = filePath;
    this.chunkSize = 0;
    this.startPosition = 0;
    this.currentLineNumber = 0;
    this.lineCount = lineCount;
    this.data = [];
    this.action = action;
    this.readStream = fs.createReadStream(filePath, {
      start: _Globals.CurrentBufferPosition
    });

    this.readFile = function (callback) {
      var _this = this;
      this.readStream.pipe(es.split())
      .pipe(es.mapSync(function(line) {

        _this.readStream.pause();
        _this.chunkSize += line.length + 1;
        _this.currentLineNumber += 1;
        _this.data.push(line);
        // console.log(line);
        if(_this.currentLineNumber == _this.lineCount) {
          callback(this.data);
          _Globals.SecondLastBufferPosition = _Globals.LastReadBufferPosition;
          _Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
          _Globals.CurrentBufferPosition = _this.chunkSize + _Globals.LastReadBufferPosition;
          console.log(_Globals);
          _this.readStream.destroy();
        }
      }))
    }

    this.reader = (data) => {
      console.log(this.data);
      this.data = [];
      this.readStream.resume();
    }
  }

  // var obj1 = new ReadFile('../../../demo.txt', 2);
  // obj1.readFile(obj1.reader);
  // var obj2 = new ReadFile('../../../demo.txt', 0, 5);
  // obj2.readFile(obj2.reader);
  exports.ReadFile = ReadFile;

})(exports);
