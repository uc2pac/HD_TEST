var BeaconChannel = function() {
  var serverUrl = '';

  return {
    init: function (config) {
      serverUrl = config.url + config.dataCaptureUrl;
    },

    isSupported: function () {
      return "sendBeacon" in navigator;
    },

    send: function (data) {
      console.log('send from beacon');

      //ToDo if false create a workaround
      //ToDo needs to be tested
      var beaconSuccess = navigator.sendBeacon(serverUrl, data);
      console.log('beacon success ' + beaconSuccess);
    }
  };
}();
