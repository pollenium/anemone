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
var signalingMessage_1 = require("../../templates/signalingMessage");
var Signal_1 = require("../Signal");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var Answer = (function (_super) {
    __extends(Answer, _super);
    function Answer(struct) {
        var _this = _super.call(this) || this;
        _this.clientId = new pollenium_buttercup_1.Bytes32(struct.clientId);
        _this.offerId = new pollenium_buttercup_1.Bytes32(struct.offerId);
        _this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
        return _this;
    }
    Answer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER,
            value: {
                clientId: this.clientId.uu.unwrap(),
                offerId: this.offerId.uu.unwrap(),
                sdpb: this.sdpb.unwrap()
            }
        }));
    };
    Answer.fromHenpojo = function (henpojo) {
        return new Answer({
            clientId: henpojo.clientId,
            offerId: henpojo.offerId,
            sdpb: henpojo.sdpb
        });
    };
    return Answer;
}(Signal_1.Signal));
exports.Answer = Answer;
//# sourceMappingURL=Answer.js.map