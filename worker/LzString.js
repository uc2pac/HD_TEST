var LZString = function() {
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  var baseReverseDic = {};
  function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};
          for (var i = 0; i < alphabet.length; i++) {
              baseReverseDic[alphabet][alphabet.charAt(i)] = i;
          }
      }
      return baseReverseDic[alphabet][character];
  }
  var LZString = {
      compressToBase64: function(input) {
          if (input == null) return "";
          var res = LZString._compress(input, 6, function(a) {
              return keyStrBase64.charAt(a);
          });
          switch (res.length % 4) {
            default:
            case 0:
              return res;

            case 1:
              return res + "===";

            case 2:
              return res + "==";

            case 3:
              return res + "=";
          }
      },
      compressToUTF16: function(input) {
          if (input == null) return "";
          return LZString._compress(input, 15, function(a) {
              return f(a + 32);
          }) + " ";
      },
      compressToUint8Array: function(uncompressed) {
          var compressed = LZString.compress(uncompressed);
          var buf = new Uint8Array(compressed.length * 2);
          for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
              var current_value = compressed.charCodeAt(i);
              buf[i * 2] = current_value >>> 8;
              buf[i * 2 + 1] = current_value % 256;
          }
          return buf;
      },
      compressToEncodedURIComponent: function(input) {
          if (input == null) return "";
          return LZString._compress(input, 6, function(a) {
              return keyStrUriSafe.charAt(a);
          });
      },
      compress: function(uncompressed) {
          return LZString._compress(uncompressed, 16, function(a) {
              return f(a);
          });
      },
      _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
          if (uncompressed == null) return "";
          var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
          for (ii = 0; ii < uncompressed.length; ii += 1) {
              context_c = uncompressed.charAt(ii);
              if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                  context_dictionary[context_c] = context_dictSize++;
                  context_dictionaryToCreate[context_c] = true;
              }
              context_wc = context_w + context_c;
              if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                  context_w = context_wc;
              } else {
                  if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                      if (context_w.charCodeAt(0) < 256) {
                          for (i = 0; i < context_numBits; i++) {
                              context_data_val = context_data_val << 1;
                              if (context_data_position == bitsPerChar - 1) {
                                  context_data_position = 0;
                                  context_data.push(getCharFromInt(context_data_val));
                                  context_data_val = 0;
                              } else {
                                  context_data_position++;
                              }
                          }
                          value = context_w.charCodeAt(0);
                          for (i = 0; i < 8; i++) {
                              context_data_val = context_data_val << 1 | value & 1;
                              if (context_data_position == bitsPerChar - 1) {
                                  context_data_position = 0;
                                  context_data.push(getCharFromInt(context_data_val));
                                  context_data_val = 0;
                              } else {
                                  context_data_position++;
                              }
                              value = value >> 1;
                          }
                      } else {
                          value = 1;
                          for (i = 0; i < context_numBits; i++) {
                              context_data_val = context_data_val << 1 | value;
                              if (context_data_position == bitsPerChar - 1) {
                                  context_data_position = 0;
                                  context_data.push(getCharFromInt(context_data_val));
                                  context_data_val = 0;
                              } else {
                                  context_data_position++;
                              }
                              value = 0;
                          }
                          value = context_w.charCodeAt(0);
                          for (i = 0; i < 16; i++) {
                              context_data_val = context_data_val << 1 | value & 1;
                              if (context_data_position == bitsPerChar - 1) {
                                  context_data_position = 0;
                                  context_data.push(getCharFromInt(context_data_val));
                                  context_data_val = 0;
                              } else {
                                  context_data_position++;
                              }
                              value = value >> 1;
                          }
                      }
                      context_enlargeIn--;
                      if (context_enlargeIn == 0) {
                          context_enlargeIn = Math.pow(2, context_numBits);
                          context_numBits++;
                      }
                      delete context_dictionaryToCreate[context_w];
                  } else {
                      value = context_dictionary[context_w];
                      for (i = 0; i < context_numBits; i++) {
                          context_data_val = context_data_val << 1 | value & 1;
                          if (context_data_position == bitsPerChar - 1) {
                              context_data_position = 0;
                              context_data.push(getCharFromInt(context_data_val));
                              context_data_val = 0;
                          } else {
                              context_data_position++;
                          }
                          value = value >> 1;
                      }
                  }
                  context_enlargeIn--;
                  if (context_enlargeIn == 0) {
                      context_enlargeIn = Math.pow(2, context_numBits);
                      context_numBits++;
                  }
                  context_dictionary[context_wc] = context_dictSize++;
                  context_w = String(context_c);
              }
          }
          if (context_w !== "") {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                  if (context_w.charCodeAt(0) < 256) {
                      for (i = 0; i < context_numBits; i++) {
                          context_data_val = context_data_val << 1;
                          if (context_data_position == bitsPerChar - 1) {
                              context_data_position = 0;
                              context_data.push(getCharFromInt(context_data_val));
                              context_data_val = 0;
                          } else {
                              context_data_position++;
                          }
                      }
                      value = context_w.charCodeAt(0);
                      for (i = 0; i < 8; i++) {
                          context_data_val = context_data_val << 1 | value & 1;
                          if (context_data_position == bitsPerChar - 1) {
                              context_data_position = 0;
                              context_data.push(getCharFromInt(context_data_val));
                              context_data_val = 0;
                          } else {
                              context_data_position++;
                          }
                          value = value >> 1;
                      }
                  } else {
                      value = 1;
                      for (i = 0; i < context_numBits; i++) {
                          context_data_val = context_data_val << 1 | value;
                          if (context_data_position == bitsPerChar - 1) {
                              context_data_position = 0;
                              context_data.push(getCharFromInt(context_data_val));
                              context_data_val = 0;
                          } else {
                              context_data_position++;
                          }
                          value = 0;
                      }
                      value = context_w.charCodeAt(0);
                      for (i = 0; i < 16; i++) {
                          context_data_val = context_data_val << 1 | value & 1;
                          if (context_data_position == bitsPerChar - 1) {
                              context_data_position = 0;
                              context_data.push(getCharFromInt(context_data_val));
                              context_data_val = 0;
                          } else {
                              context_data_position++;
                          }
                          value = value >> 1;
                      }
                  }
                  context_enlargeIn--;
                  if (context_enlargeIn == 0) {
                      context_enlargeIn = Math.pow(2, context_numBits);
                      context_numBits++;
                  }
                  delete context_dictionaryToCreate[context_w];
              } else {
                  value = context_dictionary[context_w];
                  for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                          context_data_position = 0;
                          context_data.push(getCharFromInt(context_data_val));
                          context_data_val = 0;
                      } else {
                          context_data_position++;
                      }
                      value = value >> 1;
                  }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
              }
          }
          value = 2;
          for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
              } else {
                  context_data_position++;
              }
              value = value >> 1;
          }
          while (true) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                  context_data.push(getCharFromInt(context_data_val));
                  break;
              } else context_data_position++;
          }
          return context_data.join("");
      }
  };
  return LZString;
}();