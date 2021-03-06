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
var shasta = __importStar(require("pollenium-shasta"));
var missive_1 = require("../templates/missive");
var genEra_1 = require("../utils/genEra");
var genMaxScore_1 = require("../utils/genMaxScore");
var MISSIVE_COVER;
(function (MISSIVE_COVER) {
    MISSIVE_COVER[MISSIVE_COVER["V0"] = 69] = "V0";
})(MISSIVE_COVER = exports.MISSIVE_COVER || (exports.MISSIVE_COVER = {}));
var Missive = (function () {
    function Missive(struct) {
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
                applicationData: this.applicationData.u,
            },
        }));
    };
    Missive.prototype.getHash = function () {
        return new pollenium_buttercup_1.Uint256(shasta.genSha256(this.getEncoding().unwrap()));
    };
    Missive.prototype.getScore = function () {
        return new pollenium_buttercup_1.Uint256(this.getHash());
    };
    Missive.prototype.getEra = function () {
        return genEra_1.genEra(this.timestamp.toNumber());
    };
    Missive.prototype.getMaxScore = function () {
        return genMaxScore_1.genMaxScore({
            difficulty: this.difficulty,
            cover: this.cover,
            applicationDataLength: this.applicationData.u.length,
        });
    };
    Missive.prototype.getIsValid = function () {
        if (this.version !== missive_1.MISSIVE_KEY.V0) {
            return false;
        }
        if (this.getScore().compGt(this.getMaxScore())) {
            return false;
        }
        return true;
    };
    Missive.fromHenpojo = function (henpojo) {
        switch (henpojo.key) {
            case missive_1.MISSIVE_KEY.V0: {
                var v0Henpojo = henpojo.value;
                return new Missive({
                    version: henpojo.key,
                    timestamp: new pollenium_buttercup_1.Uint40(v0Henpojo.timestamp),
                    difficulty: v0Henpojo.difficulty[0],
                    nonce: v0Henpojo.nonce,
                    applicationId: v0Henpojo.applicationId,
                    applicationData: v0Henpojo.applicationData,
                });
            }
            default:
                throw new Error('Unhandled MISSIVE_KEY');
        }
    };
    Missive.fromEncoding = function (encoding) {
        return Missive.fromHenpojo(missive_1.missiveTemplate.decode(pollenium_uvaursi_1.Uu.wrap(encoding).unwrap()));
    };
    return Missive;
}());
exports.Missive = Missive;
//# sourceMappingURL=Missive.js.map