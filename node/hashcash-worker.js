"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var utils_1 = require("./utils");
var HashcashResolution_1 = require("./interfaces/HashcashResolution");
onmessage = function (event) {
    var hashcashRequest = event.data;
    var noncelessPrehash = pollenium_buttercup_1.Buttercup.fromHex(hashcashRequest.noncelessPrehashHex);
    try {
        var nonce = utils_1.getNonce(noncelessPrehash, hashcashRequest.difficulty, hashcashRequest.cover, hashcashRequest.applicationDataLength, hashcashRequest.timeoutAt);
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