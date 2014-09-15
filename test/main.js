// test/main.js
var should = require('should');
var sleepsort = require('../lib/apigee-sdk-mgmt-api');

describe('with an empty array argument', function() {
        it('calls the callback with an empty array', function(done) {
            var result = sleepsort([], function(result) {
                result.should.eql([]);
                done();
            });
        });
    });

describe('with a single element array', function() {
    it('calls the callback with a single element array', function(done) {
        var result = sleepsort([1], function(result) {
            result.should.eql([1]);
            done();
        });
    });
});

describe('with an unsorted two element array', function() {
    it('calls the callback with a sorted two element array', function(done) {
        var result = sleepsort([2, 1], function(result) {
            result.should.eql([1, 2]);
            done();
        });
    });
});

function sleepsort(array, callback) {
    if (!array || array.length === 0)
        return process.nextTick(function() {callback([]);});
    var result = [];
    function appendResult(n) {
        return function() {
            result.push(n);
            if (array.length === result.length) 
                callback(result);
        };
    }
    for(var i = 0; i < array.length; i++) 
        setTimeout(appendResult(array[i]), array[i]);
}