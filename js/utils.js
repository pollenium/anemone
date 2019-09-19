"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./classes/Bytes");
var bn_js_1 = __importDefault(require("bn.js"));
exports.stunServers = [
    'global.stun.twilio.com:3478?transport=udp'
];
function getNow() {
    return Math.floor((new Date).getTime() / 1000);
}
exports.getNow = getNow;
function calculateEra(time) {
    return Math.floor(time / 60);
}
exports.calculateEra = calculateEra;
function getSimplePeerConfig() {
    return {
        iceServers: exports.stunServers.sort(function () {
            return Math.random() - .5;
        }).slice(0, 2).map(function (stunServer) {
            return {
                urls: "stun:" + stunServer
            };
        })
    };
}
exports.getSimplePeerConfig = getSimplePeerConfig;
function getTimestamp() {
    return Bytes_1.Bytes.fromNumber(getNow()).getPaddedLeft(5);
}
exports.getTimestamp = getTimestamp;
exports.twoBn = new bn_js_1.default(2);
function getMaxHash(difficulty, encodingLength) {
    var powBn = new bn_js_1.default(256 - difficulty);
    var encodingLengthBn = new bn_js_1.default(encodingLength);
    var maxHashBn = exports.twoBn.pow(powBn).divRound(encodingLengthBn);
    return Bytes_1.Bytes.fromBn(maxHashBn);
}
exports.getMaxHash = getMaxHash;
function getNonce(noncelessPrehash, difficulty, timeoutAt) {
    var maxHashBn = getMaxHash(difficulty, noncelessPrehash.getLength() + 32).getBn();
    while (true) {
        if (getNow() > timeoutAt) {
            throw new Error('Timeout');
        }
        var nonce = Bytes_1.Bytes.random(32);
        var prehash = noncelessPrehash.append(nonce);
        var hashBn = prehash.getHash().getBn();
        if (hashBn.lte(maxHashBn)) {
            return nonce;
        }
    }
}
exports.getNonce = getNonce;
//# sourceMappingURL=utils.js.map