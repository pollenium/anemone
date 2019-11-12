"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var signalingMessage_1 = require("../templates/signalingMessage");
var Offer = (function () {
    function Offer(clientNonce, sdpb) {
        this.clientNonce = clientNonce;
        this.sdpb = sdpb;
    }
    Offer.prototype.getEncoding = function () {
        return new pollenium_buttercup_1.Buttercup(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER,
            value: {
                clientNonce: this.clientNonce.uint8Array,
                sdpb: this.sdpb.uint8Array
            }
        }));
    };
    Offer.prototype.getId = function () {
        return this.getEncoding().getHash();
    };
    Offer.prototype.getDistance = function (clientNonce) {
        return this.clientNonce.getXor(clientNonce);
    };
    Offer.fromHenpojo = function (henpojo) {
        return new Offer(new pollenium_buttercup_1.Buttercup(henpojo.clientNonce), new pollenium_buttercup_1.Buttercup(henpojo.sdpb));
    };
    return Offer;
}());
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map