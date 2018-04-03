var WorkerConnector = function WorkerConnector() {
  "use strict";

  var publicApi = {};
  var privateMethods = {};
  var worker;
  var resolves = {};
  var rejects = {};
  
  publicApi.connect = function connect() {
      worker = new Worker('/js/worker.js');
      worker.onmessage = privateMethods.handleMessage;

      return privateMethods.push('connectWorker');
  };

  publicApi.addEvent = function addEvent(guid, event) {
    return privateMethods.push('ADD_EVENT', {
      pageViewId: guid,
      event: event
    });
  };

  publicApi.count = function count() {
    return privateMethods.push('COUNT_DB');
  };

  privateMethods.handleMessage = function handleMessage(msg) {
    const {topic, err, payload} = msg.data;

    if (err) {
      const reject = rejects[topic];
      reject && reject(err);
    } else {
      const resolve = resolves[topic];
      resolve && resolve(payload);
    }
    
    // purge used callbacks
    delete resolves[topic];
    delete rejects[topic];
  };

  privateMethods.push = function push(topic, data) {
    return new Promise(function(resolve, reject) {
      resolves[topic] = resolve;
      rejects[topic] = reject;

      worker.postMessage([topic, data]);
    });
  };

  return publicApi;
}();