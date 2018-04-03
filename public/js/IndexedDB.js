var IndexedDBConnector = (function IndexedDBConnector() {
  var DB;

  var IndexedDB = {
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
      var transaction =  DB.transaction([this.config.indexedDBStoreName], "readwrite");

      transaction.onerror = function(error) {
        console.log(error);
      };

      transaction.onabort = function(error) {
        console.log(error);
      };

      return transaction;
    },

    getStore: function getStore() {
      var transaction = this.initiateTransaction();
      return transaction.objectStore(this.config.indexedDBStoreName);
    },

    add: function add(data) {
      var store = this.getStore();

      var guid = data.pageViewId;
      var event = data.event;

      return new Promise(function(resolve, reject) {
        var openCursorRequest = store.openCursor(guid);
      
        openCursorRequest.onsuccess = function(e) {
          var cursor = this.result;
          var request, compressedData;

          if (cursor) {
            var events = IndexedDB.uncompressData(cursor.value);
            events.push(event);
            events = IndexedDB.compressData(events);

            request = cursor.update(events);
          } else {
            compressData = IndexedDB.compressData([event]);
            request = store.add(compressData, guid);
          }

          request.onsuccess = resolve;
          request.onerror = reject;
        };

        openCursorRequest.onerror = function(e) {
          console.log(e);
        };
      });
    },

    count: function() {
      var store = this.getStore();
      return store.count();
    },
    
    getAll: function getAll() {
      return new Promise(IndexedDB._getOneByOne);
    },

    _getAll(resolve, reject) {
      var store = IndexedDB.getStore();
      var getAllRequest = store.getAll();

      getAllRequest.onsuccess = function() {
        var buffers = this.result.map(function(buffer) {
          return IndexedDB.uncompressData(buffer);
        });

        resolve(buffers);
      };

      getAllRequest.onerror = function() {
        reject();
      };
    },

    _getOneByOne: function(resolve, reject) {
      var store = IndexedDB.getStore();
      var result = {};

      store.openCursor().onsuccess = function (event) {
        var cursor, e, target;

        cursor = event.target.result;

        if (cursor) {
            result[cursor.key] = cursor.value;
            cursor.continue();
        } else {
            resolve(result);
            // if (typeof request.onsuccess === "function") {
            //     e = new Event("success");
            //     e.target = {
            //         readyState: "done",
            //         result: result
            //     };
            //     request.onsuccess(e);
            // }
        }
      };
    },

    compressData: function compressData(data) {
      var jsonString = JSON.stringify(data);
      var compressed = LZString.compressToBase64(jsonString);
      var encoded = encodeURIComponent(compressed);
      return encoded;
    },

    uncompressData: function uncompressData(encoded) {
      var decoded = decodeURIComponent(encoded);
      var uncompressed = LZString.decompressFromBase64(decoded);

      try { 
        return JSON.parse(uncompressed);
      } catch(err) {
        return {};
      }
    }
  }

  return IndexedDB;
})();