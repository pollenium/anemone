"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signalingServerPorts = [5010, 5011, 5012];
exports.signalingServerUrls = exports.signalingServerPorts.map(function (port) {
    return "ws://localhost:" + port;
});
exports.clientsCount = 7;
exports.minConnectedFriendshipsCount = 3;
exports.maxFriendshipsCount = 4;
exports.missivesCount = 4;
exports.expectedMissiveReceivesCount = exports.missivesCount * (exports.clientsCount - 1);
//# sourceMappingURL=params.js.map