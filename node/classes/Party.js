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
exports.__esModule = true;
var IntrovertsGroup_1 = require("./FriendshipsGroup/IntrovertsGroup");
var ExtrovertsGroup_1 = require("./FriendshipsGroup/ExtrovertsGroup");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var delay_1 = __importDefault(require("delay"));
var pollenium_buttercup_1 = require("pollenium-buttercup");
var FriendshipsGroup_1 = require("./FriendshipsGroup");
var Friendship_1 = require("./Friendship");
var ts_enum_util_1 = require("ts-enum-util");
var genTime_1 = require("../utils/genTime");
var OfferInfo = /** @class */ (function () {
    function OfferInfo(struct) {
        this.attemptsCount = 0;
        this.firstReceivedAt = genTime_1.genTime();
        this.lastReceivedAt = genTime_1.genTime();
        this.offer = struct.offer;
        this.clientId = struct.clientId;
    }
    OfferInfo.prototype.getAttemptsCount = function () {
        return this.attemptsCount;
    };
    OfferInfo.prototype.getFirstReceivedAgo = function () {
        return genTime_1.genTime() - this.firstReceivedAt;
    };
    OfferInfo.prototype.getLastReceivedAgo = function () {
        return genTime_1.genTime() - this.lastReceivedAt;
    };
    OfferInfo.prototype.incrementAttemptsCount = function () {
        this.attemptsCount += 1;
    };
    OfferInfo.prototype.updateLastReceivedAt = function () {
        this.lastReceivedAt = genTime_1.genTime();
    };
    OfferInfo.prototype.getDistance = function () {
        if (this.distance) {
            return this.distance;
        }
        var xor = this.offer.clientId.uu.genXor(this.clientId.uu);
        return new pollenium_buttercup_1.Uint256(xor);
    };
    return OfferInfo;
}());
var Party = /** @class */ (function () {
    function Party(options) {
        var _this = this;
        this.options = options;
        this.offerInfos = [];
        this.isClientIdBanned = {};
        this.introvertsGroupSummary = new FriendshipsGroup_1.FriendshipsGroupSummary([]);
        this.extrovertsGroupSummary = new FriendshipsGroup_1.FriendshipsGroupSummary([]);
        this.isBootstrapOffersComplete = false;
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialAnswerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialOfferSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.partialFlushSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.introvertsGroup = new IntrovertsGroup_1.IntrovertsGroup(__assign({}, options));
        this.extrovertsGroup = new ExtrovertsGroup_1.ExtrovertsGroup(__assign({}, options));
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
        delay_1["default"](options.bootstrapOffersTimeout * 1000).then(function () {
            _this.isBootstrapOffersComplete = true;
            for (var i = _this.getFriendshipsCount(); i < options.maxFriendshipsCount; i++) {
                _this.maybeCreateFriendship();
            }
        });
        setInterval(function () {
            _this.clearOldOffers();
        }, 1000);
    }
    Party.prototype.clearOldOffers = function () {
        var _this = this;
        var now = genTime_1.genTime();
        this.offerInfos = this.offerInfos.filter(function (offerInfo) {
            var lastReceivedAgo = offerInfo.getLastReceivedAgo();
            if (lastReceivedAgo <= _this.options.maxOfferLastReceivedAgo) {
                return true;
            }
            else {
                return false;
            }
        });
    };
    Party.prototype.getBestConnectableOfferInfo = function () {
        var _this = this;
        var peerClientIds = this.getPeerClientIds();
        var connectableOfferInfos = this.offerInfos.filter(function (offerInfo) {
            if (offerInfo.getAttemptsCount() >= _this.options.maxOfferAttemptsCount) {
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
                else {
                    return 1;
                }
            }
            if (offerInfoA.getLastReceivedAgo() < offerInfoB.getLastReceivedAgo()) {
                return -1;
            }
            else if (offerInfoA.getLastReceivedAgo() > offerInfoB.getLastReceivedAgo()) {
                return;
            }
            if (offerInfoA.getAttemptsCount() < offerInfoB.getAttemptsCount()) {
                return -1;
            }
            else if (offerInfoA.getAttemptsCount() > offerInfoB.getAttemptsCount()) {
                return 1;
            }
            return 0;
        });
        if (sortedConnectableOfferInfos.length === 0) {
            return null;
        }
        else {
            return sortedConnectableOfferInfos[0];
        }
    };
    Party.prototype.maybeCreateFriendship = function () {
        if (this.getFriendshipsCount() >= this.options.maxFriendshipsCount) {
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
    Party.prototype.getWorstPeerClientIdAndDistance = function () {
        var _this = this;
        var peerClientIds = this.getPeerClientIds();
        if (peerClientIds.length === 0) {
            return null;
        }
        var peerClientIdAndDistances = peerClientIds.map(function (peerClientId) {
            return {
                peerClientId: peerClientId,
                distance: new pollenium_buttercup_1.Uint256(peerClientId.uu.genXor(_this.options.clientId.uu))
            };
        }).sort(function (peerClientIdAndDistanceA, peerClientIdAndDistanceB) {
            var distanceA = peerClientIdAndDistanceA.distance;
            var distanceB = peerClientIdAndDistanceB.distance;
            if (distanceA.compLt(distanceB)) {
                return -1;
            }
            if (distanceA.compGt(distanceB)) {
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
        return new PartySummary({
            introvertsGroupSummary: this.introvertsGroupSummary,
            extrovertsGroupSummary: this.extrovertsGroupSummary,
            offerInfos: this.offerInfos
        });
    };
    Party.prototype.getFriendshipsCount = function () {
        return this.introvertsGroup.getFriendshipsCount() + this.extrovertsGroup.getFriendshipsCount();
    };
    Party.prototype.handleOffer = function (offer) {
        if (this.isClientIdBanned[offer.clientId.uu.toHex()]) {
            return;
        }
        var offerInfo = this.offerInfos.find(function (offerInfo) {
            return offerInfo.offer.id.uu.getIsEqual(offer.id.uu);
        });
        if (offerInfo === undefined) {
            this.offerInfos.push(new OfferInfo({ offer: offer, clientId: this.options.clientId }));
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
            else {
                return true;
            }
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
var PartySummary = /** @class */ (function () {
    function PartySummary(struct) {
        this.struct = struct;
        this.createdAt = genTime_1.genTime();
    }
    PartySummary.prototype.getFriendshipsCount = function () {
        return (this.struct.extrovertsGroupSummary.getFriendshipsCount()
            +
                this.struct.introvertsGroupSummary.getFriendshipsCount());
    };
    PartySummary.prototype.getFriendshipsCountByStatus = function (friendshipStatus) {
        return (this.struct.extrovertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
            +
                this.struct.introvertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus));
    };
    PartySummary.prototype.getFriendshipsCountsByStatus = function () {
        var _this = this;
        var friendshipsCountsByStatus = {};
        ts_enum_util_1.$enum(Friendship_1.FRIENDSHIP_STATUS).forEach(function (status) {
            friendshipsCountsByStatus[status] = _this.getFriendshipsCountByStatus(status);
        });
        return friendshipsCountsByStatus;
    };
    PartySummary.prototype.toJsonable = function () {
        return {
            createdAt: this.createdAt,
            createdAgo: genTime_1.genTime() - this.createdAt,
            friendshipsCount: this.getFriendshipsCount(),
            connectedFriendshipsCount: this.getFriendshipsCountsByStatus()['2'],
            offersCount: this.struct.offerInfos.length,
            offerInfos: this.struct.offerInfos.map(function (offerInfo) {
                return {
                    idHex: offerInfo.offer.id.uu.toHex(),
                    offerClientIdHex: offerInfo.offer.clientId.uu.toHex(),
                    attemptsCount: offerInfo.getAttemptsCount(),
                    firstReceivedAgo: offerInfo.getFirstReceivedAgo(),
                    lastReceivedAgo: offerInfo.getLastReceivedAgo(),
                    distance: offerInfo.getDistance().uu.toHex()
                };
            }),
            friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
            introvertsGroup: this.struct.introvertsGroupSummary.toJsonable(),
            extrovertsGroup: this.struct.extrovertsGroupSummary.toJsonable()
        };
    };
    PartySummary.prototype.toJson = function () {
        return JSON.stringify(this.toJsonable(), null, 2);
    };
    return PartySummary;
}());
exports.PartySummary = PartySummary;
