"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var signalingMessage_1 = require("../templates/signalingMessage");
var FlushOffer = (function () {
    function FlushOffer(offerId) {
        this.offerId = offerId;
    }
    FlushOffer.prototype.getEncoding = function () {
        return new Bytes_1.Bytes(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
            value: {
                offerId: this.offerId.uint8Array
            }
        }));
    };
    FlushOffer.prototype.getId = function () {
        return this.getEncoding().getHash();
    };
    FlushOffer.fromHenpojo = function (henpojo) {
        return new FlushOffer(new Bytes_1.Bytes(henpojo.offerId));
    };
    return FlushOffer;
}());
exports.FlushOffer = FlushOffer;
//# sourceMappingURL=FlushOffer.js.map