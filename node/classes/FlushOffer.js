"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var signalingMessage_1 = require("../templates/signalingMessage");
var FlushOffer = (function () {
    function FlushOffer(offerId) {
        this.offerId = pollenium_uvaursi_1.Uu.wrap(offerId);
    }
    FlushOffer.prototype.getEncoding = function () {
        return signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
            value: {
                offerId: this.offerId.unwrap()
            }
        });
    };
    FlushOffer.prototype.getId = function () {
        return this.getEncoding();
    };
    FlushOffer.fromHenpojo = function (henpojo) {
        return new FlushOffer(henpojo.offerId);
    };
    return FlushOffer;
}());
exports.FlushOffer = FlushOffer;
//# sourceMappingURL=FlushOffer.js.map