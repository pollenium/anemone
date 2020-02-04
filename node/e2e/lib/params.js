"use strict";
exports.__esModule = true;
exports.signalingServerPorts = [5010, 5011, 5012];
exports.signalingServerUrls = exports.signalingServerPorts.map(function (port) {
    return "ws://localhost:" + port;
});
exports.clientsCount = 7;
exports.maxFriendshipsCount = 4;
exports.missivesCount = 4;
exports.expectedMissiveReceivesCount = exports.missivesCount * (exports.clientsCount - 1);
