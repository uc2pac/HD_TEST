var AjaxChannel = function () {
  var serverUrl;

  var AjaxChannel = {
    init: function (url) {
      serverUrl = url;
    },

    send: function (data, async) {
      var xmlHttp = new XMLRequest();
      xmlHttp.open("POST", serverUrl, async);
      xmlHttp.setRequestHeader();
      xmlHttp.send(data);
      xmlHttp.onreadystatechange(function ajxReadyStateChanged() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          console.log("REQUEST COMPLETE");
        }
      });
      return xmlHttp;
    }
  };
  return AjaxChannel;
}();

if (typeof define === "function" && define.amd) {
  define(function () {
    return AjaxChannel;
  });
} else if (typeof module !== "undefined" && module != null) {
  module.exports = AjaxChannel;
}