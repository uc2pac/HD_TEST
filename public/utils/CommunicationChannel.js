var CommunicationChannel = function() {
  var METHODS = {
    BEACON: 'BEACON',
    SOCKET: 'SOCKET',
    REQUEST: 'REQUEST',
    // inner types
    AJAX: 'AJAX',
    PIXEL: 'PIXEL',
  };

  var serverUrl,
      method,
      dataCapture;

  var CommunicationChannel = {
    init : function (config) {
      serverUrl = config.serverUrl;
      method = config.method;
      dataCapture = config.dataCapture;

      BeaconChannel.init(serverUrl + dataCapture);
      SocketChannel.init(serverUrl);
      PixelChannel.init(serverUrl + dataCapture);
      AjaxChannel.init(serverUrl + dataCapture);
    },

    send: function (data, async) {
      var sendMethod = method;

      switch(sendMethod) {
        case METHODS.REQUEST: {
          sendMethod = PixelChannel.isPixelCompatible(data) ? METHODS.PIXEL : METHODS.AJAX;
          this.sendData(sendMethod, data);
          break;
        }
        case METHODS.BEACON:
          sendMethod = BeaconChannel.isSupported() ? METHODS.BEACON : METHODS.AJAX;
          this.sendData(sendMethod,data, async);
          break;
        default:
          this.sendData(sendMethod, async);
          break;
      }
    },

    sendData(sendMethod, data, async) {
      //ToDo set default parameter in arguments and remove this line -->
      async = typeof(async) === 'boolean' ? async : true;

      switch (sendMethod) {
        case METHODS.AJAX:
          console.log('ajax sent');
          AjaxChannel.send(data, async);
          break;
        case METHODS.SOCKET:
          console.log('socket sent');
          SocketChannel.send(data);
          break;
        case METHODS.PIXEL:
          console.log('pixel sent');
          PixelChannel.send(data);
          break;
        case METHODS.BEACON:
          console.log('beacon sent');
          BeaconChannel.send(data);
          break;
      }
    }
  };
  return CommunicationChannel;
}();

if (typeof define === "function" && define.amd) {
  define(function() {
    return CommunicationChannel;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = CommunicationChannel;
}