var SocketChannel = function() {
  var socket = null;

  var SOCKET_CONSTANTS = {
    SEND_DATA: 'send_socket_data'
  };

  var SocketChannel = {
    init : function (serverUrl) {
      socket = io(serverUrl);
    },
    send: function (data) {
      socket.emit(SOCKET_CONSTANTS.SEND_DATA, data);
    }
  };
  return SocketChannel;
}();

if (typeof define === "function" && define.amd) {
  define(function() {
    return SocketChannel;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = SocketChannel;
}