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
var pollenium_buttercup_1 = require("pollenium-buttercup");
var signalingMessage_1 = require("../../templates/signalingMessage");
var Signal_1 = require("../Signal");
var Flush = (function (_super) {
    __extends(Flush, _super);
    function Flush(struct) {
        var _this = _super.call(this) || this;
        _this.offerId = new pollenium_buttercup_1.Bytes32(struct.offerId);
        return _this;
    }
    Flush.prototype.getEncoding = function () {
        return signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH,
            value: {
                offerId: this.offerId.uu.unwrap()
            }
        });
    };
    Flush.fromHenpojo = function (henpojo) {
        return new Flush({
            offerId: henpojo.offerId
        });
    };
    return Flush;
}(Signal_1.Signal));
exports.Flush = Flush;
//# sourceMappingURL=Flush.js.map