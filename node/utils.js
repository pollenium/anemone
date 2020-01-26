"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var shasta = __importStar(require("pollenium-shasta"));
exports.stunServers = [
    'stun.l.google.com:19302',
    'stun1.l.google.com:19302',
    'stun2.l.google.com:19302',
    'stun3.l.google.com:19302',
    'stun4.l.google.com:19302',
    'global.stun.twilio.com:3478?transport=udp'
];
function genNow() {
    return Math.floor((new Date).getTime() / 1000);
}
exports.genNow = genNow;
function genEra(time) {
    return Math.floor(time / 60);
}
exports.genEra = genEra;
function genSimplePeerConfig() {
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
exports.genSimplePeerConfig = genSimplePeerConfig;
function genTimestamp() {
    return pollenium_buttercup_1.Uint40.fromNumber(genNow());
}
exports.genTimestamp = genTimestamp;
var two256 = pollenium_buttercup_1.Uint256.fromNumber(2);
var twofiftyfive256 = pollenium_buttercup_1.Uint256.fromNumber(255);
function genMaxHash(struct) {
    var difficulty = pollenium_buttercup_1.Uint256.fromUintable(struct.difficulty);
    var cover = pollenium_buttercup_1.Uint256.fromUintable(struct.cover);
    var applicationDataLength = pollenium_buttercup_1.Uint256.fromUintable(struct.applicationDataLength);
    var pow = twofiftyfive256.opSub(difficulty);
    var divisor = cover.opAdd(applicationDataLength);
    var maxHash = two256.opPow(pow).opDiv(divisor);
    return maxHash;
}
exports.genMaxHash = genMaxHash;
function genNonce(struct) {
    var maxHash = genMaxHash({
        difficulty: struct.difficulty,
        cover: struct.cover,
        applicationDataLength: struct.applicationDataLength
    });
    while (true) {
        if (genNow() > struct.timeoutAt) {
            throw new Error('Timeout');
        }
        var nonce = pollenium_uvaursi_1.Uu.genRandom(32);
        var prehash = pollenium_uvaursi_1.Uu.genConcat([nonce, struct.noncelessPrehash]);
        var hash = new pollenium_buttercup_1.Uint256(shasta.genSha256(prehash));
        if (hash.compLte(maxHash)) {
            return new pollenium_buttercup_1.Uint256(nonce);
        }
    }
}
exports.genNonce = genNonce;
//# sourceMappingURL=utils.js.map