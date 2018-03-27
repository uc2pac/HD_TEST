var WorkerConnector = function WorkerConnector() {
  "use strict";

  var publicApi = {};
  var privateMethods = {};
  var worker;

  privateMethods.initializeWorkerHandlers = function initializeWorkerHandlers() {
      // worker.listen(function(data) {
      //     var pageViewId = Session.getPageViewId();
      
      //     EventBuffer.push(pageViewId, data);
      // });
  };
  
  publicApi.init = function init() {
      worker = new Worker('/js/worker.js');

      publicApi.push('initWorker', {
          userToken: Session.getUserToken(), 
          sessionToken: Session.getSessionToken(),
          globals: Client.getGlobals()
      });
  };

  publicApi.push = function push(topic, data) {
      worker.postMessage([topic, data]);
  };

  publicApi.listen = function listen(callback) {
      worker.onmessage = function(e) {
          callback(e.data);
      };
  };

  return publicApi;
}();