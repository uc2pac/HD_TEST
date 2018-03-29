self.importScripts(
  // '/constants/eventTypes.js',
  // '/constants/communicationChannelModes.js',
  // '/worker/Utility.js',
  // '/worker/LzString.js', 
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
  }
}

// On IndexedDB connect
self.onConnect = function() {
  var isConnected = IndexedDBConnector.init(CONFIG.STORAGE);

  console.time('indexedDB init');
  isConnected.then(function() {
    console.timeEnd('indexedDB init');
    postMessage({
      topic: 'connectWorker'
    });
  });
}

// On add or update event
self.onEventAdd = function(data) {
  // data.event.data.html = Utility.compress(data.event.data.html);
  // IndexedDBConnector.add(data);
}