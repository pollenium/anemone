"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var Missive_1 = require("./Missive");
var utils_1 = require("../utils");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var FRIENDSHIP_STATUS;
(function (FRIENDSHIP_STATUS) {
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["DEFAULT"] = 0] = "DEFAULT";
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["CONNECTING"] = 1] = "CONNECTING";
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["CONNECTED"] = 2] = "CONNECTED";
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["DESTROYED"] = 3] = "DESTROYED";
})(FRIENDSHIP_STATUS = exports.FRIENDSHIP_STATUS || (exports.FRIENDSHIP_STATUS = {}));
var Friendship = (function () {
    function Friendship(client, simplePeer) {
        this.client = client;
        this.simplePeer = simplePeer;
        this.status = FRIENDSHIP_STATUS.DEFAULT;
        this.statusSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.createdAt = utils_1.getNow();
        this.setSimplePeerListeners();
    }
    Friendship.prototype.setStatus = function (status) {
        if (this.status !== undefined && status <= this.status) {
            throw new Error('Can only increase status');
        }
        this.status = status;
        if (this.peerClientNonce) {
            this.client.setFriendshipStatusByClientNonce(this.peerClientNonce, status);
        }
        this.statusSnowdrop.emitIfHandle(this);
        this.client.friendshipStatusSnowdrop.emitIfHandle(this);
    };
    Friendship.prototype.getDistance = function () {
        if (this.peerClientNonce === undefined) {
            throw new Error('peerClientNonce not yet established');
        }
        return this.peerClientNonce.getXor(this.client.nonce);
    };
    Friendship.prototype.setSimplePeerListeners = function () {
        var _this = this;
        this.simplePeer.on('iceStateChange', function (iceConnectionState) {
            if (iceConnectionState === 'disconnected') {
                _this.destroy();
            }
        });
        this.simplePeer.on('connect', function () {
            _this.setStatus(FRIENDSHIP_STATUS.CONNECTED);
        });
        this.simplePeer.on('data', function (missiveEncodingBuffer) {
            var missive = Missive_1.Missive.fromEncoding(_this.client, pollenium_buttercup_1.Buttercup.fromBuffer(missiveEncodingBuffer));
            _this.handleMessage(missive);
        });
        this.simplePeer.once('error', function () {
            _this.destroy();
        });
        this.simplePeer.once('close', function () {
            _this.destroy();
        });
    };
    Friendship.prototype.destroy = function () {
        if (this.simplePeer) {
            this.destroySimplePeer();
        }
        this.setStatus(FRIENDSHIP_STATUS.DESTROYED);
        this.client.createFriendship();
    };
    Friendship.prototype.destroySimplePeer = function () {
        this.simplePeer.removeAllListeners();
        this.simplePeer.destroy();
    };
    Friendship.prototype.getIsSendable = function () {
        if (this.status !== FRIENDSHIP_STATUS.CONNECTED) {
            return false;
        }
        if (!this.simplePeer.connected) {
            return false;
        }
        return true;
    };
    Friendship.prototype.send = function (bytes) {
        if (!this.getIsSendable()) {
            throw new Error('friendship not sendable');
        }
        this.simplePeer.send(bytes.uint8Array);
    };
    Friendship.prototype.sendMessage = function (missive) {
        this.send(missive.getEncoding());
    };
    Friendship.prototype.handleMessage = function (missive) {
        var _this = this;
        if (missive.getIsReceived()) {
            return;
        }
        missive.markIsReceived();
        this.client.missiveSnowdrop.emitIfHandle(missive);
        this.client.getFriendships().forEach(function (friendship) {
            if (friendship === _this) {
                return;
            }
            if (!friendship.getIsSendable()) {
                return;
            }
            friendship.sendMessage(missive);
        });
    };
    return Friendship;
}());
exports.Friendship = Friendship;
//# sourceMappingURL=Friendship.js.map