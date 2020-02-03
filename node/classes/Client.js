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
exports.__esModule = true;
var SignalingClientsManager_1 = require("./SignalingClientsManager");
var Party_1 = require("./Party");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var MissivesDb_1 = require("./MissivesDb");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var Offer_1 = require("./Signal/Offer");
var Answer_1 = require("./Signal/Answer");
var Flush_1 = require("./Signal/Flush");
var pollenium_primrose_1 = require("pollenium-primrose");
var Client = /** @class */ (function () {
    function Client(options) {
        var _this = this;
        this.options = options;
        this.id = new pollenium_buttercup_1.Bytes32(pollenium_uvaursi_1.Uu.genRandom(32));
        this.friendshipStatusSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.extrovertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.introvertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missivesDb = new MissivesDb_1.MissivesDb;
        this.maxFriendshipsConnectedPrimrose = new pollenium_primrose_1.Primrose();
        this.party = new Party_1.Party(__assign({ clientId: this.id }, options));
        this.signalingClientsManager = new SignalingClientsManager_1.SignalingClientsManager(__assign({}, options));
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
            var flush = new Flush_1.Flush(__assign({ clientId: _this.id }, partialFlush));
            _this.signalingClientsManager.handleFlush(flush);
        });
        this.party.summarySnowdrop.addHandle(function (partySummary) {
            _this.summarySnowdrop.emitIfHandle(_this.getSummary());
        });
    }
    Client.prototype.getSummary = function () {
        return new ClientSummary({
            id: this.id,
            partySummary: this.party.getSummary()
        });
    };
    Client.prototype.broadcastMissive = function (missive) {
        this.party.broadcastMissive(missive);
    };
    return Client;
}());
exports.Client = Client;
var ClientSummary = /** @class */ (function () {
    function ClientSummary(struct) {
        this.id = struct.id;
        this.partySummary = struct.partySummary;
    }
    ClientSummary.prototype.toJsonable = function () {
        return {
            idHex: this.id.uu.toHex(),
            partySummary: this.partySummary.toJsonable()
        };
    };
    return ClientSummary;
}());
exports.ClientSummary = ClientSummary;
