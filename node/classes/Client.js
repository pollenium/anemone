"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Friend_1 = require("./Friend");
var Extrovert_1 = require("./Extrovert");
var Introvert_1 = require("./Introvert");
var SignalingClient_1 = require("./SignalingClient");
var events_1 = __importDefault(require("events"));
var Bytes_1 = require("./Bytes");
var delay_1 = __importDefault(require("delay"));
var bn_js_1 = __importDefault(require("bn.js"));
var ClientDefaultOptions_1 = require("./ClientDefaultOptions");
var Client = (function (_super) {
    __extends(Client, _super);
    function Client(options) {
        var _this = _super.call(this) || this;
        _this.signalingClients = [];
        _this.extroverts = [];
        _this.introverts = [];
        _this.offers = [];
        _this.answer = [];
        _this.signalingClientsByOfferIdHex = {};
        _this.friendStatusByClientNonceHex = {};
        _this.offersReceivedByClientNonceHex = {};
        _this.isFlushedOfferByOfferIdHex = {};
        _this.friendMessageIsReceivedByIdHexByEra = {};
        _this.options = Object.assign(new ClientDefaultOptions_1.ClientDefaultOptions, options);
        _this.signalTimeoutMs = _this.options.signalTimeout * 1000;
        _this.friendMessageLatencyToleranceBn = new bn_js_1.default(_this.options.friendMessageLatencyTolerance);
        _this.nonce = Bytes_1.Bytes.random(32);
        _this.bootstrap();
        return _this;
    }
    Client.prototype.bootstrap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, signalingServerUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (i = 0; i < this.options.signalingServerUrls.length; i++) {
                            signalingServerUrl = this.options.signalingServerUrls[i];
                            this.addSignalingClient(signalingServerUrl);
                        }
                        return [4, this.loopCreateFriend()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Client.prototype.loopCreateFriend = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.extroverts.length + this.introverts.length >= this.options.friendsMax) {
                            return [2];
                        }
                        return [4, this.createFriend()];
                    case 1:
                        _a.sent();
                        this.loopCreateFriend();
                        return [2];
                }
            });
        });
    };
    Client.prototype.getFriendsCount = function () {
        return this.introverts.length + this.extroverts.length;
    };
    Client.prototype.createFriend = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer, offer2, extrovert, introvert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.getFriendsCount() === this.options.friendsMax) {
                            return [2];
                        }
                        offer = this.popConnectableOffer();
                        if (offer !== null) {
                            this.introverts.push(new Introvert_1.Introvert(this, offer));
                        }
                        return [4, delay_1.default(this.options.bootstrapOffersTimeout * 1000)];
                    case 1:
                        _a.sent();
                        if (this.getFriendsCount() === this.options.friendsMax) {
                            return [2];
                        }
                        offer2 = this.popConnectableOffer();
                        if (offer2 === null) {
                            extrovert = new Extrovert_1.Extrovert(this);
                            this.extroverts.push(extrovert);
                            this.emit('extrovert', extrovert);
                            this.emit('friend', extrovert);
                        }
                        else {
                            introvert = new Introvert_1.Introvert(this, offer2);
                            this.introverts.push(introvert);
                            this.emit('introvert', introvert);
                            this.emit('friend', introvert);
                        }
                        return [2];
                }
            });
        });
    };
    Client.prototype.addSignalingClient = function (signalingServerUrl) {
        var _this = this;
        var signalingClient = new SignalingClient_1.SignalingClient(this, signalingServerUrl);
        this.signalingClients.push(signalingClient);
        signalingClient.on('offer', function (offer) {
            _this.handleOffer(signalingClient, offer);
        });
        signalingClient.on('answer', function (answer) {
            _this.handleAnswer(signalingClient, answer);
        });
        signalingClient.on('flushOffer', function (flushOffer) {
            _this.handleFlushOffer(signalingClient, flushOffer);
        });
    };
    Client.prototype.popConnectableOffer = function () {
        var _this = this;
        var connectableOfferIndex = this.offers.findIndex(function (offer) {
            return _this.getIsConnectableByClientNonce(offer.clientNonce);
        });
        if (connectableOfferIndex === -1) {
            return null;
        }
        var offer = this.offers.splice(connectableOfferIndex, 1)[0];
        if (this.isFlushedOfferByOfferIdHex[offer.getId().getHex()]) {
            return this.popConnectableOffer();
        }
        return offer;
    };
    Client.prototype.fetchExtrovertsByOfferIdHex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var extrovertsByOfferIdHex;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        extrovertsByOfferIdHex = {};
                        return [4, Promise.all(this.extroverts.map(function (extrovert) { return __awaiter(_this, void 0, void 0, function () {
                                var offer;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, extrovert.fetchOffer()];
                                        case 1:
                                            offer = _a.sent();
                                            extrovertsByOfferIdHex[offer.getId().getHex()] = extrovert;
                                            return [2];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2, extrovertsByOfferIdHex];
                }
            });
        });
    };
    Client.prototype.handleOffer = function (signalingClient, offer) {
        var _this = this;
        if (this.isFlushedOfferByOfferIdHex[offer.getId().getHex()]) {
            return;
        }
        if (this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] === undefined) {
            this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] = 1;
        }
        else {
            this.offersReceivedByClientNonceHex[offer.clientNonce.getHex()] += 1;
        }
        if (this.nonce.equals(offer.clientNonce)) {
            return;
        }
        var offerIdHex = offer.getId().getHex();
        this.signalingClientsByOfferIdHex[offerIdHex] = signalingClient;
        this.offers = this.offers.filter(function (_offer) {
            return !offer.clientNonce.equals(_offer.clientNonce);
        });
        this.offers.unshift(offer);
        this.offers = this.offers.sort(function (offerA, offerB) {
            var distanceA = offerA.getDistance(_this.nonce);
            var distanceB = offerB.getDistance(_this.nonce);
            return distanceB.compare(distanceA);
        });
        if (this.getIsConnectableByClientNonce(offer.clientNonce)) {
            var peeredFriends = this.getPeeredFriends();
            if (peeredFriends.length === this.options.friendsMax) {
                var offerDistance = offer.getDistance(this.nonce);
                var worstFriend = this.getWorstFriend();
                var worstFriendDistance = worstFriend.getDistance();
                if (worstFriendDistance.compare(offerDistance) === 1) {
                    worstFriend.destroy();
                }
            }
        }
        this.createFriend();
    };
    Client.prototype.getPeeredFriends = function () {
        return this.getFriends().filter(function (friend) {
            return friend.peerClientNonce !== undefined;
        });
    };
    Client.prototype.getWorstFriend = function () {
        var peeredFriends = this.getPeeredFriends();
        if (peeredFriends.length === 0) {
            return null;
        }
        return peeredFriends.sort(function (friendA, friendB) {
            var distanceA = friendA.getDistance();
            var distanceB = friendB.getDistance();
            return distanceA.compare(distanceB);
        })[0];
    };
    Client.prototype.handleFlushOffer = function (signalingClient, flushOffer) {
        this.isFlushedOfferByOfferIdHex[flushOffer.offerId.getHex()] = true;
        this.offers = this.offers.filter(function (_offer) {
            return !flushOffer.offerId.equals(_offer.getId());
        });
        this.introverts.forEach(function (introvert) {
            if (introvert.offer.getId().equals(flushOffer.offerId)) {
                introvert.destroy();
            }
        });
    };
    Client.prototype.getFriends = function () {
        var friends = [];
        friends.push.apply(friends, this.extroverts);
        friends.push.apply(friends, this.introverts);
        return friends;
    };
    Client.prototype.handleAnswer = function (signalingClient, answer) {
        return __awaiter(this, void 0, void 0, function () {
            var extrovertsByOfferIdHex, extrovert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchExtrovertsByOfferIdHex()];
                    case 1:
                        extrovertsByOfferIdHex = _a.sent();
                        extrovert = extrovertsByOfferIdHex[answer.offerId.getHex()];
                        if (!extrovert) {
                            return [2];
                        }
                        if (!this.getIsConnectableByClientNonce(answer.clientNonce)) {
                            return [2];
                        }
                        if (extrovert.status === Friend_1.FRIEND_STATUS.DEFAULT) {
                            extrovert.handleAnswer(answer);
                        }
                        return [2];
                }
            });
        });
    };
    Client.prototype.getFriendStatusByClientNonce = function (clientNonce) {
        var friendStatus = this.friendStatusByClientNonceHex[clientNonce.getHex()];
        if (friendStatus === undefined) {
            return Friend_1.FRIEND_STATUS.DEFAULT;
        }
        return friendStatus;
    };
    Client.prototype.getIsConnectableByClientNonce = function (clientNonce) {
        if (clientNonce.equals(this.nonce)) {
            return false;
        }
        switch (this.getFriendStatusByClientNonce(clientNonce)) {
            case Friend_1.FRIEND_STATUS.DEFAULT:
            case Friend_1.FRIEND_STATUS.DESTROYED:
                return true;
            case Friend_1.FRIEND_STATUS.CONNECTING:
            case Friend_1.FRIEND_STATUS.CONNECTED:
                return false;
            default:
                throw new Error('Unkown FRIEND_STATUS');
        }
    };
    Client.prototype.setFriendStatusByClientNonce = function (clientNonce, friendStatus) {
        this.friendStatusByClientNonceHex[clientNonce.getHex()] = friendStatus;
    };
    Client.prototype.getIsFullyConnected = function () {
        if (this.extroverts.length + this.introverts.length < this.options.friendsMax) {
            return false;
        }
        for (var i = 0; i < this.extroverts.length; i++) {
            if (this.extroverts[i].status !== Friend_1.FRIEND_STATUS.CONNECTED) {
                return false;
            }
        }
        for (var i = 0; i < this.introverts.length; i++) {
            if (this.introverts[i].status !== Friend_1.FRIEND_STATUS.CONNECTED) {
                return false;
            }
        }
        return true;
    };
    return Client;
}(events_1.default));
exports.Client = Client;
//# sourceMappingURL=Client.js.map