"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var HashcashResolution_1 = require("./interfaces/HashcashResolution");
onmessage = function (event) {
    var hashcashRequest = event.data;
    try {
        var nonce = utils_1.genNonce(hashcashRequest);
        postMessage({
            key: HashcashResolution_1.HASHCASH_RESOLUTION_KEY.NONCE_HEX,
            value: nonce.uu.toHex()
        }, []);
    }
    catch (err) {
        postMessage({
            key: HashcashResolution_1.HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR
        }, []);
    }
};
//# sourceMappingURL=hashcash-worker.js.map