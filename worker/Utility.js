var Utility = function utility(window) {
  "use strict";
  var publicApi = {};
  var privateMethods = {};
  privateMethods.includedNodes = function includedNodes(nodes) {
      return Utility.cloneArray(nodes).filter(function notIgnored(node) {
          return CONFIG.NODES_TO_IGNORE.indexOf(node.nodeName) === -1;
      });
  };
  privateMethods.getParent = function getParent(node) {
      return node.parentElement || node.parentNode;
  };
  privateMethods.getIndex = function getIndex(node) {
      var parent = privateMethods.getParent(node);
      if (!parent) {
          return -1;
      }
      return privateMethods.includedNodes(parent.childNodes).indexOf(node);
  };
  publicApi.getPrivateMethods = function getPrivateMethods() {
      return privateMethods;
  };
  publicApi.debounce = function debounce(fn, debounceDuration) {
      var localDebounceDuration = debounceDuration || 100;
      return function debounceCallback() {
          if (!fn.debouncing) {
              var args = Array.prototype.slice.apply(arguments);
              fn.lastReturnVal = fn.apply(window, args);
              fn.debouncing = true;
          }
          clearTimeout(fn.debounceTimeout);
          fn.debounceTimeout = setTimeout(function debounceCallbackTimeout() {
              fn.debouncing = false;
          }, localDebounceDuration);
          return fn.lastReturnVal;
      };
  };
  publicApi.isJsonString = function isJsonString(string) {
      try {
          JSON.parse(string);
      } catch (e) {
          return false;
      }
      return true;
  };
  publicApi.stripLines = function stripLines(str) {
      return str.replace(/(\r\n|\n|\r|\s+)/gm, "");
  };
  publicApi.isAllUpperCase = function isAllUpperCase(v) {
      return /^[A-Z]+$/.test(v);
  };
  publicApi.extend = function extend() {
      for (var i = 1; i < arguments.length; i++) {
          for (var key in arguments[i]) {
              if (arguments[i].hasOwnProperty(key)) {
                  arguments[0][key] = arguments[i][key];
              }
          }
      }
      return arguments[0];
  };
  publicApi.removeLines = function removeLines(str) {
      return str.replace(/\r\n|\n|\r|\\n/gm, "");
  };
  publicApi.removeComments = function removeComments(str) {
      return str.replace(/<!--(.*?)-->/gm, "");
  };
  publicApi.removeScript = function removeScript(str) {
      return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  };
  publicApi.removeSpace = function removeSpace(str) {
      return str.replace(/(\s{2,}|\t+)/gm, " ");
  };
  publicApi.compress = function compress(str) {
      var localStr = str;
      localStr = publicApi.removeComments(localStr);
      localStr = publicApi.removeScript(localStr);
      localStr = publicApi.removeLines(localStr);
      localStr = publicApi.removeSpace(localStr);
      return localStr;
  };
  publicApi.guid = function guid() {
      function s4() {
          return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
      }
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  };
  publicApi.findParentByTagName = function findParentByTagName(element, tagName) {
      var parent = element;
      while (parent !== null && parent.tagName && parent.tagName !== tagName.toUpperCase()) {
          parent = parent.parentNode;
      }
      return parent;
  };
  publicApi.slice = [].slice;
  publicApi.cloneArray = function cloneArray(array) {
      return [].slice.call(array || []);
  };
  publicApi.isEmptyObject = function isEmptyObject(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
  };
  publicApi.getPath = function getPath(node, useObject) {
      var parent = privateMethods.getParent(node);
      var index = privateMethods.getIndex(node);
      var path = [];
      if (index > -1) {
          path = path.concat(publicApi.getPath(parent, useObject));
          path.push(useObject ? parent : index);
      }
      return path;
  };
  publicApi.getPerformanceData = function getPerformanceData() {
      var result = {};
      if (typeof performance !== "undefined") {
          if (performance.timing) {
              result.timing = performance.timing.toJSON();
          }
          if (performance.memory) {
              result.memory = {};
              result.memory.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
              result.memory.totalJSHeapSize = performance.memory.totalJSHeapSize;
              result.memory.usedJSHeapSize = performance.memory.usedJSHeapSize;
          }
      }
      return result;
  };
  return publicApi;
}();