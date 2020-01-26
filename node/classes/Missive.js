"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var missive_1 = require("../templates/missive");
var utils_1 = require("../utils");
var shasta = __importStar(require("pollenium-shasta"));
var MISSIVE_COVER;
(function (MISSIVE_COVER) {
    MISSIVE_COVER[MISSIVE_COVER["V0"] = 69] = "V0";
})(MISSIVE_COVER = exports.MISSIVE_COVER || (exports.MISSIVE_COVER = {}));
var Missive = (function () {
    function Missive(client, struct) {
        this.client = client;
        this.cover = MISSIVE_COVER.V0;
        this.version = struct.version;
        this.nonce = pollenium_uvaursi_1.Uu.wrap(struct.nonce);
        this.applicationId = new pollenium_buttercup_1.Bytes32(struct.applicationId);
        this.applicationData = pollenium_uvaursi_1.Uu.wrap(struct.applicationData);
        this.timestamp = pollenium_buttercup_1.Uint40.fromUintable(struct.timestamp);
        this.difficulty = pollenium_buttercup_1.Uint8.fromUintable(struct.difficulty);
    }
    Missive.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(missive_1.missiveTemplate.encode({
            key: missive_1.MISSIVE_KEY.V0,
            value: {
                timestamp: this.timestamp.u,
                difficulty: this.difficulty.u,
                applicationId: this.applicationId.u,
                nonce: this.nonce.u,
                applicationData: this.applicationData.u
            }
        }));
    };
    Missive.prototype.getId = function () {
        return this.getHash();
    };
    Missive.prototype.getHash = function () {
        return new pollenium_buttercup_1.Uint256(shasta.genSha256(this.getEncoding().unwrap()));
    };
    Missive.prototype.getEra = function () {
        return utils_1.genEra(this.timestamp.toNumber());
    };
    Missive.prototype.getIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().uu.toHex();
        if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
            return false;
        }
        return this.client.missiveIsReceivedByIdHexByEra[era][idHex] === true;
    };
    Missive.prototype.markIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().uu.toHex();
        if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
            this.client.missiveIsReceivedByIdHexByEra[era] = {};
        }
        this.client.missiveIsReceivedByIdHexByEra[era][idHex] = true;
    };
    Missive.prototype.getMaxHash = function () {
        return utils_1.genMaxHash({
            difficulty: this.difficulty,
            cover: this.cover,
            applicationDataLength: this.applicationData.u.length
        });
    };
    Missive.prototype.getIsValid = function () {
        if (this.version !== missive_1.MISSIVE_KEY.V0) {
            return false;
        }
        var timestamp = utils_1.genTimestamp();
        if (this.timestamp.compLt(timestamp.opSub(this.client.options.missiveLatencyTolerance))) {
            return false;
        }
        if (this.timestamp.compGt(timestamp)) {
            return false;
        }
        if (this.getIsReceived()) {
            return false;
        }
        if (this.getHash().compGt(this.getMaxHash())) {
            return false;
        }
        return true;
    };
    Missive.prototype.broadcast = function () {
        var _this = this;
        this.markIsReceived();
        this.client.getFriendships().forEach(function (friendship) {
            if (!friendship.getIsSendable()) {
                return;
            }
            friendship.send(_this.getEncoding());
        });
    };
    Missive.fromHenpojo = function (client, henpojo) {
        switch (henpojo.key) {
            case missive_1.MISSIVE_KEY.V0: {
                var v0Henpojo = henpojo.value;
                return new Missive(client, {
                    version: henpojo.key,
                    timestamp: new pollenium_buttercup_1.Uint40(v0Henpojo.timestamp),
                    difficulty: v0Henpojo.difficulty[0],
                    nonce: v0Henpojo.nonce,
                    applicationId: v0Henpojo.applicationId,
                    applicationData: v0Henpojo.applicationData
                });
            }
            default:
                throw new Error('Unhandled MISSIVE_KEY');
        }
    };
    Missive.fromEncoding = function (client, encoding) {
        return Missive.fromHenpojo(client, missive_1.missiveTemplate.decode(pollenium_uvaursi_1.Uu.wrap(encoding).unwrap()));
    };
    return Missive;
}());
exports.Missive = Missive;
//# sourceMappingURL=Missive.js.map