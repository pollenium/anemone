"use strict";
exports.__esModule = true;
exports.stunServers = [
    'stun.l.google.com:19302',
    'stun1.l.google.com:19302',
    'stun2.l.google.com:19302',
    'stun3.l.google.com:19302',
    'stun4.l.google.com:19302',
    'global.stun.twilio.com:3478?transport=udp'
];
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
