"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SignalingServer_1 = require("../../../classes/SignalingServer");
var params_1 = require("../lib/params");
function run() {
    params_1.signalingServerPorts.forEach(function (port) {
        console.log("Starting signaling server on port " + port);
        new SignalingServer_1.SignalingServer(port);
    });
}
run();
//# sourceMappingURL=start-signaling-servers.js.map