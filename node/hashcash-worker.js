"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./classes/Bytes");
var utils_1 = require("./utils");
var HashcashResolution_1 = require("./interfaces/HashcashResolution");
onmessage = function (event) {
    var hashcashRequest = event.data;
    var noncelessPrehash = Bytes_1.Bytes.fromHex(hashcashRequest.noncelessPrehashHex);
    try {
        var nonce = utils_1.getNonce(noncelessPrehash, hashcashRequest.difficulty, hashcashRequest.timeoutAt);
        postMessage({
            key: HashcashResolution_1.HASHCASH_RESOLUTION_KEY.NONCE_HEX,
            value: nonce.getHex()
        }, []);
    }
    catch (err) {
        postMessage({
            key: HashcashResolution_1.HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR
        }, []);
    }
};
//# sourceMappingURL=hashcash-worker.js.map