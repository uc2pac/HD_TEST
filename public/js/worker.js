self.importScripts(
  '/constants/eventTypes.js',
  '/constants/communicationChannelModes.js',
  '/worker/Utility.js',
  '/worker/LzString.js', 
  '/worker/config.js', 
  '/js/IndexedDBConnector.js'
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

    case 'GET_EVENTS': {
      self.getEvents();
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
  
  IndexedDBConnector.insert(data).then(function() {
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

// Get all events from store
self.getEvents = function getEvents() {
  IndexedDBConnector.getAll().then(function(result) {
    console.time('compressedData');
    var compressedData = self.compressData(result);
    console.timeEnd('compressedData');

    self.postMessage({
      topic: 'GET_EVENTS',
      payload: compressedData
    });
  });
}

self.handleError = function(error) {
  postMessage({ topic: 'ERROR', err: error || 'Unexpected error has happened' });
}


/************
 * Helpers
 ************/
self.createDataPacket = function(eventObject) {
  return Object.keys(eventObject).map(function createPacket(key) {
    return {
        // TODO: think how to pass session data to worker
        // userId: Session.getUserToken(),
        // sessionId: Session.getSessionToken(),
        pageviewId: key,
        events: eventObject[key]
    };
  });
}

self.compressData = function compressData(data) {
  var dataPacket = self.createDataPacket(data);
  var jsonString = JSON.stringify(dataPacket);
  var compressed = LZString.compressToBase64(jsonString);
  var encoded = encodeURIComponent(compressed);
  return encoded;
};