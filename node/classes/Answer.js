"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var signalingMessage_1 = require("../templates/signalingMessage");
var Answer = (function () {
    function Answer(struct) {
        this.clientNonce = pollenium_uvaursi_1.Uu.wrap(struct.clientNonce);
        this.offerId = pollenium_uvaursi_1.Uu.wrap(struct.offerId);
        this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
    }
    Answer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER,
            value: {
                clientNonce: this.clientNonce.unwrap(),
                offerId: this.offerId.unwrap(),
                sdpb: this.sdpb.unwrap()
            }
        }));
    };
    Answer.fromHenpojo = function (henpojo) {
        return new Answer({
            clientNonce: henpojo.clientNonce,
            offerId: henpojo.offerId,
            sdpb: henpojo.sdpb
        });
    };
    return Answer;
}());
exports.Answer = Answer;
//# sourceMappingURL=Answer.js.map