"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var Friendship_1 = require("./Friendship");
var missive_1 = require("../templates/missive");
var utils_1 = require("../utils");
var bn_js_1 = __importDefault(require("bn.js"));
var MISSIVE_COVER;
(function (MISSIVE_COVER) {
    MISSIVE_COVER[MISSIVE_COVER["V0"] = 69] = "V0";
})(MISSIVE_COVER = exports.MISSIVE_COVER || (exports.MISSIVE_COVER = {}));
var Missive = (function () {
    function Missive(client, version, timestamp, difficulty, nonce, applicationId, applicationData) {
        this.client = client;
        this.version = version;
        this.timestamp = timestamp;
        this.difficulty = difficulty;
        this.nonce = nonce;
        this.applicationId = applicationId;
        this.applicationData = applicationData;
        this.cover = MISSIVE_COVER.V0;
    }
    Missive.prototype.getEncoding = function () {
        return new Bytes_1.Bytes(missive_1.missiveTemplate.encode({
            key: missive_1.MISSIVE_KEY.V0,
            value: {
                timestamp: this.timestamp.uint8Array,
                difficulty: new Uint8Array([this.difficulty]),
                applicationId: this.applicationId.uint8Array,
                nonce: this.nonce.uint8Array,
                applicationData: this.applicationData.uint8Array
            }
        }));
    };
    Missive.prototype.getId = function () {
        return this.getEncoding().getHash();
    };
    Missive.prototype.getEra = function () {
        return utils_1.calculateEra(this.timestamp.getNumber());
    };
    Missive.prototype.getIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().getHex();
        if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
            return false;
        }
        return this.client.missiveIsReceivedByIdHexByEra[era][idHex] === true;
    };
    Missive.prototype.markIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().getHex();
        if (this.client.missiveIsReceivedByIdHexByEra[era] === undefined) {
            this.client.missiveIsReceivedByIdHexByEra[era] = {};
        }
        this.client.missiveIsReceivedByIdHexByEra[era][idHex] = true;
    };
    Missive.prototype.getMaxHash = function () {
        return utils_1.getMaxHash(this.difficulty, this.cover, this.applicationData.getLength());
    };
    Missive.prototype.getIsValid = function () {
        if (this.version !== missive_1.MISSIVE_KEY.V0) {
            return false;
        }
        var now = utils_1.getNow();
        var nowBn = new bn_js_1.default(now);
        var timestampBn = this.timestamp.getBn();
        if (timestampBn.lt(nowBn.sub(this.client.missiveLatencyToleranceBn))) {
            return false;
        }
        if (timestampBn.gt(nowBn)) {
            return false;
        }
        if (this.getIsReceived()) {
            return false;
        }
        if (this.getId().getBn().gt(this.getMaxHash().getBn())) {
            return false;
        }
        return true;
    };
    Missive.prototype.broadcast = function () {
        var _this = this;
        this.markIsReceived();
        this.client.getFriendships().forEach(function (friendship) {
            if (friendship.status !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                return;
            }
            friendship.send(_this.getEncoding());
        });
    };
    Missive.fromHenpojo = function (client, henpojo) {
        switch (henpojo.key) {
            case missive_1.MISSIVE_KEY.V0: {
                var v0Henpojo = henpojo.value;
                return new Missive(client, henpojo.key, new Bytes_1.Bytes(v0Henpojo.timestamp), v0Henpojo.difficulty[0], new Bytes_1.Bytes(v0Henpojo.nonce), new Bytes_1.Bytes(v0Henpojo.applicationId), new Bytes_1.Bytes(v0Henpojo.applicationData));
            }
            default:
                throw new Error('Unhandled MISSIVE_KEY');
        }
    };
    Missive.fromEncoding = function (client, encoding) {
        return Missive.fromHenpojo(client, missive_1.missiveTemplate.decode(encoding.uint8Array));
    };
    return Missive;
}());
exports.Missive = Missive;
//# sourceMappingURL=Missive.js.map