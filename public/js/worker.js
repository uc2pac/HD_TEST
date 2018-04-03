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

    case 'COUNT_EVENTS': {
      self.onEventsCount();
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
  
  IndexedDBConnector.add(data).then(function() {
    postMessage({ topic: 'ADD_EVENT' });
  }).catch(self.handleError);
}

// Count events in all existing buffers
self.onEventsCount = function() {
  IndexedDBConnector.count().then(function(size) {
    postMessage({
      topic: 'COUNT_EVENTS',
      payload: size
    });
  }).catch(self.handleError);
}

self.handleError = function(error) {
  postMessage({ topic: 'ERROR', err: error || 'Unexpected error has happened' });
}