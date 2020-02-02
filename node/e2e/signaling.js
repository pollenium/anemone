"use strict";
exports.__esModule = true;
var SignalingClient_1 = require("../classes/SignalingClient");
var params_1 = require("./lib/params");
var signalingClients = [];
test('signalingClient', function () {
    params_1.signalingServerUrls.forEach(function (url) {
        var signalingClient = new SignalingClient_1.SignalingClient(params_1.signalingServerUrls[0]);
        signalingClients.push(signalingClient);
    });
});
