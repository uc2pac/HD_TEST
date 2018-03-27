var SocketChannel = function() {
  var socket = null;

  var SOCKET_CONSTANTS = {
    SEND_DATA: 'send_socket_data'
  };

  return {
    init : function (serverUrl) {
      socket = io(serverUrl);
    },
    send: function (data) {
      socket.emit(SOCKET_CONSTANTS.SEND_DATA, data);
    }
  };
}();