"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var SignalingClient_1 = require("./SignalingClient");
var SignalsDb_1 = require("./SignalsDb");
var SignalingClientsManager = (function () {
    function SignalingClientsManager(struct) {
        var _this = this;
        this.struct = struct;
        this.signalingClients = [];
        this.signalingClientsByUrl = {};
        this.offerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.answerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.flushSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.offersDb = new SignalsDb_1.OffersDb();
        this.answersDb = new SignalsDb_1.AnswersDb();
        this.flushesDb = new SignalsDb_1.FlushesDb();
        struct.signalingServerUrls.forEach(function (url) {
            _this.create(url);
        });
    }
    SignalingClientsManager.prototype.create = function (url) {
        var _this = this;
        var signalingClient = new SignalingClient_1.SignalingClient({
            url: url,
            WebSocket: this.struct.WebSocket,
        });
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
//# sourceMappingURL=SignalingClientsManager.js.map