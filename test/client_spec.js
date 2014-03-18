var test = require('tap').test;
var api = require('../index');
var client = require('./test.rift');
var nock = require('nock');

// record http traffic
// nock.recorder.rec();

api.config.set('base', '/api');
api.config.delegate(client);

test('should return error in callback for 403 response', function(t) {
  nock('http://localhost:80')
  .get('/api/rel/path')
  .reply(403, "<html>\r\n<head><title>403 Forbidden</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>403 Forbidden</h1></center>\r\n<hr><center>nginx/1.4.5</center>\r\n</body>\r\n</html>\r\n",
    { server: 'nginx/1.4.5',
      date: 'Sun, 02 Mar 2014 20:03:06 GMT',
      'content-type': 'text/html',
      'content-length': '168',
      connection: 'close' });

  api.search({}).then(function(results) {
    t.notOk(results, 'should not have results');
  }).catch(function(err) {
    t.ok(err, 'should have error');
    t.equal(err.status, 403);
    t.equal(err.path, '/api/rel/path');
    // t.equal(err.method, 'GET');
    t.ok(/403/.test(err.text), 'text should contain "403"');
  }).finally(function() {
    t.end();
  });
});

test('should return error in callback for 500 response', function(t) {
  nock('http://localhost:80')
  .get('/api/rel/path')
  .reply(500, "<html>\r\n<head><title>500 Server Error</title></head>\r\n<body bgcolor=\"white\">\r\n<center><h1>500 Server Error</h1></center>\r\n<hr><center>nginx/1.4.5</center>\r\n</body>\r\n</html>\r\n",
    { server: 'nginx/1.4.5',
      date: 'Sun, 02 Mar 2014 20:03:06 GMT',
      'content-type': 'text/html',
      'content-length': '168',
      connection: 'close' });

   api.search({}).then(function(results) {
    t.notOk(results, 'should not have results');
  }).catch(function(err) {
    t.ok(err, 'should have error');
    t.equal(err.status, 500);
    t.equal(err.path, '/api/rel/path');
    t.ok(/500/.test(err.text), 'text should contain "500"');
  }).finally(function() {
    t.end();
  });
});

test('should return value when 200 json response', function(t) {
  nock('http://localhost:80')
  .get('/api/rel/path')
  .reply(200, '{"key":"value"}',
    { server: 'nginx/1.4.5',
      date: 'Sun, 02 Mar 2014 20:03:06 GMT',
      'content-type': 'application/json',
      'content-length': '15',
      connection: 'close' });

  api.search({}).then(function(results) {
    t.ok(results.key, 'should have expected key');
    t.equal(results.key, 'value', 'value should match');
  }).catch(function(err) {
    t.notOk(err, 'should not have error');
  }).finally(function() {
    t.end();
  });
});

test('should send complex queries as json', function(t) {
  nock('http://localhost:80')
  .get('/api/rel/path?key=value&options[param]=paramValue&list[0]=item1&list[1]=item2')
  .reply(200, '{"key":"value"}',
    { server: 'nginx/1.4.5',
      date: 'Sun, 02 Mar 2014 20:03:06 GMT',
      'content-type': 'application/json',
      'content-length': '15',
      connection: 'close' });

  api.search({
    key: 'value',
    options: {
      param: 'paramValue'
    },
    list: ['item1', 'item2']
  }).then(function(results) {
    t.ok(results, 'should have results');
  }).catch(function(err) {
    t.notOk(err, 'should not have error');
  }).finally(function() {
    t.end();
  });
});
