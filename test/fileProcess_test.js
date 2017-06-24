/**
 * author : abhishek goswami
 * abhishekg785@gmail.com
 *
 * fileProcess_test.js : unit testing for the fileProcess module
 */

/**
 * NOTE : The files offset are hard coded in the test cases for the given test file
 * to get it work with another file, set the offsets with care
 * previous-nav works fine only for secondLastBufferPosition = 0, as chunk size  will be diff
 * and not fixed , going prev is difficult, am still figuring a way out.
 */


var path = require('path');
var assert = require('chai').assert;

var fileProcess = require('../app/controllers/fileProcess');

/**
 * testing starts here
 * create the object of the ReadFile constructor and make it available to each
 * test function using beforeEach
 * Set the parameters such as test file path etc to be available to each test case
 */
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

    // testing that the cons sets the value to the params passed
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

    // checks for the buffer positions or offsets of the file are set or not
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

    describe('testing the readFile() for various user\'s action', function() {
        it('must read the first 10 lines from the file and set the CurrentBufferPosition parameter', function(done) {
            obj.readFile(function(err, data) {
                // console.log(data);
                assert.equal(_Globals.LastReadBufferPosition, 0);
                assert.equal(_Globals.SecondLastBufferPosition, 0);
                assert.equal(_Globals.CurrentBufferPosition, 894);
                done();
            });
        });
    });

    describe("testing the readFile(), for the user action = 'next-nav'", function() {
        it('must fetch the next 10 lines of the test file', function(done) {
            _Globals.CurrentBufferPosition = 894;
            obj = new fileProcess.ReadFile(filePath, lineCount, 'next-nav', function(err) {
                errorStatus = true;
            });
            obj.readFile(function(err, data) {
                assert.equal(_Globals.CurrentBufferPosition, 2001);
                assert.equal(_Globals.LastReadBufferPosition, 894);
                assert.equal(_Globals.SecondLastBufferPosition, 0);
                done();
            });
        });
    });

    describe("testing the readFile(), for the user action = 'prev-nav' for the currentBufferPOsition = 2001", function() {
        it('must fetch the next 10 lines of the test file', function(done) {
            _Globals.CurrentBufferPosition = 2001;
            _Globals.LastReadBufferPosition = 894;
            _Globals.SecondLastBufferPosition = 0;
            obj = new fileProcess.ReadFile(filePath, lineCount, 'previous-nav', function(err) {
                errorStatus = true;
            });
            obj.readFile(function(err, data) {
                assert.equal(_Globals.CurrentBufferPosition, 894);
                assert.equal(_Globals.LastReadBufferPosition, 0);
                assert.equal(_Globals.SecondLastBufferPosition, 0);
                done();
            });
        });
    });
});

// testing for the global variables
describe("Testing SetGlobalsVarToZero()", function() {
    it('must set the params of _Globals to zero', function(done) {
        _Globals = fileProcess._Globals;
        fileProcess.SetGlobalsVarToZero();
        assert.equal(_Globals.CurrentBufferPosition, 0);
        assert.equal(_Globals.LastReadBufferPosition, 0);
        assert.equal(_Globals.SecondLastBufferPosition, 0);
        done();
    })
})