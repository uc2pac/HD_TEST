var ServerApi = function serverApiInit(CONFIG, LZString) {
  "use strict";
  var publicApi = {};
  var privateMethods = {};
  privateMethods.getServerUrl = function getServerUrl() {
      return GLOBALS.endpoint.dataCapture;
  };
  privateMethods.createDataPacket = function createDataPacket(eventObject) {
      return Object.keys(eventObject).map(function createPacket(pageviewId) {
          return {
              userId: CONFIG.userToken,
              sessionId: CONFIG.sessionToken,
              pageviewId: pageviewId,
              events: eventObject[pageviewId]
          };
      });
  };
  privateMethods.compressData = function compressData(data) {
      var jsonString = JSON.stringify(data);
      var compressed = LZString.compressToBase64(jsonString);
      var encoded = encodeURIComponent(compressed);
      return encoded;
  };
  privateMethods.ajaxPost = function ajaxPost(url, data) {
      var xmlHttp = new XMLRequest();
      xmlHttp.open("POST", url, true);
      xmlHttp.setRequestHeader();
      xmlHttp.send(data);
      xmlHttp.onreadystatechange(function ajxReadyStateChanged() {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
              console.log("REQUEST COMPLETE");
          }
      });
      return xmlHttp;
  };
  privateMethods.sendPost = function sendPost(compressedData) {
      var url = privateMethods.getServerUrl();
      privateMethods.ajaxPost(url, compressedData);
  };
  publicApi.buildDataString = function buildDataString(eventObject) {
      var dataLoad = privateMethods.createDataPacket(eventObject);
      var compressedData = privateMethods.compressData(dataLoad);
      return compressedData;
  };
  publicApi.getPrivateMethods = function getPrivateMethods() {
    return privateMethods;
  };
  publicApi.send = function send(eventType, data) {
    var eventObject = Events.createEventObject(eventType, data);
    var compressedData = privateMethods.buildDataString(eventObject);

    privateMethods.sendPost(compressedData);
  };
  return publicApi;
}(CONFIG, LZString);