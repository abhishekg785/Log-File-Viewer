/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 */

var fs = require('fs'),
          stream = require('stream'),
          es = require('event-stream');

var exports = module.exports;

(function(exports) {
          'use strict'

          var _Globals = {
                    LineCount: 2, // no of lines to count in a file
                    CurrentBufferPosition: 0, // position in the file currently pointing to
                    LastReadBufferPosition: 0, // last read position in the file
                    SecondLastBufferPosition: 0
          }

          var NavActions = {
                    start : 'start-nav',
                    end : 'end-nav',
                    next : 'next-nav',
                    prev : 'previous-nav'
          }

          var readStream;
          exports.ReadLargeFiles = function(filePath, action) {
                    var currentLineNumber = 0;
                    var chunkSize = 0;
                    var startPosition = 0;
                    // if(action == NavActions.start || action == NavActions.initial) {
                    //           startPosition = 0;
                    // }
                    // else if(action == NavActions.next) {
                    //           startPosition = _Globals.CurrentBufferPosition;
                    // }
                    // else if(action == NavActions.prev) {
                    //           startPosition = _Globals.SecondLastBufferPosition
                    // }

                    readStream = fs.createReadStream(filePath, {
                                        start: _Globals.CurrentBufferPosition
                              })
                              .pipe(es.split())
                              .pipe(es.mapSync(function(line) {
                                        chunkSize += line.length + 1;
                                        currentLineNumber += 1;
                                        console.log(line);
                                        console.log(currentLineNumber);
                                        if (currentLineNumber == _Globals.LineCount) {
                                                  _Globals.SecondLastBufferPosition = _Globals.LastReadBufferPosition;
                                                  _Globals.LastReadBufferPosition = _Globals.CurrentBufferPosition;
                                                  _Globals.CurrentBufferPosition = chunkSize + _Globals.LastReadBufferPosition;
                                                  console.log(_Globals);
                                                  readStream.destroy();
                                        }
                              }))
                              .on('error', function(err) {
                                        console.log('Error while reading file.', err);
                              })
                              .on('end', function() {
                                        readStream = fs.createReadStream(filePath, {
                                                            start: 0
                                        })
                                        _Globals.CurrentBufferPosition = 0;
                                        _Globals.LastReadBufferPosition = 0;
                                        _Globals.SecondLastBufferPosition = 0;
                                        console.log('end of the file');
                              })
          }

          exports.setGlobalsVarToZero = function() {
                    _Globals.CurrentBufferPosition = 0;
                    _Globals.LastReadBufferPosition = 0;
          }

})(exports);
