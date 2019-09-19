"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var friendMessage_1 = require("../templates/friendMessage");
var utils_1 = require("../utils");
var bn_js_1 = __importDefault(require("bn.js"));
var FriendMessage = (function () {
    function FriendMessage(client, version, timestamp, difficulty, nonce, applicationId, applicationData) {
        this.client = client;
        this.version = version;
        this.timestamp = timestamp;
        this.difficulty = difficulty;
        this.nonce = nonce;
        this.applicationId = applicationId;
        this.applicationData = applicationData;
    }
    FriendMessage.prototype.getEncoding = function () {
        return new Bytes_1.Bytes(friendMessage_1.friendMessageTemplate.encode({
            key: friendMessage_1.FRIEND_MESSAGE_KEY.V0,
            value: {
                timestamp: this.timestamp.uint8Array,
                difficulty: new Uint8Array([this.difficulty]),
                applicationId: this.applicationId.uint8Array,
                nonce: this.nonce.uint8Array,
                applicationData: this.applicationData.uint8Array
            }
        }));
    };
    FriendMessage.prototype.getId = function () {
        return this.getEncoding().getHash();
    };
    FriendMessage.prototype.getEra = function () {
        return utils_1.calculateEra(this.timestamp.getNumber());
    };
    FriendMessage.prototype.getIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().getHex();
        if (this.client.friendMessageIsReceivedByIdHexByEra[era] === undefined) {
            return false;
        }
        return this.client.friendMessageIsReceivedByIdHexByEra[era][idHex] === true;
    };
    FriendMessage.prototype.markIsReceived = function () {
        var era = this.getEra();
        var idHex = this.getId().getHex();
        if (this.client.friendMessageIsReceivedByIdHexByEra[era] === undefined) {
            this.client.friendMessageIsReceivedByIdHexByEra[era] = {};
        }
        this.client.friendMessageIsReceivedByIdHexByEra[era][idHex] = true;
    };
    FriendMessage.prototype.getMaxHash = function () {
        return utils_1.getMaxHash(this.difficulty, this.getEncoding().getLength());
    };
    FriendMessage.prototype.getIsValid = function () {
        if (this.version !== friendMessage_1.FRIEND_MESSAGE_KEY.V0) {
            return false;
        }
        var now = utils_1.getNow();
        var nowBn = new bn_js_1.default(now);
        var timestampBn = this.timestamp.getBn();
        if (timestampBn.lt(nowBn.sub(this.client.friendMessageLatencyToleranceBn))) {
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
    FriendMessage.prototype.broadcast = function () {
        var _this = this;
        this.markIsReceived();
        this.client.getFriends().forEach(function (friend) {
            friend.send(_this.getEncoding());
        });
    };
    FriendMessage.fromHenpojo = function (client, henpojo) {
        switch (henpojo.key) {
            case friendMessage_1.FRIEND_MESSAGE_KEY.V0: {
                var v0Henpojo = henpojo.value;
                return new FriendMessage(client, henpojo.key, new Bytes_1.Bytes(v0Henpojo.timestamp), v0Henpojo.difficulty[0], new Bytes_1.Bytes(v0Henpojo.nonce), new Bytes_1.Bytes(v0Henpojo.applicationId), new Bytes_1.Bytes(v0Henpojo.applicationData));
            }
            default:
                throw new Error('Unhandled FRIEND_MESSAGE_KEY');
        }
    };
    FriendMessage.fromEncoding = function (client, encoding) {
        return FriendMessage.fromHenpojo(client, friendMessage_1.friendMessageTemplate.decode(encoding.uint8Array));
    };
    return FriendMessage;
}());
exports.FriendMessage = FriendMessage;
//# sourceMappingURL=FriendMessage.js.map