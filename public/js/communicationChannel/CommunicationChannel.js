!!self.importScripts && self.importScripts(
  '/js/communicationChannel/BeaconChannel.js',
  '/js/communicationChannel/SocketChannel.js',
  '/js/communicationChannel/RequestChannel.js',
);

var CommunicationChannel = function() {
  var Channels = {
    BEACON:  BeaconChannel,
    SOCKET:  SocketChannel,
    REQUEST: RequestChannel
  };

  var SOCKET_SERVER_REGIONS = {
    LOCAL: 'http://localhost:8080',
    // place your ip address for mobile testing
    MOBILE: 'http://169.254.85.37:8080',
    EU: 'https://salty-ravine-68540.herokuapp.com',
    US: 'https://guarded-mountain-38209.herokuapp.com'
  };
    
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  var serverUrl = isMobile ? SOCKET_SERVER_REGIONS.MOBILE : SOCKET_SERVER_REGIONS.LOCAL;

  return {
    init : function (config) {
      this.channel = Channels[config.channelMode];
      
      if (config.channelMode === CHANNEL_MODES.BEACON && !Channels[config.channelMode].isSupported()) {
        this.channel = Channels[CHANNEL_MODES.REQUEST];
      }

      if (config.channelMode === CHANNEL_MODES.BEACON && !Channels[config.channelMode].isSupported()) {
        this.channel = Channels[CHANNEL_MODES.REQUEST];
      }
      this.channel.init({
        url: serverUrl,
        dataCaptureUrl: config.dataCaptureUrl
      });

    },

    send: function (data) {
      this.channel.send(data);
    }
  };
}();