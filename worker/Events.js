var Events = function events(CONFIG) {
  "use strict";
  var publicApi = {};
  var privateMethods = {};
  privateMethods.digitalDataExists = function digitalDataExists() {
      var digitalData = privateMethods.getDigitalData();
      return Boolean(digitalData && digitalData.page);
  };
  privateMethods.getDigitalData = function getDigitalData() {
      var localWindow = Client.getWindow();
      return localWindow.digitalData;
  };
  privateMethods.getBeaconReference = function getBeaconReference() {
      var result = null;
      var localWindow = Client.getWindow();
      for (var el in localWindow) {
          if (localWindow.hasOwnProperty(el) && el.match(/s_i_/)) {
              result = el;
              break;
          }
      }
      return result;
  };
  privateMethods.getBeaconSource = function getBeaconSource(reference) {
      var localWindow = Client.getWindow();
      return localWindow[reference].src;
  };
  privateMethods.decodeBeaconData = function decodeBeaconData(beaconSource) {
      var beaconQueryString = beaconSource.split("?")[1];
      var beaconQueryTokens = decodeURIComponent(beaconQueryString).split("&");
      var tokenCollection = beaconQueryTokens.reduce(function collectTokens(collection, token) {
          var tokenParts = token.split("=");
          collection[tokenParts[0]] = tokenParts[1] ? tokenParts[1] : "";
          return collection;
      }, {});
      return tokenCollection;
  };
  privateMethods.getBeaconData = function getBeaconData(reference) {
      var beaconSource = privateMethods.getBeaconSource(reference);
      return beaconSource ? privateMethods.decodeBeaconData(beaconSource) : null;
  };
  publicApi.type = {
      PAGE_LEAVE: "pageleave",
      PAGE_LOAD: "pageview",
      SCROLL_END: "scrollEnd",
      JAVASCRIPT_ERROR: "javascript_error_event",
      ORIENTATION_CHANGE: "orientation_event",
      MUTATION_GROUP: "mutation_group",
      GEOLOCATION: "geolocation_event",
      GEOLOCATION_ERROR: "geolocation_error_event",
      BEACON_LOADED: "beacon_data",
      DIGITA_DATA_LOADED: "digital_data",
      EVENT: "event",
      NODES: "nodes",
      PRODUCT_VIEWED: "view",
      IMPRESSION: "impression"
  };
  publicApi.getPrivateMethods = function getPrivateMethods() {
      return privateMethods;
  };
  publicApi.addEvent = function addEvent(event, elem, func) {
      if (elem.addEventListener) {
          elem.addEventListener(event, func, true);
      } else if (elem.attachEvent) {
          elem.attachEvent("on" + event, func);
      } else {
          elem[event] = func;
      }
  };
  publicApi.removeEvent = function removeEvent(event, elem, func) {
      if (elem.removeEventListener) {
          elem.removeEventListener(event, func);
      } else if (elem.removeEvent) {
          elem.removeEvent("on" + event, func);
      } else {
          elem[event] = null;
      }
  };
  publicApi.pageUnload = function(callback) {
      var localWindow = Client.getWindow();
      Events.addEvent("unload", localWindow, callback);
  };
  publicApi.pageLoaded = function(callback) {
      var localWindow = Client.getWindow();
      var loadTimeout;
      function methodHandler() {
          clearTimeout(loadTimeout);
          Events.removeEvent("load", localWindow, methodHandler);
          callback();
      }
      Events.addEvent("load", localWindow, methodHandler);
      loadTimeout = setTimeout(methodHandler, CONFIG.LOAD_TIMEOUT);
  };
  publicApi.beaconLoaded = function(callback) {
      var beaconInterval;
      var checks = 0;
      function beaconCheck() {
          var reference = privateMethods.getBeaconReference();
          var beaconData = reference ? privateMethods.getBeaconData(reference) : null;
          checks++;
          if (beaconData) {
              clearInterval(beaconInterval);
              callback(beaconData);
          } else if (checks >= CONFIG.MAX_EXISTANCE_CHECKS) {
              clearInterval(beaconInterval);
          }
      }
      beaconInterval = setInterval(beaconCheck, CONFIG.EXISTANCE_INTERVAL);
      beaconCheck();
  };
  publicApi.digitalDataLoaded = function digitalDataLoaded(callback) {
      var digitalDataInterval;
      var checks = 0;
      function digitalDataCheck() {
          checks++;
          if (privateMethods.digitalDataExists()) {
              clearInterval(digitalDataInterval);
              callback(privateMethods.getDigitalData());
          } else if (checks >= CONFIG.MAX_EXISTANCE_CHECKS) {
              clearInterval(digitalDataInterval);
          }
      }
      if (privateMethods.digitalDataExists()) {
          callback(privateMethods.getDigitalData());
      } else {
          digitalDataInterval = setInterval(digitalDataCheck, CONFIG.EXISTANCE_INTERVAL);
      }
  };
  publicApi.createEventObject = function createEventObject(eventType, data) {
      return {
          type: eventType,
          timeStamp: new Date().getTime(),
          data: data
      };
  };
  return publicApi;
}(CONFIG);