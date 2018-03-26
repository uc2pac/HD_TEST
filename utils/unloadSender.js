const SAVE_LOCAL_STORAGE_KEY = 'ddo-unsaved-events';

module.exports = function() {

  const unLoadSender = {
    sendBeacon: (url, data) => {
      if("sendBeacon" in navigator) {
        navigator.sendBeacon(url, data);
      } else {
        localStorage.setItem(SAVE_LOCAL_STORAGE_KEY, data);
      }
    },

    onLoadGetData: () => {
      return (localStorage.getItem(SAVE_LOCAL_STORAGE_KEY, data) || null);
    }
  };
  return unLoadSender;
}();

