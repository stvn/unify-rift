var test = require('tap').test;
var api = require('../index');
var client = require('./test.rift');
var nock = require('nock');
var Promise = require('bluebird');

// record http traffic
// nock.recorder.rec();

api.config.set('base', '/api');
api.config.delegate({
  fail: function(params) {
    return new Promise(function(resolve, reject) {
      reject('error');
    });
  },
  succeed: function(params) {
    return new Promise(function(resolve, reject) {
      resolve(params);
    });
  }
});

test('should return error if implementation reject()s', function(t) {
  t.plan(2);
  api.fail({})
  .then(function(results) {
    t.notOk(results);
  }).catch(function(err) {
    t.ok(err);
    t.equal(err, 'error');
  }).finally(function() {
    t.end();
  });
});

test('should return results if implementation resolve()s', function(t) {
  var params = {};
  t.plan(2);
  api.succeed(params)
  .then(function(results) {
    t.ok(results);
    t.equal(results, params);
  }).catch(function(err) {
    t.notOk(err);
  }).finally(function() {
    t.end();
  });
});