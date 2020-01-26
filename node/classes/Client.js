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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Friendship_1 = require("./Friendship");
var Extrovert_1 = require("./Extrovert");
var Introvert_1 = require("./Introvert");
var SignalingClient_1 = require("./SignalingClient");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var delay_1 = __importDefault(require("delay"));
var ClientDefaultOptions_1 = require("./ClientDefaultOptions");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var Client = (function () {
    function Client(options) {
        this.signalingClients = [];
        this.extroverts = [];
        this.introverts = [];
        this.offers = [];
        this.answer = [];
        this.signalingClientsByOfferIdHex = {};
        this.friendshipStatusByClientNonceHex = {};
        this.offersReceivedByClientNonceHex = {};
        this.isFlushedOfferByOfferIdHex = {};
        this.missiveIsReceivedByIdHexByEra = {};
        this.friendshipStatusSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.extrovertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.introvertSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.options = Object.assign(new ClientDefaultOptions_1.ClientDefaultOptions, options);
        this.nonce = pollenium_uvaursi_1.Uu.genRandom(32);
        this.bootstrap();
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
                        return [4, this.loopCreateFriendship()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Client.prototype.loopCreateFriendship = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.extroverts.length + this.introverts.length >= this.options.friendshipsMax) {
                            return [2];
                        }
                        return [4, this.createFriendship()];
                    case 1:
                        _a.sent();
                        this.loopCreateFriendship();
                        return [2];
                }
            });
        });
    };
    Client.prototype.getFriendshipsCount = function () {
        return this.introverts.length + this.extroverts.length;
    };
    Client.prototype.createFriendship = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer, offer2, extrovert, introvert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.getFriendshipsCount() === this.options.friendshipsMax) {
                            return [2];
                        }
                        offer = this.popConnectableOffer();
                        if (offer !== null) {
                            this.introverts.push(new Introvert_1.Introvert(this, offer));
                        }
                        return [4, delay_1.default(this.options.bootstrapOffersTimeout * 1000)];
                    case 1:
                        _a.sent();
                        if (this.getFriendshipsCount() === this.options.friendshipsMax) {
                            return [2];
                        }
                        offer2 = this.popConnectableOffer();
                        if (offer2 === null) {
                            extrovert = new Extrovert_1.Extrovert(this);
                            this.extroverts.push(extrovert);
                            this.extrovertSnowdrop.emitIfHandle(extrovert);
                        }
                        else {
                            introvert = new Introvert_1.Introvert(this, offer2);
                            this.introverts.push(introvert);
                            this.introvertSnowdrop.emitIfHandle(introvert);
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
        signalingClient.offerSnowdrop.addHandle(function (offer) {
            _this.handleOffer(signalingClient, offer);
        });
        signalingClient.answerSnowdrop.addHandle(function (answer) {
            _this.handleAnswer(signalingClient, answer);
        });
        signalingClient.flushOfferSnowdrop.addHandle(function (flushOffer) {
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
        if (this.isFlushedOfferByOfferIdHex[offer.getId().toHex()]) {
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
                                            extrovertsByOfferIdHex[offer.getId().toHex()] = extrovert;
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
        if (this.isFlushedOfferByOfferIdHex[offer.getId().toHex()]) {
            return;
        }
        if (this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] === undefined) {
            this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] = 1;
        }
        else {
            this.offersReceivedByClientNonceHex[offer.clientNonce.toHex()] += 1;
        }
        if (this.nonce.getIsEqual(offer.clientNonce)) {
            return;
        }
        var offerIdHex = offer.getId().toHex();
        this.signalingClientsByOfferIdHex[offerIdHex] = signalingClient;
        this.offers = this.offers.filter(function (_offer) {
            return !offer.clientNonce.getIsEqual(_offer.clientNonce);
        });
        this.offers.unshift(offer);
        this.offers = this.offers.sort(function (offerA, offerB) {
            var distanceA = offerA.getDistance(_this.nonce);
            var distanceB = offerB.getDistance(_this.nonce);
            return distanceB.compGt(distanceA) ? 1 : -1;
        });
        if (this.getIsConnectableByClientNonce(offer.clientNonce)) {
            var peeredFriendships = this.getPeeredFriendships();
            if (peeredFriendships.length === this.options.friendshipsMax) {
                var offerDistance = offer.getDistance(this.nonce);
                var worstFriendship = this.getWorstFriendship();
                var worstFriendshipDistance = worstFriendship.getDistance();
                if (worstFriendshipDistance.compGt(offerDistance)) {
                    worstFriendship.destroy();
                }
            }
        }
        this.createFriendship();
    };
    Client.prototype.getPeeredFriendships = function () {
        return this.getFriendships().filter(function (friendship) {
            return friendship.peerClientNonce !== undefined;
        });
    };
    Client.prototype.getWorstFriendship = function () {
        var peeredFriendships = this.getPeeredFriendships();
        if (peeredFriendships.length === 0) {
            return null;
        }
        return peeredFriendships.sort(function (friendshipA, friendshipB) {
            var distanceA = friendshipA.getDistance();
            var distanceB = friendshipB.getDistance();
            return distanceA.compGt(distanceB) ? 1 : -1;
        })[0];
    };
    Client.prototype.handleFlushOffer = function (signalingClient, flushOffer) {
        this.isFlushedOfferByOfferIdHex[flushOffer.offerId.toHex()] = true;
        this.offers = this.offers.filter(function (_offer) {
            return !flushOffer.offerId.getIsEqual(_offer.getId());
        });
        this.introverts.forEach(function (introvert) {
            if (introvert.offer.getId().getIsEqual(flushOffer.offerId)) {
                introvert.destroy();
            }
        });
    };
    Client.prototype.getFriendships = function () {
        var friendships = [];
        friendships.push.apply(friendships, this.extroverts);
        friendships.push.apply(friendships, this.introverts);
        return friendships;
    };
    Client.prototype.handleAnswer = function (signalingClient, answer) {
        return __awaiter(this, void 0, void 0, function () {
            var extrovertsByOfferIdHex, extrovert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchExtrovertsByOfferIdHex()];
                    case 1:
                        extrovertsByOfferIdHex = _a.sent();
                        extrovert = extrovertsByOfferIdHex[answer.offerId.toHex()];
                        if (!extrovert) {
                            return [2];
                        }
                        if (!this.getIsConnectableByClientNonce(answer.clientNonce)) {
                            return [2];
                        }
                        if (extrovert.status === Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
                            extrovert.handleAnswer(answer);
                        }
                        return [2];
                }
            });
        });
    };
    Client.prototype.getFriendshipStatusByClientNonce = function (clientNonceUish) {
        var clientNonce = pollenium_uvaursi_1.Uu.wrap(clientNonceUish);
        var friendshipStatus = this.friendshipStatusByClientNonceHex[clientNonce.toHex()];
        if (friendshipStatus === undefined) {
            return Friendship_1.FRIENDSHIP_STATUS.DEFAULT;
        }
        return friendshipStatus;
    };
    Client.prototype.getIsConnectableByClientNonce = function (clientNonceUish) {
        var clientNonce = pollenium_uvaursi_1.Uu.wrap(clientNonceUish);
        if (clientNonce.getIsEqual(this.nonce)) {
            return false;
        }
        switch (this.getFriendshipStatusByClientNonce(clientNonce)) {
            case Friendship_1.FRIENDSHIP_STATUS.DEFAULT:
            case Friendship_1.FRIENDSHIP_STATUS.DESTROYED:
                return true;
            case Friendship_1.FRIENDSHIP_STATUS.CONNECTING:
            case Friendship_1.FRIENDSHIP_STATUS.CONNECTED:
                return false;
            default:
                throw new Error('Unkown FRIENDSHIP_STATUS');
        }
    };
    Client.prototype.setFriendshipStatusByClientNonce = function (clientNonceUish, friendshipStatus) {
        var clientNonce = pollenium_uvaursi_1.Uu.wrap(clientNonceUish);
        this.friendshipStatusByClientNonceHex[clientNonce.toHex()] = friendshipStatus;
    };
    Client.prototype.getIsFullyConnected = function () {
        if (this.extroverts.length + this.introverts.length < this.options.friendshipsMax) {
            return false;
        }
        for (var i = 0; i < this.extroverts.length; i++) {
            if (this.extroverts[i].status !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                return false;
            }
        }
        for (var i = 0; i < this.introverts.length; i++) {
            if (this.introverts[i].status !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                return false;
            }
        }
        return true;
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map