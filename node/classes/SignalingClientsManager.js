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
exports.__esModule = true;
var SignalingClient_1 = require("./SignalingClient");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var SignalingClientsManager = /** @class */ (function () {
    function SignalingClientsManager(options) {
        var _this = this;
        this.signalingClients = [];
        this.signalingClientsByUrl = {};
        this.offerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.answerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.flushSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.offersDb = new OffersDb;
        this.answersDb = new AnswersDb;
        this.flushesDb = new FlushesDb;
        options.signalingServerUrls.forEach(function (url) {
            _this.create(url);
        });
    }
    SignalingClientsManager.prototype.create = function (url) {
        var _this = this;
        var signalingClient = new SignalingClient_1.SignalingClient(url);
        this.signalingClients.push(signalingClient);
        this.signalingClientsByUrl[url] = signalingClient;
        signalingClient.offerSnowdrop.addHandle(function (offer) {
            _this.offersDb.setUrlByOfferId(url, offer.id);
            _this.offersDb.markIsReceived(offer);
            _this.offerSnowdrop.emit(offer);
        });
        signalingClient.answerSnowdrop.addHandle(function (answer) {
            if (_this.answersDb.getIsReceived(answer)) {
                return;
            }
            _this.answersDb.markIsReceived(answer);
            _this.answerSnowdrop.emit(answer);
        });
        signalingClient.flushOfferSnowdrop.addHandle(function (flushOffer) {
            if (_this.flushesDb.getIsReceived(flushOffer)) {
                return;
            }
            _this.flushesDb.markIsReceived(flushOffer);
            _this.flushSnowdrop.emit(flushOffer);
        });
    };
    SignalingClientsManager.prototype.handleOffer = function (offer) {
        this.signalingClients.forEach(function (signalingClient) {
            signalingClient.sendOffer(offer);
        });
    };
    SignalingClientsManager.prototype.handleAnswer = function (answer) {
        var url = this.offersDb.getUrlByOfferId(answer.offerId);
        if (url === null) {
            throw new Error('Unknown url');
        }
        this.signalingClientsByUrl[url].sendAnswer(answer);
    };
    SignalingClientsManager.prototype.handleFlush = function (flush) {
        this.signalingClients.forEach(function (signalingClient) {
            signalingClient.sendFlush(flush);
        });
    };
    return SignalingClientsManager;
}());
exports.SignalingClientsManager = SignalingClientsManager;
var SignalDb = /** @class */ (function () {
    function SignalDb() {
        this.isReceivedByHashHex = {};
    }
    SignalDb.prototype.markIsReceived = function (signal) {
        var hashHex = signal.getHash().uu.toHex();
        this.isReceivedByHashHex[hashHex] = true;
    };
    SignalDb.prototype.getIsReceived = function (signal) {
        var hashHex = signal.getHash().uu.toHex();
        return this.isReceivedByHashHex[hashHex] === true;
    };
    return SignalDb;
}());
var OffersDb = /** @class */ (function (_super) {
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
var AnswersDb = /** @class */ (function (_super) {
    __extends(AnswersDb, _super);
    function AnswersDb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnswersDb;
}(SignalDb));
var FlushesDb = /** @class */ (function (_super) {
    __extends(FlushesDb, _super);
    function FlushesDb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FlushesDb;
}(SignalDb));
