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
var SignalsDb = (function () {
    function SignalsDb() {
        this.isReceivedByHashHex = {};
    }
    SignalsDb.prototype.markIsReceived = function (signal) {
        var hashHex = signal.getHash().uu.toHex();
        this.isReceivedByHashHex[hashHex] = true;
    };
    SignalsDb.prototype.getIsReceived = function (signal) {
        var hashHex = signal.getHash().uu.toHex();
        return this.isReceivedByHashHex[hashHex] === true;
    };
    return SignalsDb;
}());
var OffersDb = (function (_super) {
    __extends(OffersDb, _super);
    function OffersDb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.urlsByOfferIdHex = {};
        return _this;
    }
    OffersDb.prototype.getUrlByOfferId = function (offerId) {
        var url = this.urlsByOfferIdHex[offerId.uu.toHex()];
        if (url) {
            return url;
        }
        else {
            return null;
        }
    };
    OffersDb.prototype.setUrlByOfferId = function (url, offerId) {
        this.urlsByOfferIdHex[offerId.uu.toHex()] = url;
    };
    return OffersDb;
}(SignalDb));
exports.OffersDb = OffersDb;
var AnswersDb = (function (_super) {
    __extends(AnswersDb, _super);
    function AnswersDb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnswersDb;
}(SignalDb));
exports.AnswersDb = AnswersDb;
var FlushesDb = (function (_super) {
    __extends(FlushesDb, _super);
    function FlushesDb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FlushesDb;
}(SignalDb));
exports.FlushesDb = FlushesDb;
//# sourceMappingURL=SignalDb.js.map