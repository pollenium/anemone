"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Missive_1 = require("./Missive");
var genTime_1 = require("../utils/genTime");
var genSimplePeerConfig_1 = require("../utils/genSimplePeerConfig");
var simple_peer_1 = __importDefault(require("simple-peer"));
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var pollenium_primrose_1 = require("pollenium-primrose");
var delay_1 = __importDefault(require("delay"));
var FRIENDSHIP_STATUS;
(function (FRIENDSHIP_STATUS) {
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["DEFAULT"] = 0] = "DEFAULT";
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["CONNECTING"] = 1] = "CONNECTING";
    FRIENDSHIP_STATUS[FRIENDSHIP_STATUS["CONNECTED"] = 2] = "CONNECTED";
})(FRIENDSHIP_STATUS = exports.FRIENDSHIP_STATUS || (exports.FRIENDSHIP_STATUS = {}));
var BAN_REASON;
(function (BAN_REASON) {
    BAN_REASON["MISSIVE_OLD"] = "MISSIVE_OLD";
    BAN_REASON["MISSIVE_TIMETRAVEL"] = "MISSIVE_TIMETRAVEL";
    BAN_REASON["MISSIVE_INVALID"] = "MISSIVE_INVALID";
    BAN_REASON["MISSIVE_DUPLICATE"] = "MISSIVE_DUPLICATE";
    BAN_REASON["MISSIVE_NONDECODABLE"] = "MISSIVE_NONDECODABLE";
})(BAN_REASON = exports.BAN_REASON || (exports.BAN_REASON = {}));
var DESTROY_REASON;
(function (DESTROY_REASON) {
    DESTROY_REASON["GOODBYE"] = "GOODBYE";
    DESTROY_REASON["BAN"] = "BAN";
    DESTROY_REASON["TOO_LONG"] = "TOO_LONG";
    DESTROY_REASON["WRTC_CLOSE"] = "WRTC_CLOSE";
    DESTROY_REASON["WRTC_ERROR"] = "WRTC_ERROR";
    DESTROY_REASON["ICE_DISCONNECT"] = "ICE_DISCONNECT";
    DESTROY_REASON["TOO_FAR"] = "TOO_FAR";
    DESTROY_REASON["NEW_OFFER"] = "NEW_OFFER";
})(DESTROY_REASON = exports.DESTROY_REASON || (exports.DESTROY_REASON = {}));
var Friendship = /** @class */ (function () {
    function Friendship(options) {
        var _this = this;
        this.status = FRIENDSHIP_STATUS.DEFAULT;
        this.peerClientId = null;
        this.isDestroyed = false;
        this.sdpbPrimrose = new pollenium_primrose_1.Primrose();
        this.isMissiveReceivedByHashHex = {};
        this.destroyedSnowdrop = new pollenium_snowdrop_1.Snowdrop({ maxEmitsCount: 1 });
        this.statusSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.banSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.banReason = null;
        this.destroyReason = null;
        this.simplePeer = new simple_peer_1["default"]({
            initiator: options.initiator,
            trickle: false,
            wrtc: options.wrtc,
            config: genSimplePeerConfig_1.genSimplePeerConfig()
        });
        this.simplePeer.on('iceStateChange', function (iceConnectionState) {
            if (iceConnectionState === 'disconnected') {
                _this.destroy(DESTROY_REASON.ICE_DISCONNECT);
            }
        });
        this.simplePeer.on('connect', function () {
            _this.setStatus(FRIENDSHIP_STATUS.CONNECTED);
        });
        this.simplePeer.once('error', function (error) {
            _this.destroy(DESTROY_REASON.WRTC_ERROR);
        });
        this.simplePeer.once('close', function () {
            _this.destroy(DESTROY_REASON.WRTC_CLOSE);
        });
        this.simplePeer.once('signal', function (signal) {
            if (_this.isDestroyed) {
                return;
            }
            _this.sdpbPrimrose.resolve(pollenium_uvaursi_1.Uu.fromUtf8(signal.sdp));
        });
        this.simplePeer.on('data', function (data) {
            var encoding = new pollenium_uvaursi_1.Uu(new Uint8Array(data));
            var missive;
            try {
                missive = Missive_1.Missive.fromEncoding(encoding);
            }
            catch (error) {
                _this.banAndDestroy(BAN_REASON.MISSIVE_NONDECODABLE);
            }
            if (_this.getIsMissiveReceived(missive)) {
                _this.banAndDestroy(BAN_REASON.MISSIVE_DUPLICATE);
            }
            if (!missive.getIsValid()) {
                _this.banAndDestroy(BAN_REASON.MISSIVE_INVALID);
            }
            var time = genTime_1.genTime();
            if (missive.timestamp.toNumber() > time) {
                _this.banAndDestroy(BAN_REASON.MISSIVE_TIMETRAVEL);
            }
            if (missive.timestamp.toNumber() < time - options.missiveLatencyTolerance) {
                _this.banAndDestroy(BAN_REASON.MISSIVE_OLD);
            }
            _this.missiveSnowdrop.emit(missive);
        });
    }
    Friendship.prototype.getPeerClientId = function () {
        return this.peerClientId;
    };
    Friendship.prototype.getStatus = function () {
        return this.status;
    };
    Friendship.prototype.fetchSdpb = function () {
        return this.sdpbPrimrose.promise;
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
    Friendship.prototype.sendMissive = function (missive) {
        this.send(missive.getEncoding());
    };
    Friendship.prototype.send = function (bytes) {
        if (!this.getIsSendable()) {
            throw new Error('Friendship not sendable');
        }
        this.simplePeer.send(bytes.unwrap());
    };
    Friendship.prototype.destroy = function (reason) {
        if (this.isDestroyed) {
            throw new Error("Cannot destroy: " + reason + ", already destroyed: " + this.destroyReason);
        }
        this.destroyReason = reason;
        this.isDestroyed = true;
        this.simplePeer.removeAllListeners();
        this.simplePeer.destroy();
        this.destroyedSnowdrop.emit();
    };
    Friendship.prototype.startConnectOrDestroyTimeout = function () {
        var _this = this;
        delay_1["default"](5000).then(function () {
            if (_this.isDestroyed) {
                return;
            }
            if (_this.status === FRIENDSHIP_STATUS.CONNECTED) {
                return;
            }
            _this.destroy(DESTROY_REASON.TOO_LONG);
        });
    };
    Friendship.prototype.setPeerClientId = function (peerClientId) {
        this.peerClientId = peerClientId;
    };
    Friendship.prototype.setStatus = function (status) {
        if (status <= this.status) {
            throw new Error('Can only increase status');
        }
        this.status = status;
        this.statusSnowdrop.emitIfHandle(status);
    };
    Friendship.prototype.getIsDestroyed = function () {
        return this.isDestroyed;
    };
    Friendship.prototype.sendSignal = function (struct) {
        this.simplePeer.signal({
            type: struct.type,
            sdp: struct.sdpb.toUtf8()
        });
    };
    Friendship.prototype.getIsMissiveReceived = function (missive) {
        var missiveHashHex = missive.getHash().uu.toHex();
        return this.isMissiveReceivedByHashHex[missiveHashHex] ? true : false;
    };
    Friendship.prototype.markIsMissiveReceived = function (missive) {
        var missiveHashHex = missive.getHash().uu.toHex();
        this.isMissiveReceivedByHashHex[missiveHashHex] = true;
    };
    Friendship.prototype.banAndDestroy = function (reason) {
        this.banReason = reason;
        this.banSnowdrop.emit(this.peerClientId);
        this.destroy(DESTROY_REASON.BAN);
    };
    return Friendship;
}());
exports.Friendship = Friendship;
