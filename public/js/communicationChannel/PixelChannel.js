var PixelChannel = function() {
  var PIXEL_CONFIG = {
    MAX_PIXEL_SIZE: 2e3,
    PIXEL_PATH: "/pixel.gif?x=",
  },
    serverUrl;

  return {
    init: function (config) {
      serverUrl = config.url;
    },

    createPixelUrl : function createPixelUrl(compressedData) {
      return serverUrl + PIXEL_CONFIG.PIXEL_PATH + compressedData;
    },

    isPixelCompatible: function isPixelCompatible(dataString) {
      return this.createPixelUrl(dataString).length < PIXEL_CONFIG.MAX_PIXEL_SIZE;
    },

    send: function (data) {
        var pixelRequest = new Image();
        pixelRequest.src = this.createPixelUrl(data);
    }
  };
}();
