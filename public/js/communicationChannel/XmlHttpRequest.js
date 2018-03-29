function XMLRequest() {
  this.ie = !-[ 1 ];
  this.NativeXMLRequest = this.ie ? new XDomainRequest() : new XMLHttpRequest();
  try {
    this.NativeXMLRequest.status;
  } catch (e) {
    if (typeof XDomainRequest === "function") {
      this.ie = true;
      this.NativeXMLRequest = new XDomainRequest();
    }
  }
  this.readyState = this.NativeXMLRequest.readyState;
  this.status = null;
  this.responseText = null;
}

XMLRequest.prototype.abort = function abort() {
  this.NativeXMLRequest.abort();
};

XMLRequest.prototype.open = function open(type, url, async) {
  this.NativeXMLRequest.open(type, url, async);
};

XMLRequest.prototype.addEventListener = function addEventListener(name, fn) {
  var result;
  if (this.NativeXMLRequest.addEventListener) {
    result = this.NativeXMLRequest.addEventListener(name, fn);
  }
  return result;
};

XMLRequest.prototype.setRequestHeader = function setRequestHeader() {
  if (!this.ie) {
    this.NativeXMLRequest.setRequestHeader("Content-type", "text/plain");
  } else {
    this.NativeXMLRequest.contentType = "text/plain";
  }
  this.NativeXMLRequest.withCredentials = true;
};

XMLRequest.prototype.send = function send(data) {
  try {
    this.NativeXMLRequest.send(data);
  } catch (e) {
    console.log(e);
  }
};

XMLRequest.prototype.onreadystatechange = function onreadystatechange(fn) {
  if (this.ie) {
    this.NativeXMLRequest.onerror = function onerror() {
      this.readyState = 2;
      this.status = 500;
    };
    this.NativeXMLRequest.onload = function onload() {
      this.readyState = 2;
      this.status = 200;
      this.reponseText = this.NativeXMLRequest.responseText;
    };
    this.NativeXMLRequest.ontimeout = function ontimeout() {
      this.readyState = 3;
      this.status = 500;
    };
  } else {
    var props = this.NativeXMLRequest;
    var self = this;
    this.NativeXMLRequest.onreadystatechange = function onReadyStateChange() {
      for (var key in props) {
        if (props.hasOwnProperty(key)) {
          self[key] = props[key];
        }
      }
      fn.apply(this, [].slice.apply(arguments));
    };
  }
};
