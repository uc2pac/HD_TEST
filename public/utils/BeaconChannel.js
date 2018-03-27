var BeaconChannel = function() {
  var serverUrl = '';

  var BeaconChannel = {
    init: function (url) {
      serverUrl = url;
    },

    isSupported: function () {
      return "sendBeacon" in navigator;
    },

    send: function (data) {
      navigator.sendBeacon(serverUrl, data);
    }
  };
  return BeaconChannel;
}();

if (typeof define === "function" && define.amd) {
  define(function() {
    return BeaconChannel;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = BeaconChannel;
}