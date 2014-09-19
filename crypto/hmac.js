/*
 * Implements the Keyed-Hash Message Authentication Code (HMAC) using SJCL
 * library, using SHA256, encoding the key to bits and returning an string
 * with result codified in hexadecimal. An HMAC is a cryptographic hash that
 * uses a key to sign a message. The receiver verifies the hash by recomputing
 * it using the same key.
 *
 * Receivers should be careful to use Equal or CheckHmac functions to compare
 * MACs in order to avoid timing side-channels.
 */

angular.module('avCrypto', [])
  .service('HmacService', function() {
    var lib;
    /* jshint ignore:start */
    lib = sjcl;
    /* jshint ignore:end */

    function hmacFunc(key, message) {
      var keyBits = lib.codec.utf8String.toBits(key);
      var out = (new lib.misc.hmac(keyBits, lib.hash.sha256)).mac(message);
      return lib.codec.hex.fromBits(out);
    }

    function equalFunc(a, b) {
        var aLength = a.length,
            bLength = b.length,
            match = aLength === bLength ? 1 : 0,
            i = aLength;

        while ( i-- ) {
            var aChar = a.charCodeAt( i % aLength ),
                bChar = b.charCodeAt( i % bLength ),
                equ = aChar === bChar,
                asInt = equ ? 1 : 0;
            match = match & equ;
        }

        return match === 1;
    }

    return {
      "checkHmac": function(key, message, messageMAC) {
        return equalFunc(hmacFunc(key, message), messageMAC);
      },
      "hmac": hmacFunc,
      "equal": equalFunc,
    };
  });
