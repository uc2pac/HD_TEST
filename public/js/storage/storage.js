self.importScripts(
  './storage/localStorage.js',
  './storage/indexedDB.js'
);

self.Storage = {
  init: function init(config) {
    // Define storage to use
    this.defineStorage(config.storageInterface);

    // Initialize chosen storage
    this.storage.init(config);
  },

  defineStorage(storageInterface) {
    this.storage = storageInterface === 'indexedDB' ? self.IndexedDB : self.LocalStorage;
  },

  push: function push(event) {
    this.storage.push(event);
  }
}