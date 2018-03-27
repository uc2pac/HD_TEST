var BeaconChannel = function() {
  var serverUrl = '';

  return {
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
}();
