var AjaxChannel = function () {
  var serverUrl;

  return {
    init: function (url) {
      serverUrl = url;
    },

    send: function (data) {
      var xmlHttp = new XMLRequest();
      xmlHttp.open("POST", serverUrl);
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
}();
