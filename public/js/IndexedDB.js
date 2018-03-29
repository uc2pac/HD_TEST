var IndexedDBConnector = (function IndexedDBConnector() {
  var DB;

  return {
    init: function init(config) {
      this.config = config;

      var dbInstance = indexedDB.open(this.config.indexedDBName, 1);

      var onupgradeneeded = function onupgradeneeded() {
        var db = dbInstance.result;
        var store = db.createObjectStore(this.config.indexedDBStoreName);
      };

      // Create the schema
      dbInstance.onupgradeneeded = onupgradeneeded.bind(this);

      return new Promise(function(resolve) {
        dbInstance.onsuccess = function onsuccess() {
          DB = dbInstance.result;
          resolve();
        }
      });
    },

    initiateTransaction: function initiateTransaction() {
      return DB.transaction([this.config.indexedDBStoreName], "readwrite");
    },

    getStore: function getStore() {
      var transaction = this.initiateTransaction();
      return transaction.objectStore(this.config.indexedDBStoreName);
    },

    add: function add(data) {
      var store = this.getStore();

      var guid = data.pageViewId;
      var event = data.event;

      var openCursorRequest = store.openCursor(guid);
      
      openCursorRequest.onsuccess = function(e) {
        var cursor = this.result;
        var request;

        if (cursor) {
          var events = cursor.value[guid];
          events.push(event);

          request = cursor.update({ [guid]: events });
        } else {
          request = store.add({ [guid]: [event] }, guid);
        }

        request.onsuccess = function(e) {
          console.log(this.result);
        };

        request.onerror = function(e) {
          console.log(e);
        }
      };
    },

    count: function() {
      var store = this.getStore();
      return store.count();
    },
    
    getAll: function getAll() {
      var store = this.getStore();
      return store.getAll();
    }
  }
})();