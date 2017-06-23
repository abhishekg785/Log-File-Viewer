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
    describe("ReadFile constructor must set the values as passed in the parameter", function() {
        var obj,
            filePath = path.join(__dirname, 'testFile'),
            lineCount = 10,
            action = 'initial',
            errorStatus = false;
        beforeEach(function() {
            obj = new fileProcess.ReadFile(filePath, lineCount, action, function(err) {
                errorStatus = true;
            });
        });
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
    });
});