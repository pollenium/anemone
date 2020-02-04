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
Object.defineProperty(exports, "__esModule", { value: true });
var Friendship_1 = require("../Friendship");
var Extrovert = (function (_super) {
    __extends(Extrovert, _super);
    function Extrovert(struct) {
        return _super.call(this, __assign(__assign({}, struct), { initiator: true })) || this;
    }
    Extrovert.prototype.handleAnswer = function (answer) {
        if (this.getStatus() !== Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
            return;
        }
        this.setPeerClientId(answer.clientId);
        this.setStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTING);
        this.sendSignal({
            type: 'answer',
            sdpb: answer.sdpb,
        });
        this.startConnectOrDestroyTimeout();
    };
    Extrovert.prototype.getIsConnectable = function () {
        if (this.getIsDestroyed()) {
            return false;
        }
        if (this.getStatus() !== Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
            return false;
        }
        return true;
    };
    return Extrovert;
}(Friendship_1.Friendship));
exports.Extrovert = Extrovert;
//# sourceMappingURL=Extrovert.js.map