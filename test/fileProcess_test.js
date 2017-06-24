/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 *
 * fileProcess_test.js : unit testing for the fileProcess module
 */

var path = require('path');
var assert = require('chai').assert;

var fileProcess = require('../app/controllers/fileProcess');

describe("testing the fileProcess module", function() {

    var obj,
        filePath = path.join(__dirname, 'testFile'),
        lineCount = 10,
        action = 'initial',
        errorStatus = false,
        _Globals;
    beforeEach(function() {
        obj = new fileProcess.ReadFile(filePath, lineCount, action, function(err) {
            errorStatus = true;
        });
        _Globals = fileProcess._Globals;
    });

    describe("ReadFile constructor must set the values as passed in the parameter", function() {
        it('sets the value', function(done) {
            assert.equal(obj.filePath, filePath);
            assert.equal(obj.lineCount, lineCount);
            assert.equal(obj.action, action);
            done();
        })
        it('calls the errorHandler callback when file is not found, using a non-existing filePath and it must set the errorStatus to "true" (due to the callback function)', function(done) {
            var filePath = "non_existing_file_1223";
            obj = new fileProcess.ReadFile(filePath, lineCount, action, function(err) {
                errorStatus = true;
                done();
            });
        })

        it('must set the buffer positions to read the file, in this case the ReadFileFrom must be set to zero due to action = "initial"', function(done) {
            assert.equal(_Globals.ReadFileFrom, 0);
            done();
        })
    });

    describe('testing the decideCurrentBufferPos()', function() {
        describe('must find the offset buffer positions to read the file', function() {
            it('calculating for the action ="initial" or action = "start"', function(done) {
                obj.decideCurrentBufferPos('initial');
                done();
            });

            it('calculating for the action ="next-nav"', function(done) {
                _Globals.CurrentBufferPosition = 4500; // any random value for testing
                obj.decideCurrentBufferPos('next-nav');
                assert.equal(_Globals.ReadFileFrom, _Globals.CurrentBufferPosition);
                done();
            });

            it('calculating for the action ="previous-nav"', function(done) {
                _Globals.CurrentBufferPosition = 4500; // any random value for testing
                obj.decideCurrentBufferPos('next-nav');
                assert.equal(_Globals.ReadFileFrom, _Globals.CurrentBufferPosition);
                done();
            });
        });
    });
    
});

