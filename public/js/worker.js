self.importScripts(
  '/constants/eventTypes.js',
  '/constants/communicationChannelModes.js',
  '/worker/Utility.js',
  '/worker/LzString.js', 
  '/worker/config.js', 
  '/js/IndexedDB.js'
);

onmessage = function(e) {
  var topic = e.data[0];
  var data = e.data[1];

  switch (topic) {
    case 'connectWorker': {
      self.onConnect();
      break;
    }

    case 'ADD_EVENT': {
      self.onEventAdd(data);
      break;
    }

    case 'COUNT_DB': {
      self.onBufferCount();
    }
  }
}

// On IndexedDB connect
self.onConnect = function() {
  var isConnected = IndexedDBConnector.init(CONFIG.STORAGE);

  isConnected.then(function() {
    postMessage({ topic: 'connectWorker' });
  });
}

// On add or update event
self.onEventAdd = function(data) {
  data.event.data.html = Utility.compress(data.event.data.html);
  
  IndexedDBConnector.add(data)
    .then(function() {
      postMessage({ topic: 'ADD_EVENT' });
    }).catch(function(error) {
      postMessage({ topic: 'ERROR', err: error });
    });
}

self.onBufferCount = function() {
  var countRequest = IndexedDBConnector.count();

  countRequest.onsuccess = function() {
    postMessage({
      topic: 'COUNT_DB',
      payload: this.result
    });
  };
}