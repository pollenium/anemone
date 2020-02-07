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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var delay_1 = __importDefault(require("delay"));
var pollenium_buttercup_1 = require("pollenium-buttercup");
var IntrovertsGroup_1 = require("./FriendshipsGroup/IntrovertsGroup");
var ExtrovertsGroup_1 = require("./FriendshipsGroup/ExtrovertsGroup");
var FriendshipsGroupSummary_1 = require("./FriendshipsGroupSummary");
var Friendship_1 = require("./Friendship");
var OfferInfo_1 = require("./OfferInfo");
var PartySummary_1 = require("./PartySummary");
var Party = (function () {
    function Party(struct) {
        var _this = this;
        this.struct = struct;
        this.offerInfos = [];
        this.isClientIdBanned = {};
        this.introvertsGroupSummary = new FriendshipsGroupSummary_1.FriendshipsGroupSummary([]);
        this.extrovertsGroupSummary = new FriendshipsGroupSummary_1.FriendshipsGroupSummary([]);
        this.isBootstrapOffersComplete = false;
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialAnswerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialOfferSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialFlushSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.introvertsGroup = new IntrovertsGroup_1.IntrovertsGroup(__assign({}, struct));
        this.extrovertsGroup = new ExtrovertsGroup_1.ExtrovertsGroup(__assign({}, struct));
        this.extrovertsGroup.partialOfferSnowdrop.addHandle(function (partialOffer) {
            _this.partialOfferSnowdrop.emit(partialOffer);
        });
        this.introvertsGroup.partialAnswerSnowdrop.addHandle(function (partialAnswer) {
            _this.partialAnswerSnowdrop.emit(partialAnswer);
        });
        this.extrovertsGroup.partialFlushSnowdrop.addHandle(function (partialFlush) {
            _this.partialFlushSnowdrop.emit(partialFlush);
        });
        this.introvertsGroup.summarySnowdrop.addHandle(function (introvertsGroupSummary) {
            _this.introvertsGroupSummary = introvertsGroupSummary;
            _this.emitPartySummary();
        });
        this.extrovertsGroup.summarySnowdrop.addHandle(function (extrovertsGroupSummary) {
            _this.extrovertsGroupSummary = extrovertsGroupSummary;
            _this.emitPartySummary();
        });
        this.introvertsGroup.destroyedSnowdrop.addHandle(function () {
            _this.maybeCreateFriendship();
        });
        this.extrovertsGroup.destroyedSnowdrop.addHandle(function () {
            _this.maybeCreateFriendship();
        });
        this.introvertsGroup.banSnowdrop.addHandle(function (clientId) {
            _this.banClientId(clientId);
        });
        this.extrovertsGroup.banSnowdrop.addHandle(function (clientId) {
            _this.banClientId(clientId);
        });
        this.introvertsGroup.missiveSnowdrop.addHandle(function (snowdrop) {
            _this.missiveSnowdrop.emit(snowdrop);
        });
        this.extrovertsGroup.missiveSnowdrop.addHandle(function (snowdrop) {
            _this.missiveSnowdrop.emit(snowdrop);
        });
        delay_1.default(struct.bootstrapOffersTimeout * 1000).then(function () {
            _this.isBootstrapOffersComplete = true;
            for (var i = _this.getFriendshipsCount(); i < struct.maxFriendshipsCount; i++) {
                _this.maybeCreateFriendship();
            }
        });
        setInterval(function () {
            _this.clearOldOffers();
        }, 1000);
    }
    Party.prototype.clearOldOffers = function () {
        var _this = this;
        this.offerInfos = this.offerInfos.filter(function (offerInfo) {
            var lastReceivedAgo = offerInfo.getLastReceivedAgo();
            if (lastReceivedAgo <= _this.struct.maxOfferLastReceivedAgo) {
                return true;
            }
            return false;
        });
    };
    Party.prototype.getBestConnectableOfferInfo = function () {
        var _this = this;
        var peerClientIds = this.getPeerClientIds();
        var connectableOfferInfos = this.offerInfos.filter(function (offerInfo) {
            if (offerInfo.getAttemptsCount() >= _this.struct.maxOfferAttemptsCount) {
                return false;
            }
            for (var i = 0; i < peerClientIds.length; i++) {
                if (peerClientIds[i].uu.getIsEqual(offerInfo.offer.clientId.uu)) {
                    return false;
                }
            }
            return true;
        });
        var sortedConnectableOfferInfos = connectableOfferInfos.sort(function (offerInfoA, offerInfoB) {
            if (!offerInfoA.offer.clientId.uu.getIsEqual(offerInfoB.offer.clientId)) {
                if (offerInfoA.getDistance() < offerInfoB.getDistance()) {
                    return -1;
                }
                return 1;
            }
            if (offerInfoA.getLastReceivedAgo() < offerInfoB.getLastReceivedAgo()) {
                return -1;
            }
            if (offerInfoA.getLastReceivedAgo() > offerInfoB.getLastReceivedAgo()) {
                return 1;
            }
            if (offerInfoA.getAttemptsCount() < offerInfoB.getAttemptsCount()) {
                return -1;
            }
            if (offerInfoA.getAttemptsCount() > offerInfoB.getAttemptsCount()) {
                return 1;
            }
            return 0;
        });
        if (sortedConnectableOfferInfos.length === 0) {
            return null;
        }
        return sortedConnectableOfferInfos[0];
    };
    Party.prototype.maybeCreateFriendship = function () {
        if (this.getFriendshipsCount() >= this.struct.maxFriendshipsCount) {
            this.maybeDestroyFriendship();
            return;
        }
        var offerInfo = this.getBestConnectableOfferInfo();
        if (offerInfo) {
            offerInfo.incrementAttemptsCount();
            this.introvertsGroup.create(offerInfo.offer);
        }
        else if (this.isBootstrapOffersComplete) {
            this.extrovertsGroup.create();
        }
    };
    Party.prototype.maybeDestroyFriendship = function () {
        var offerInfo = this.getBestConnectableOfferInfo();
        if (offerInfo === null) {
            return;
        }
        if (this.extrovertsGroup.getHasAnUnconnectedFriendship()) {
            this.extrovertsGroup.destroyAnUnconnectedFriendship(Friendship_1.DESTROY_REASON.NEW_OFFER);
            return;
        }
        var worstPeerClientIdAndDistance = this.getWorstPeerClientIdAndDistance();
        if (worstPeerClientIdAndDistance === null) {
            return;
        }
        var peerClientId = worstPeerClientIdAndDistance.peerClientId, distance = worstPeerClientIdAndDistance.distance;
        if (offerInfo.getDistance().compLt(distance)) {
            this.destroyFriendshipWithPeerClientId(peerClientId, Friendship_1.DESTROY_REASON.TOO_FAR);
        }
    };
    Party.prototype.getPeerClientIdsAndDistances = function () {
        var _this = this;
        return this.getPeerClientIds()
            .map(function (peerClientId) {
            return {
                peerClientId: peerClientId,
                distance: new pollenium_buttercup_1.Uint256(peerClientId.uu.genXor(_this.struct.clientId.uu)),
            };
        });
    };
    Party.prototype.getWorstPeerClientIdAndDistance = function () {
        var peerClientIdAndDistances = this.getPeerClientIdsAndDistances()
            .sort(function (peerClientIdAndDistanceA, peerClientIdAndDistanceB) {
            var distanceA = peerClientIdAndDistanceA.distance;
            var distanceB = peerClientIdAndDistanceB.distance;
            if (distanceA.compGt(distanceB)) {
                return -1;
            }
            if (distanceA.compLt(distanceB)) {
                return 1;
            }
            return 0;
        });
        return peerClientIdAndDistances[0];
    };
    Party.prototype.destroyFriendshipWithPeerClientId = function (peerClientId, destroyReason) {
        if (this.introvertsGroup.getHasFriendshipWithPeerClientId(peerClientId)) {
            this.introvertsGroup.destroyFriendshipWithPeerClientId(peerClientId, destroyReason);
            return;
        }
        if (this.extrovertsGroup.getHasFriendshipWithPeerClientId(peerClientId)) {
            this.extrovertsGroup.destroyFriendshipWithPeerClientId(peerClientId, destroyReason);
            return;
        }
        throw new Error('No friendship with that peerClientId');
    };
    Party.prototype.emitPartySummary = function () {
        this.summarySnowdrop.emit(this.getSummary());
    };
    Party.prototype.getSummary = function () {
        return new PartySummary_1.PartySummary({
            peerClientIdAndDistances: this.getPeerClientIdsAndDistances(),
            introvertsGroupSummary: this.introvertsGroup.getSummary(),
            extrovertsGroupSummary: this.extrovertsGroup.getSummary(),
            offerInfos: this.offerInfos,
        });
    };
    Party.prototype.getFriendshipsCount = function () {
        return (this.introvertsGroup.getFriendshipsCount()
            + this.extrovertsGroup.getFriendshipsCount());
    };
    Party.prototype.handleOffer = function (offer) {
        if (this.isClientIdBanned[offer.clientId.uu.toHex()]) {
            return;
        }
        var offerInfo = this.offerInfos.find(function (_offerInfo) {
            return _offerInfo.offer.id.uu.getIsEqual(offer.id.uu);
        });
        if (offerInfo === undefined) {
            this.offerInfos.push(new OfferInfo_1.OfferInfo({ offer: offer, clientId: this.struct.clientId }));
        }
        else {
            offerInfo.updateLastReceivedAt();
        }
        this.maybeCreateFriendship();
        this.emitPartySummary();
    };
    Party.prototype.handleAnswer = function (answer) {
        this.extrovertsGroup.handleAnswer(answer);
    };
    Party.prototype.handleFlush = function (flush) {
        this.offerInfos = this.offerInfos.filter(function (offerInfo) {
            if (offerInfo.offer.id.uu.getIsEqual(flush.offerId)) {
                return false;
            }
            return true;
        });
    };
    Party.prototype.getPeerClientIds = function () {
        return __spreadArrays(this.introvertsGroup.getPeerClientIds(), this.extrovertsGroup.getPeerClientIds());
    };
    Party.prototype.broadcastMissive = function (missive) {
        this.introvertsGroup.broadcastMissive(missive);
        this.extrovertsGroup.broadcastMissive(missive);
    };
    Party.prototype.banClientId = function (clientId) {
        this.isClientIdBanned[clientId.uu.toHex()] = true;
        this.offerInfos = this.offerInfos.filter(function (offerInfo) {
            return offerInfo.offer.clientId.uu.getIsEqual(clientId.uu);
        });
    };
    return Party;
}());
exports.Party = Party;
//# sourceMappingURL=Party.js.map