"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var signalingMessage_1 = require("../templates/signalingMessage");
var Answer = (function () {
    function Answer(clientNonce, offerId, sdpb) {
        this.clientNonce = clientNonce;
        this.offerId = offerId;
        this.sdpb = sdpb;
    }
    Answer.prototype.getEncoding = function () {
        return new pollenium_buttercup_1.Buttercup(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER,
            value: {
                clientNonce: this.clientNonce.uint8Array,
                offerId: this.offerId.uint8Array,
                sdpb: this.sdpb.uint8Array
            }
        }));
    };
    Answer.fromHenpojo = function (henpojo) {
        return new Answer(new pollenium_buttercup_1.Buttercup(henpojo.clientNonce), new pollenium_buttercup_1.Buttercup(henpojo.offerId), new pollenium_buttercup_1.Buttercup(henpojo.sdpb));
    };
    return Answer;
}());
exports.Answer = Answer;
//# sourceMappingURL=Answer.js.map