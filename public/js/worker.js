self.importScripts(
  '/constants/eventTypes.js',
  '/constants/communicationChannelModes.js',
  '/worker/Utility.js',
  '/worker/LzString.js', 
  '/worker/config.js', 
  '/worker/XMLRequest.js',
  '/worker/ServerAPI.js', 
  '/worker/Events.js',
  '/js/storage/storage.js',
  '/js/communicationChannel/CommunicationChannel.js'
);

onmessage = function(e) {
  var topic = e.data[0];
  var event = e.data[1];

  switch (topic) {
    case 'initWorker': {
      CONFIG.userToken = event.userToken;
      CONFIG.sessionToken = event.sessionToken;
      GLOBALS = event.globals;

      CommunicationChannel.init(CONFIG.COMMUNICATION_CHANNEL);
      Storage.init(CONFIG.STORAGE);

      break;
    }

    case EVENT_TYPES.PAGE_LOAD: {
      // compress html
      event.data.html = Utility.compress(event.data.html);
      CommunicationChannel.send(EVENT_TYPES.PAGE_LOAD, event);

      break;
    }

    case EVENT_TYPES.PAGE_LEAVE:
    case EVENT_TYPES.SCROLL:
    case EVENT_TYPES.EVENT: {
      event.data.html = Utility.compress(event.data.html);

      Storage.push(event);
      break;
    }
  }
}