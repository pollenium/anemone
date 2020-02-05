"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var genNonce_1 = require("./utils/genNonce");
var HashcashWorker_1 = require("./interfaces/HashcashWorker");
onmessage = function (event) {
    var request = event.data;
    var resolution;
    try {
        var nonce = genNonce_1.genNonce(__assign({ noncelessPrehash: pollenium_uvaursi_1.Uu.fromHexish(request.noncelessPrehashHex) }, request));
        resolution = {
            key: HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.SUCCESS,
            value: nonce.uu.toHex(),
        };
        postMessage(resolution, []);
    }
    catch (error) {
        if (error instanceof genNonce_1.TimeoutError) {
            resolution = {
                key: HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.TIMEOUT_ERROR,
                value: 'TIMEOUT',
            };
        }
        else if (error instanceof Error) {
            resolution = {
                key: HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR,
                value: error.message,
            };
        }
        else {
            resolution = {
                key: HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR,
                value: 'Unknown Error',
            };
        }
        postMessage(resolution, []);
    }
};
//# sourceMappingURL=hashcash-worker.js.map