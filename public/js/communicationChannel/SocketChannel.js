!!self.importScripts && self.importScripts(
  '/js/socket.io.js'
);

var SocketChannel = function() {
  var socket = null;

  var SOCKET_CONSTANTS = {
    SEND_DATA: 'send_socket_data'
  };

  return {
    init : function (config) {
      socket = io(config.url);
    },
    send: function (data) {
      console.log('Send from socket');
      socket.emit(SOCKET_CONSTANTS.SEND_DATA, data);
    }
  };
}();