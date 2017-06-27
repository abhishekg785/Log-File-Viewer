/**
 * author : abhishek goswami
 * abhishekg785@gmail.com
 *
 * indexController_test.js : unit testing for the indexController file
 */

'use strict'

let path = require('path');
let assert = require('chai').assert;

let request = require('request');

describe('testing indexController module', function () {
    var indexGETRoute;
    beforeEach(function() {
        indexGETRoute = 'http://localhost:3000/';
    });
    describe('checking the get index route', function() {
        it('GET request on the route, req status code must be 200', function(done) {
            request(indexGETRoute, function(err, res) {
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });

});