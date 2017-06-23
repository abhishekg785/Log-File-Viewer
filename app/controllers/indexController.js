/*
 * author : abhishek goswami
 * abhishekg785@gmail.com
 */

var async = require('async');
var file_module = require('./fileProcess.js'); // module for handling the files

exports = module.exports;

;(function(exports) {

    'use strict'

    // cache the error string to show to client
    var errStr = "<p class = 'message'>File <span>not Found!</span></p>";

    exports.GetIndex = function(req, res) {
        file_module.SetGlobalsVarToZero();
        res.render('index');
    }

    exports.ProcessLogFile = function(req, res) {
        var filePath = req.body.filePath;
        var action = req.body.action;

        // if error is received , then end the response asap!
        var obj = new file_module.ReadFile(filePath, 10, action, function errorHandler(err) {
            res.end(JSON.stringify([errStr]));
        });

        async.waterfall([
                obj.readFile.bind(obj),
                function(data, callback) {
                    console.log('sending data');
                    res.end(JSON.stringify(data));
                    callback(null);
                },
                obj.readLimiter.bind(obj)
            ],
            function(err, data) {
                if(!err) {
                    console.log(data);
                }
                else {
                    console.log(err);
                }
            });
    }

})(exports);
