!!self.importScripts && self.importScripts(
  '/js/communicationChannel/PixelChannel.js',
  '/js/communicationChannel/AjaxChannel.js'
);

var RequestChannel = function () {
  return {
    init: function (config) {
      PixelChannel.init(config.url);
      AjaxChannel.init(config.url);
    },

    send: function (data) {
      // if (PixelChannel.isPixelCompatible(data)) {
      //   PixelChannel.send(data);
      // } else {
      //   AjaxChannel.send(data);
      // }

      console.log('Send from ajax');
      AjaxChannel.send(data);
    }
  };
}();