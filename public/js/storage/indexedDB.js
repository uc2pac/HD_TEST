IndexedDB = {
  init: function init(config) {
    this.config = config;

    var dbInstance = indexedDB.open(this.config.indexedDBName, 1);

    var onupgradeneeded = function onupgradeneeded() {
      var db = dbInstance.result;
      var store = db.createObjectStore(this.config.indexedDBStoreName, { keyPath: 'timeStamp'});
    };

     // Create the schema
    dbInstance.onupgradeneeded = onupgradeneeded.bind(this);

    
    dbInstance.onsuccess = function onsuccess() {
      IndexedDB.db = dbInstance.result;
    }
  },

  push: function push(event) {
    var transaction = this.db.transaction([this.config.indexedDBStoreName], "readwrite");
    var store = transaction.objectStore(this.config.indexedDBStoreName);

    var request = store.add(event);

    request.onerror = function(e) {
      console.log("Error", e.target.error.name);
      //some type of error handler
    }

    request.onsuccess = function(e) {
      var countRequest = store.count();

      countRequest.onsuccess = function() {
        if (countRequest.result > 24) {

          var getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = function(e) {
            CommunicationChannel.send(EVENT_TYPES.EVENT, e.target.result);

            store.clear();
          };
        }
      }
    }
  }
}