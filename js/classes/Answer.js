"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var signalingMessage_1 = require("../templates/signalingMessage");
var Answer = (function () {
    function Answer(clientNonce, offerId, sdpb) {
        this.clientNonce = clientNonce;
        this.offerId = offerId;
        this.sdpb = sdpb;
    }
    Answer.prototype.getEncoding = function () {
        return new Bytes_1.Bytes(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER,
            value: {
                clientNonce: this.clientNonce.uint8Array,
                offerId: this.offerId.uint8Array,
                sdpb: this.sdpb.uint8Array
            }
        }));
    };
    Answer.fromHenpojo = function (henpojo) {
        return new Answer(new Bytes_1.Bytes(henpojo.clientNonce), new Bytes_1.Bytes(henpojo.offerId), new Bytes_1.Bytes(henpojo.sdpb));
    };
    return Answer;
}());
exports.Answer = Answer;
//# sourceMappingURL=Answer.js.map