"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var shasta = __importStar(require("pollenium-shasta"));
var signalingMessage_1 = require("../templates/signalingMessage");
var Offer = (function () {
    function Offer(struct) {
        this.clientNonce = pollenium_uvaursi_1.Uu.wrap(struct.clientNonce);
        this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
    }
    Offer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER,
            value: {
                clientNonce: this.clientNonce.unwrap(),
                sdpb: this.sdpb.unwrap()
            }
        }));
    };
    Offer.prototype.getId = function () {
        return shasta.genSha256(this.getEncoding());
    };
    Offer.prototype.getDistance = function (clientNonce) {
        return new pollenium_buttercup_1.Uint256(this.clientNonce.genXor(clientNonce));
    };
    Offer.fromHenpojo = function (henpojo) {
        return new Offer({
            clientNonce: henpojo.clientNonce,
            sdpb: henpojo.clientNonce
        });
    };
    return Offer;
}());
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map