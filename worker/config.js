var StorageConfig = {
  storageInterface: 'indexedDB',
  indexedDBName: 'testIndexedDB',
  indexedDBStoreName: 'testIndexedDBStore'
};

var CommunicationChannel = {
  dataCaptureUrl: '/analytics',
  channelMode: CHANNEL_MODES.REQUEST
};

var CONFIG = {
  EVENT_BUFFER_KEY: "THD_POST_BUFFER",
  LOCAL_NODE: true,
  MAX_STORAGE_COUNT: 25,
  NODES_TO_IGNORE: [ "#comment", "SCRIPT", "#text" ],
  LOAD_TIMEOUT: 3e3,
  UNLOAD_TIMEOUT: 1e4,
  MUTATION_THRESHOLD: 10,
  DEBOUNCE_WINDOW: 50,
  EXISTANCE_INTERVAL: 100,
  MAX_EXISTANCE_CHECKS: 50,
  BATCH_BY_DEFAULT: false,
  MAX_PIXEL_SIZE: 2e3,
  BUFFER_TIMEOUT: 500,
  PIXEL_PATH: "/pixel.gif?x=",
  EXCLUDED_KEYS: [ "AT_TARGET", "BUBBLING_PHASE", "CAPTURING_PHASE", "view", "path", "DOM_DELTA_LINE", "DOM_DELTA_PAGE", "DOM_KEY_LOCATION_LEFT", "DOM_KEY_LOCATION_NUMPAD", "DOM_KEY_LOCATION_RIGHT", "DOM_KEY_LOCATION_STANDARD", "returnValue", "x", "y", "webkitMovementX", "webkitMovementY", "sourceDevice", "fromElement", "dataTransfer", "returnValue", "path", "altKey", "bubbles", "button", "buttons", "cancelable", "currentTarget", "sourceCapabilities", "isTrusted", "keyLocation", "relatedTarget", "toElement", "srcElement" ],
  VIEWED_TIMEOUT: 1e3,
  // Storage
  STORAGE: StorageConfig,
  // CommunicationChannel
  COMMUNICATION_CHANNEL: CommunicationChannel
};