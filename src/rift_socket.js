var Promise       = require('bluebird'),
      qs                 = require('qs'),
      _                   = require('lodash'),
      util               = require('util'),
      RiftError      = require('./rift_error'),
      client           = require('socket.io-client'),
      HOSTNAME = 'http://localhost:8100',
      TIMEOUT     = '';

module.exports = function use(request, defer) {
  if (!request || !request.endpoint || request.endpoint.client !== 'socket') {
      return;
  }

  if (request.error || request.data) {
    return;
  }

  var topic   = request.endpoint.topic,
        socket = client.connect(HOSTNAME);

    return new Promise(function (resolve){
      socket.emit(topic);
      socket.on('on' + topic.charAt(0).toUpperCase() + topic.slice(1), function (data) {
          request.data = data;
          resolve();
      });
    });
};