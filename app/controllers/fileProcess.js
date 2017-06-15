/*
* author : abhishek goswami
* abhishekg785@gmail.com
*
* Handles all the files related operations
*/

/*
* Things to do :
* Read the file using stream
*/
var fs = require('fs');
var es = require('event-stream');

exports = module.exports;

(function(exports) {

  'use strict'

  var _Globals = {
    LineCount: 2, // no of lines to count in a file
    CurrentBufferPosition: 0, // position in the file currently pointing to
    LastReadBufferPosition: 0, // last read position in the file
    SecondLastBufferPosition: 0, // maintain the second last position in the file
    ReadFileFrom: 0 // Position from which the file get reading
  }

  var NavActions = {
    initial : 'initial',
    start : 'start-nav',
    end : 'end-nav',
    next : 'next-nav',
    prev : 'previous-nav'
  }

  /**
  * Handles the file
  *
  * @constructor
  */
  function ReadFile(filePath, lineCount, action) {
    this.filePath = filePath; // path to the file
    this.chunkSize = 0; // chunk of the file being read at a time
    this.startPosition = 0; // start position of the file default
    this.currentLineNumber = 0; // line no being read in the file
    this.lineCount = lineCount; // the count of the lines to be read at a time
    this.data = []; // fetched data or 10 lines will be stored here
    this.action = action; // action such as next, prev, begin or end of the file
    this.decideCurrentBufferPos(this.action); //
    this.readStream = fs.createReadStream(filePath, {
      start: _Globals.ReadFileFrom
    });
  }

  /**
  * Decides the starting position in the file to read from using user's action
  * prev, next, start or end
  *
  * @param { string } action - the action of the user
  */
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

  /**
  * Read the file and return the fetched data
  * Reads the file in chunks of data using streams in Node.JS
  * Fetching the data is done using start/end offsets in the file and thus
  * saving time to not go through the entire file each time.
  *
  * @param { function } sendData - sends the fetched data
  * @param { function } callback - calls the reader fuction of the class
  */
  ReadFile.prototype.readFile = function (sendData, callback) {
    var _this = this; // saves this context in _this
    this.readStream.pipe(es.split())  // readStream
    .pipe(es.mapSync(function(line) {
      _this.readStream.pause(); // pause the stream for the while
      _this.chunkSize += line.length + 1; // calculates the chunk size of the portion of the file being read ( 10 lines )
      _this.currentLineNumber += 1; // calculates the current line count in the file
      _this.data.push(line); //
      if(_this.currentLineNumber == _this.lineCount) {
        sendData(_this.data);
        callback.call(_this, _this.data); // binding this to the function
        if(_this.action == NavActions.start || _this.action == NavActions.initial) { // will get executed for the start action.
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
        console.log(_Globals);
        _this.readStream.destroy(); // destroy the read stream here  as our work has been done !
      }
    }))
  }

  /**
  * @param { Array } data - Array of the fetched data
  */
  ReadFile.prototype.reader = function(data) {
    this.data = [];
    this.readStream.resume(); // resume the stream after taking these action
  }

  /*
  * Sets the global variables to initial
  */
  function SetGlobalsVarToZero() {
    _Globals.CurrentBufferPosition = 0;
    _Globals.SecondLastBufferPosition = 0;
    _Globals.LastReadBufferPosition = 0;
  }

  exports.SetGlobalsVarToZero = SetGlobalsVarToZero;
  exports.ReadFile = ReadFile;

})(exports);
