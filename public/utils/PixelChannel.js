var PixelChannel = function() {
  var PIXEL_CONFIG = {
    MAX_PIXEL_SIZE: 2e3,
    PIXEL_PATH: "/pixel.gif?x=",
  },
    serverUrl;

  var PixelChannel = {
    init: function (url) {
      serverUrl = url;
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
  return PixelChannel;
}();

if (typeof define === "function" && define.amd) {
  define(function() {
    return PixelChannel;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = PixelChannel;
}