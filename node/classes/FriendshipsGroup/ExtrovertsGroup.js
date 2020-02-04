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
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var FriendshipsGroup_1 = require("../FriendshipsGroup");
var Extrovert_1 = require("../Friendship/Extrovert");
var ExtrovertsGroup = (function (_super) {
    __extends(ExtrovertsGroup, _super);
    function ExtrovertsGroup(extrovertGroupStruct) {
        var _this = _super.call(this, __assign({}, extrovertGroupStruct)) || this;
        _this.extrovertGroupStruct = extrovertGroupStruct;
        _this.extrovertsByOfferIdHex = {};
        _this.partialOfferSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        _this.partialFlushSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        return _this;
    }
    ExtrovertsGroup.prototype.create = function () {
        var _this = this;
        var extrovert = new Extrovert_1.Extrovert(this.struct);
        var offerId = pollenium_uvaursi_1.Uu.genRandom(32);
        this.addFriendship(extrovert);
        extrovert.destroyedSnowdrop.addHandle(function () {
            delete _this.extrovertsByOfferIdHex[offerId.toHex()];
            _this.partialFlushSnowdrop.emit({
                offerId: offerId,
            });
        });
        extrovert.fetchSdpb().then(function (sdpb) {
            _this.extrovertsByOfferIdHex[offerId.toHex()] = extrovert;
            var partialOffer = {
                id: offerId,
                sdpb: sdpb,
            };
            _this.partialOfferSnowdrop.emit(partialOffer);
            var intervalId = setInterval(function () {
                if (extrovert.getIsConnectable()) {
                    _this.partialOfferSnowdrop.emit(partialOffer);
                }
                else {
                    clearInterval(intervalId);
                }
            }, _this.extrovertGroupStruct.offerReuploadInterval * 1000);
        });
    };
    ExtrovertsGroup.prototype.handleAnswer = function (answer) {
        var extrovert = this.getExtrovertByOfferId(answer.offerId);
        if (extrovert === null) {
            return;
        }
        extrovert.handleAnswer(answer);
    };
    ExtrovertsGroup.prototype.getExtrovertByOfferId = function (offerId) {
        var extrovert = this.extrovertsByOfferIdHex[offerId.uu.toHex()];
        if (extrovert) {
            return extrovert;
        }
        return null;
    };
    return ExtrovertsGroup;
}(FriendshipsGroup_1.FriendshipsGroup));
exports.ExtrovertsGroup = ExtrovertsGroup;
//# sourceMappingURL=ExtrovertsGroup.js.map