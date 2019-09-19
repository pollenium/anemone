"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bytes_1 = require("./Bytes");
var FriendMessage_1 = require("./FriendMessage");
var utils_1 = require("../utils");
var friendMessage_1 = require("../templates/friendMessage");
var HashcashResolution_1 = require("../interfaces/HashcashResolution");
var nullNonce = (new Uint8Array(32)).fill(0);
var FriendMessageGenerator = (function () {
    function FriendMessageGenerator(client, applicationId, applicationData, difficulty) {
        this.client = client;
        this.applicationId = applicationId;
        this.applicationData = applicationData;
        this.difficulty = difficulty;
    }
    FriendMessageGenerator.prototype.getNoncelessPrehash = function (timestamp) {
        var encoding = friendMessage_1.friendMessageTemplate.encode({
            key: friendMessage_1.FRIEND_MESSAGE_KEY.V0,
            value: {
                nonce: nullNonce,
                difficulty: new Uint8Array([this.difficulty]),
                timestamp: timestamp.uint8Array,
                applicationId: this.applicationId.uint8Array,
                applicationData: this.applicationData.uint8Array
            }
        });
        return new Bytes_1.Bytes(encoding.slice(0, encoding.length - 32));
    };
    FriendMessageGenerator.prototype.fetchNonce = function (timestamp) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var worker = new _this.client.options.Worker(_this.client.options.hashcashWorkerUrl, [], { esm: true });
            var onMessage = function (event) { return __awaiter(_this, void 0, void 0, function () {
                var hashcashResolution, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            worker.terminate();
                            hashcashResolution = event.data;
                            _a = hashcashResolution.key;
                            switch (_a) {
                                case HashcashResolution_1.HASHCASH_RESOLUTION_KEY.NONCE_HEX: return [3, 1];
                                case HashcashResolution_1.HASHCASH_RESOLUTION_KEY.TIMEOUT_ERROR: return [3, 2];
                            }
                            return [3, 4];
                        case 1:
                            resolve(Bytes_1.Bytes.fromHex(hashcashResolution.value));
                            return [3, 5];
                        case 2:
                            _b = resolve;
                            return [4, this.fetchNonce(timestamp)];
                        case 3:
                            _b.apply(void 0, [_c.sent()]);
                            return [3, 5];
                        case 4: throw new Error('Unhandled HASHCASH_RESOLUTION_KEY');
                        case 5: return [2];
                    }
                });
            }); };
            worker.addEventListener('message', onMessage);
            worker.onerror = function (error) {
                reject(error);
            };
            var timeoutAt = utils_1.getNow() + 5;
            var noncelessPrehash = _this.getNoncelessPrehash(timestamp);
            var hashcashRequest = {
                noncelessPrehashHex: noncelessPrehash.getHex(),
                difficulty: _this.difficulty,
                timeoutAt: timeoutAt
            };
            worker.postMessage(hashcashRequest);
        });
    };
    FriendMessageGenerator.prototype.fetchFriendMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = utils_1.getTimestamp();
                        return [4, this.fetchNonce(timestamp)];
                    case 1:
                        nonce = _a.sent();
                        return [2, new FriendMessage_1.FriendMessage(this.client, friendMessage_1.FRIEND_MESSAGE_KEY.V0, timestamp, this.difficulty, nonce, this.applicationId, this.applicationData)];
                }
            });
        });
    };
    return FriendMessageGenerator;
}());
exports.FriendMessageGenerator = FriendMessageGenerator;
//# sourceMappingURL=FriendMessageGenerator.js.map