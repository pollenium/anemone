"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var signalingMessage_1 = require("../../templates/signalingMessage");
var Signal_1 = require("../Signal");
var Offer = (function (_super) {
    __extends(Offer, _super);
    function Offer(struct) {
        var _this = _super.call(this) || this;
        _this.id = new pollenium_buttercup_1.Bytes32(struct.id);
        _this.clientId = new pollenium_buttercup_1.Bytes32(struct.clientId);
        _this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
        return _this;
    }
    Offer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER,
            value: {
                id: this.id.uu.unwrap(),
                clientId: this.clientId.uu.unwrap(),
                sdpb: this.sdpb.unwrap(),
            },
        }));
    };
    return Offer;
}(Signal_1.Signal));
exports.Offer = Offer;
//# sourceMappingURL=Offer.js.map