"use strict";
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
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var pollenium_primrose_1 = require("pollenium-primrose");
var SignalingClientsManager_1 = require("./SignalingClientsManager");
var Party_1 = require("./Party");
var Offer_1 = require("./Signal/Offer");
var Answer_1 = require("./Signal/Answer");
var Flush_1 = require("./Signal/Flush");
var ClientSummary_1 = require("./ClientSummary");
exports.clientDefaults = {
    missiveLatencyTolerance: 30,
    sdpTimeout: 10,
    bootstrapOffersTimeout: 10,
    offerReuploadInterval: 5,
    maxFriendshipsCount: 6,
    maxOfferLastReceivedAgo: 30,
    maxOfferAttemptsCount: 5,
};
var Client = (function () {
    function Client(struct) {
        var _this = this;
        this.id = new pollenium_buttercup_1.Bytes32(pollenium_uvaursi_1.Uu.genRandom(32));
        this.friendshipStatusSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.extrovertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.introvertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.maxFriendshipsConnectedPrimrose = new pollenium_primrose_1.Primrose();
        this.isMissiveReceivedByHashHex = {};
        this.isMissiveBroadcastedByHashHex = {};
        this.party = new Party_1.Party(__assign({ clientId: this.id }, struct));
        this.signalingClientsManager = new SignalingClientsManager_1.SignalingClientsManager(__assign({}, struct));
        this.signalingClientsManager.offerSnowdrop.addHandle(function (offer) {
            if (offer.clientId.uu.getIsEqual(_this.id.uu)) {
                return;
            }
            _this.party.handleOffer(offer);
        });
        this.signalingClientsManager.answerSnowdrop.addHandle(function (answer) {
            _this.party.handleAnswer(answer);
        });
        this.signalingClientsManager.flushSnowdrop.addHandle(function (flush) {
            _this.party.handleFlush(flush);
        });
        this.party.partialOfferSnowdrop.addHandle(function (partialOffer) {
            var offer = new Offer_1.Offer(__assign({ clientId: _this.id }, partialOffer));
            _this.signalingClientsManager.handleOffer(offer);
        });
        this.party.partialAnswerSnowdrop.addHandle(function (partialAnswer) {
            var answer = new Answer_1.Answer(__assign({ clientId: _this.id }, partialAnswer));
            _this.signalingClientsManager.handleAnswer(answer);
        });
        this.party.partialFlushSnowdrop.addHandle(function (partialFlush) {
            var flush = new Flush_1.Flush(__assign({}, partialFlush));
            _this.signalingClientsManager.handleFlush(flush);
        });
        this.party.summarySnowdrop.addHandle(function () {
            _this.summarySnowdrop.emit(_this.getSummary());
        });
        this.party.missiveSnowdrop.addHandle(function (missive) {
            var missiveHashHex = missive.getHash().uu.toHex();
            if (_this.isMissiveReceivedByHashHex[missiveHashHex]) {
                return;
            }
            if (_this.isMissiveBroadcastedByHashHex[missiveHashHex]) {
                return;
            }
            _this.isMissiveReceivedByHashHex[missiveHashHex] = true;
            _this.missiveSnowdrop.emit(missive);
            _this.broadcastMissive(missive);
        });
    }
    Client.prototype.getSummary = function () {
        return new ClientSummary_1.ClientSummary({
            id: this.id,
            partySummary: this.party.getSummary(),
        });
    };
    Client.prototype.broadcastMissive = function (missive) {
        var missiveHashHex = missive.getHash().uu.toHex();
        if (this.isMissiveBroadcastedByHashHex[missiveHashHex]) {
            throw new Error('Trying to broadcast a missive that has already been broadcast');
        }
        this.isMissiveBroadcastedByHashHex[missiveHashHex] = true;
        this.party.broadcastMissive(missive);
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map