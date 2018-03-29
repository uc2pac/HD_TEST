var WorkerConnector = function WorkerConnector() {
  "use strict";

  var publicApi = {};
  var privateMethods = {};
  var worker;
  
  publicApi.connect = function connect() {
    console.time('start OnLoad');
      worker = new Worker('/js/worker.js');
      worker.postMessage(['connectWorker']);
      console.time('worker connection');
      return new Promise(function(resolve, reject) {
        publicApi.listen(function(data) {
          console.timeEnd('worker connection');
          if (data.topic === 'connectWorker') {
            resolve();
          }
        });
      });
      // publicApi.push('connectWorker', {
      //     userToken: Session.getUserToken(),
      //     sessionToken: Session.getSessionToken(),
      //     globals: Client.getGlobals()
      // });
  };

  publicApi.sendEvent = function sendEvent(guid, event) {
    publicApi.push('ADD_EVENT', {
      pageViewId: guid,
      event: event
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