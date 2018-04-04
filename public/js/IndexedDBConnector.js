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

    openCursor: function openCursor(key) {
      var store = this.getStore();

      return new Promise(function(resolve, reject) {
        var openCursorRequest = store.openCursor(key);

        openCursorRequest.onsuccess = function(e) {
          resolve({
            cursor: e.target.result,
            store
          });
        };

        openCursorRequest.onerror = reject;
      });
    },

    insert: function insert(data) {
      var guid = data.pageViewId;
      var event = data.event;

      return this.openCursor(guid).then(({cursor, store}) => {
        if (cursor) {
          var events = cursor.value;
          events.push(event);
          return this.update(cursor, events);
        }
        
        return this.add([event], guid, store);
      }).catch(function(error) {
        console.log(error);
      });
    },

    add: function add(data, key, store) {
      var store = store || this.getStore();

      return new Promise(function(resolve, reject) {
        var request = store.add(data, key);

        request.onsuccess = resolve;
        request.onerror = reject;
      });
    },  

    update: function update(cursor, data) {
      return new Promise(function(resolve, reject) {
        var request = cursor.update(data);

        request.onsuccess = resolve;
        request.onerror = reject;
      });
    },

    count: function() {
      return this.getAll().then(function(records) {
        return new Promise(function(resolve) {
          var size = Object.values(records).reduce((prev, next) => prev + next.length, 0);
          resolve(size);
        });
      });
    },
    
    getAll: function getAll() {
      return new Promise(IndexedDB._getOneByOne);
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

    // compressData: function compressData(data) {
    //   var jsonString = JSON.stringify(data);
    //   var compressed = LZString.compressToBase64(jsonString);
    //   var encoded = encodeURIComponent(compressed);
    //   return encoded;
    // },

    // uncompressData: function uncompressData(encoded) {
    //   var decoded = decodeURIComponent(encoded);
    //   var uncompressed = LZString.decompressFromBase64(decoded);

    //   try { 
    //     return JSON.parse(uncompressed);
    //   } catch(err) {
    //     return {};
    //   }
    // 
  }

  return IndexedDB;
})();