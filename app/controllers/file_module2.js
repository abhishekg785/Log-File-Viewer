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
  SecondLastBufferPosition: 0,
  ReadFileFrom: 0
}

var NavActions = {
    initial : 'initial',
    start : 'start-nav',
    end : 'end-nav',
    next : 'next-nav',
    prev : 'previous-nav'
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
    this.action = action; // action such as next, prev, begin or end of the file
    this.decideCurrentBufferPos(this.action);
    try {
      this.readStream = fs.createReadStream(filePath, {
        start: _Globals.ReadFileFrom
      });
    }
    catch(ex) {
      console.log(ex);
    }
  }

  ReadFile.prototype.decideCurrentBufferPos = function(action) {

    if(action == NavActions.start || action == NavActions.initial) {
      _Globals.ReadFileFrom = 0;
    }
    else if(action == NavActions.next) {
      _Globals.ReadFileFrom = _Globals.CurrentBufferPosition;
    }
    else if(action == NavActions.prev) {
      _Globals.ReadFileFrom = _Globals.SecondLastBufferPosition;
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
        if(_this.action == NavActions.start || _this.action == NavActions.initial) {
          SetGlobalsVarToZero();
          _Globals.CurrentBufferPosition  += _this.chunkSize;
        }
        else if(_this.action == NavActions.prev) {
          _Globals.CurrentBufferPosition = _this.chunkSize + _Globals.SecondLastBufferPosition;
          // _Globals.CurrentBufferPosition = _Globals.LastReadBufferPosition;
          _Globals.LastReadBufferPosition = _Globals.SecondLastBufferPosition;
        }
        else if(_this.action == NavActions.next) {
          _Globals.SecondLastBufferPosition = _Globals.LastReadBufferPosition;
          _Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
          _Globals.CurrentBufferPosition += _this.chunkSize;
        }
        // _Globals.SecondLastBufferPosition = _Globals.LastReadBufferPosition;
        // _Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
        // _Globals.CurrentBufferPosition = _this.chunkSize + _Globals.LastReadBufferPosition;
        console.log(_Globals);
        _this.readStream.destroy();
      }
    }))
  }

  ReadFile.prototype.reader = function(data) {
    this.data = [];
    this.readStream.resume();
  }

  function SetGlobalsVarToZero() {
    _Globals.CurrentBufferPosition = 0;
    _Globals.SecondLastBufferPosition = 0;
    _Globals.LastReadBufferPosition = 0;
  }

  exports.SetGlobalsVarToZero = SetGlobalsVarToZero;
  exports.ReadFile = ReadFile;

})(exports);
