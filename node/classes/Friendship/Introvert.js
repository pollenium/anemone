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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var Friendship_1 = require("../Friendship");
var Introvert = /** @class */ (function (_super) {
    __extends(Introvert, _super);
    function Introvert(offer, options) {
        var _this = _super.call(this, __assign(__assign({}, options), { initiator: false })) || this;
        _this.setPeerClientId(offer.clientId);
        _this.setStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTING);
        _this.sendSignal({
            type: 'offer',
            sdpb: offer.sdpb
        });
        _this.startConnectOrDestroyTimeout();
        return _this;
    }
    return Introvert;
}(Friendship_1.Friendship));
exports.Introvert = Introvert;
