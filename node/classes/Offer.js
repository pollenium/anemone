"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var signalingMessage_1 = require("../templates/signalingMessage");
var Offer = (function () {
    function Offer(clientNonce, sdpb) {
        this.clientNonce = clientNonce;
        this.sdpb = sdpb;
    }
    Offer.prototype.getEncoding = function () {
        return new Bytes_1.Bytes(signalingMessage_1.signalingMessageTemplate.encode({
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
        return new Offer(new Bytes_1.Bytes(henpojo.clientNonce), new Bytes_1.Bytes(henpojo.sdpb));
    };
    return Offer;
}());
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map