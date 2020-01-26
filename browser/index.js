(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pollenium = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var signalingMessage_1 = require("../templates/signalingMessage");
var Answer = (function () {
    function Answer(struct) {
        this.clientNonce = pollenium_uvaursi_1.Uu.wrap(struct.clientNonce);
        this.offerId = pollenium_uvaursi_1.Uu.wrap(struct.offerId);
        this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
    }
    Answer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER,
            value: {
                clientNonce: this.clientNonce.unwrap(),
                offerId: this.offerId.unwrap(),
                sdpb: this.sdpb.unwrap()
            }
        }));
    };
    Answer.fromHenpojo = function (henpojo) {
        return new Answer({
            clientNonce: henpojo.clientNonce,
            offerId: henpojo.offerId,
            sdpb: henpojo.sdpb
        });
    };
    return Answer;
}());
exports.Answer = Answer;

},{"../templates/signalingMessage":15,"pollenium-uvaursi":77}],2:[function(require,module,exports){
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

},{"./ClientDefaultOptions":3,"./Extrovert":4,"./Friendship":6,"./Introvert":7,"./SignalingClient":11,"delay":35,"pollenium-snowdrop":75,"pollenium-uvaursi":77}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientDefaultOptions = (function () {
    function ClientDefaultOptions() {
        this.signalingServerUrls = [];
        this.signalTimeout = 5;
        this.friendshipsMax = 6;
        this.missiveLatencyTolerance = 30;
        this.bootstrapOffersTimeout = 10;
    }
    return ClientDefaultOptions;
}());
exports.ClientDefaultOptions = ClientDefaultOptions;

},{}],4:[function(require,module,exports){
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
var Friendship_1 = require("./Friendship");
var Offer_1 = require("./Offer");
var FlushOffer_1 = require("./FlushOffer");
var simple_peer_1 = __importDefault(require("simple-peer"));
var utils_1 = require("../utils");
var delay_1 = __importDefault(require("delay"));
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Extrovert = (function (_super) {
    __extends(Extrovert, _super);
    function Extrovert(client) {
        var _this = _super.call(this, client, new simple_peer_1.default({
            initiator: true,
            trickle: false,
            wrtc: client.options.wrtc,
            config: utils_1.genSimplePeerConfig()
        })) || this;
        _this.answers = [];
        _this.loopUploadOffer(1000);
        return _this;
    }
    Extrovert.prototype.loopUploadOffer = function (timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.uploadOffer()];
                    case 1:
                        _a.sent();
                        return [4, delay_1.default(timeout)];
                    case 2:
                        _a.sent();
                        if (this.status === Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
                            this.loopUploadOffer(timeout);
                        }
                        return [2];
                }
            });
        });
    };
    Extrovert.prototype.uploadOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.offersSentAt = utils_1.genNow();
                        return [4, this.fetchOffer()];
                    case 1:
                        offer = _a.sent();
                        this.client.signalingClients.forEach(function (signalingClient) {
                            signalingClient.sendOffer(offer);
                        });
                        return [2];
                }
            });
        });
    };
    Extrovert.prototype.fetchOfferSdp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.offerSdpPromise) {
                    return [2, this.offerSdpPromise];
                }
                this.offerSdpPromise = new Promise(function (resolve) {
                    _this.simplePeer.once('signal', function (signal) {
                        resolve(signal.sdp);
                        setTimeout(function () {
                            if (_this.status === Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
                                _this.destroy();
                            }
                        }, _this.client.options.signalTimeout * 1000 * 2);
                    });
                });
                return [2, this.offerSdpPromise];
            });
        });
    };
    Extrovert.prototype.fetchOfferSdpb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offerSdp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchOfferSdp()];
                    case 1:
                        offerSdp = _a.sent();
                        return [2, pollenium_uvaursi_1.Uu.fromUtf8(offerSdp)];
                }
            });
        });
    };
    Extrovert.prototype.fetchOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Offer_1.Offer.bind;
                        _b = {
                            clientNonce: this.client.nonce
                        };
                        return [4, this.fetchOfferSdpb()];
                    case 1: return [2, new (_a.apply(Offer_1.Offer, [void 0, (_b.sdpb = _c.sent(),
                                _b)]))()];
                }
            });
        });
    };
    Extrovert.prototype.fetchOfferId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchOffer()];
                    case 1:
                        offer = _a.sent();
                        return [2, offer.getId()];
                }
            });
        });
    };
    Extrovert.prototype.handleAnswer = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== Friendship_1.FRIENDSHIP_STATUS.DEFAULT) {
                            throw new Error('Must be in FRIENDSHIP_STATUS.DEFAULT');
                        }
                        if (!this.client.getIsConnectableByClientNonce(answer.clientNonce)) {
                            return [2];
                        }
                        this.peerClientNonce = answer.clientNonce;
                        this.setStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTING);
                        this.simplePeer.signal({
                            type: 'answer',
                            sdp: answer.sdpb.toUtf8()
                        });
                        return [4, delay_1.default(this.client.options.signalTimeout * 1000)];
                    case 1:
                        _a.sent();
                        if (this.status === Friendship_1.FRIENDSHIP_STATUS.CONNECTING) {
                            this.destroy();
                        }
                        return [2];
                }
            });
        });
    };
    Extrovert.prototype.uploadFlushOffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offer, flushOffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchOffer()];
                    case 1:
                        offer = _a.sent();
                        flushOffer = new FlushOffer_1.FlushOffer(offer.getId());
                        this.client.signalingClients.forEach(function (signalingClient) {
                            signalingClient.sendFlushOffer(flushOffer);
                        });
                        return [2];
                }
            });
        });
    };
    Extrovert.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var friendshipIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.uploadFlushOffer()];
                    case 1:
                        _a.sent();
                        friendshipIndex = this.client.extroverts.indexOf(this);
                        this.client.extroverts.splice(friendshipIndex, 1);
                        _super.prototype.destroy.call(this);
                        return [2];
                }
            });
        });
    };
    return Extrovert;
}(Friendship_1.Friendship));
exports.Extrovert = Extrovert;

},{"../utils":16,"./FlushOffer":5,"./Friendship":6,"./Offer":10,"delay":35,"pollenium-uvaursi":77,"simple-peer":106}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var signalingMessage_1 = require("../templates/signalingMessage");
var FlushOffer = (function () {
    function FlushOffer(offerId) {
        this.offerId = pollenium_uvaursi_1.Uu.wrap(offerId);
    }
    FlushOffer.prototype.getEncoding = function () {
        return signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH_OFFER,
            value: {
                offerId: this.offerId.unwrap()
            }
        });
    };
    FlushOffer.prototype.getId = function () {
        return this.getEncoding();
    };
    FlushOffer.fromHenpojo = function (henpojo) {
        return new FlushOffer(henpojo.offerId);
    };
    return FlushOffer;
}());
exports.FlushOffer = FlushOffer;

},{"../templates/signalingMessage":15,"pollenium-uvaursi":77}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
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
        this.createdAt = utils_1.genNow();
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
        return new pollenium_buttercup_1.Uint256(this.peerClientNonce.genXor(this.client.nonce));
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
            var missive = Missive_1.Missive.fromEncoding(_this.client, pollenium_uvaursi_1.Uu.wrap(missiveEncodingBuffer));
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
        this.simplePeer.send(bytes.unwrap());
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

},{"../utils":16,"./Missive":8,"pollenium-buttercup":70,"pollenium-snowdrop":75,"pollenium-uvaursi":77}],7:[function(require,module,exports){
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
var Friendship_1 = require("./Friendship");
var Answer_1 = require("./Answer");
var simple_peer_1 = __importDefault(require("simple-peer"));
var utils_1 = require("../utils");
var delay_1 = __importDefault(require("delay"));
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Introvert = (function (_super) {
    __extends(Introvert, _super);
    function Introvert(client, offer) {
        var _this = _super.call(this, client, new simple_peer_1.default({
            initiator: false,
            trickle: false,
            wrtc: client.options.wrtc,
            config: utils_1.genSimplePeerConfig()
        })) || this;
        _this.offer = offer;
        _this.peerClientNonce = offer.clientNonce;
        _this.connect();
        return _this;
    }
    Introvert.prototype.fetchAnswerSdpb = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.simplePeer.once('signal', function (signal) {
                resolve(pollenium_uvaursi_1.Uu.fromUtf8(signal.sdp));
            });
            _this.simplePeer.signal({
                type: 'offer',
                sdp: _this.offer.sdpb.toUtf8()
            });
        });
    };
    Introvert.prototype.fetchAnswer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Answer_1.Answer.bind;
                        _b = {
                            clientNonce: this.client.nonce,
                            offerId: this.offer.getId()
                        };
                        return [4, this.fetchAnswerSdpb()];
                    case 1: return [2, new (_a.apply(Answer_1.Answer, [void 0, (_b.sdpb = _c.sent(),
                                _b)]))()];
                }
            });
        });
    };
    Introvert.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.setStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTING);
                        return [4, this.fetchAnswer()];
                    case 1:
                        answer = _a.sent();
                        this.client.signalingClientsByOfferIdHex[this.offer.getId().toHex()].sendAnswer(answer);
                        return [4, delay_1.default(this.client.options.signalTimeout * 1000)];
                    case 2:
                        _a.sent();
                        if (this.status === Friendship_1.FRIENDSHIP_STATUS.CONNECTING) {
                            this.destroy();
                        }
                        return [2];
                }
            });
        });
    };
    Introvert.prototype.destroy = function () {
        var friendshipIndex = this.client.introverts.indexOf(this);
        this.client.introverts.splice(friendshipIndex, 1);
        _super.prototype.destroy.call(this);
    };
    return Introvert;
}(Friendship_1.Friendship));
exports.Introvert = Introvert;

},{"../utils":16,"./Answer":1,"./Friendship":6,"delay":35,"pollenium-uvaursi":77,"simple-peer":106}],8:[function(require,module,exports){
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

},{"../templates/missive":14,"../utils":16,"pollenium-buttercup":70,"pollenium-shasta":74,"pollenium-uvaursi":77}],9:[function(require,module,exports){
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
var pollenium_buttercup_1 = require("pollenium-buttercup");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Missive_1 = require("./Missive");
var utils_1 = require("../utils");
var missive_1 = require("../templates/missive");
var HashcashResolution_1 = require("../interfaces/HashcashResolution");
var nullNonce = (new Uint8Array(32)).fill(0);
var MissiveGenerator = (function () {
    function MissiveGenerator(client, struct) {
        this.client = client;
        this.applicationId = pollenium_uvaursi_1.Uu.wrap(struct.applicationId);
        this.applicationData = pollenium_uvaursi_1.Uu.wrap(struct.applicationData);
        this.difficulty = pollenium_buttercup_1.Uint8.fromUintable(struct.difficulty);
    }
    MissiveGenerator.prototype.getNoncelessPrehash = function (timestamp) {
        var encoding = missive_1.missiveTemplate.encode({
            key: missive_1.MISSIVE_KEY.V0,
            value: {
                nonce: nullNonce,
                difficulty: this.difficulty.u,
                timestamp: pollenium_buttercup_1.Uint40.fromUintable(timestamp).u,
                applicationId: this.applicationId.u,
                applicationData: this.applicationData.u
            }
        });
        return new pollenium_uvaursi_1.Uu(encoding.slice(0, encoding.length - 32));
    };
    MissiveGenerator.prototype.fetchNonce = function (timestamp) {
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
                            resolve(new pollenium_buttercup_1.Bytes32(pollenium_uvaursi_1.Uu.fromHexish(hashcashResolution.value)));
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
            var timeoutAt = utils_1.genNow() + 5;
            var noncelessPrehash = _this.getNoncelessPrehash(timestamp);
            var hashcashRequest = {
                noncelessPrehash: noncelessPrehash,
                difficulty: _this.difficulty,
                cover: Missive_1.MISSIVE_COVER.V0,
                applicationDataLength: _this.applicationData.u.length,
                timeoutAt: timeoutAt
            };
            worker.postMessage(hashcashRequest);
        });
    };
    MissiveGenerator.prototype.fetchMissive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = utils_1.genTimestamp();
                        return [4, this.fetchNonce(timestamp)];
                    case 1:
                        nonce = _a.sent();
                        return [2, new Missive_1.Missive(this.client, {
                                version: missive_1.MISSIVE_KEY.V0,
                                timestamp: timestamp,
                                difficulty: this.difficulty,
                                nonce: nonce,
                                applicationId: this.applicationId,
                                applicationData: this.applicationData
                            })];
                }
            });
        });
    };
    return MissiveGenerator;
}());
exports.MissiveGenerator = MissiveGenerator;

},{"../interfaces/HashcashResolution":13,"../templates/missive":14,"../utils":16,"./Missive":8,"pollenium-buttercup":70,"pollenium-uvaursi":77}],10:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var shasta = __importStar(require("pollenium-shasta"));
var signalingMessage_1 = require("../templates/signalingMessage");
var Offer = (function () {
    function Offer(struct) {
        this.clientNonce = pollenium_uvaursi_1.Uu.wrap(struct.clientNonce);
        this.sdpb = pollenium_uvaursi_1.Uu.wrap(struct.sdpb);
    }
    Offer.prototype.getEncoding = function () {
        return pollenium_uvaursi_1.Uu.wrap(signalingMessage_1.signalingMessageTemplate.encode({
            key: signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER,
            value: {
                clientNonce: this.clientNonce.unwrap(),
                sdpb: this.sdpb.unwrap()
            }
        }));
    };
    Offer.prototype.getId = function () {
        return shasta.genSha256(this.getEncoding());
    };
    Offer.prototype.getDistance = function (clientNonce) {
        return new pollenium_buttercup_1.Uint256(this.clientNonce.genXor(clientNonce));
    };
    Offer.fromHenpojo = function (henpojo) {
        return new Offer({
            clientNonce: henpojo.clientNonce,
            sdpb: henpojo.clientNonce
        });
    };
    return Offer;
}());
exports.Offer = Offer;

},{"../templates/signalingMessage":15,"pollenium-buttercup":70,"pollenium-shasta":74,"pollenium-uvaursi":77}],11:[function(require,module,exports){
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
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Offer_1 = require("./Offer");
var FlushOffer_1 = require("./FlushOffer");
var Answer_1 = require("./Answer");
var signalingMessage_1 = require("../templates/signalingMessage");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var SignalingClient = (function () {
    function SignalingClient(client, signalingServerUrl) {
        this.client = client;
        this.signalingServerUrl = signalingServerUrl;
        this.offerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.answerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.flushOfferSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.closeSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.fetchConnection();
    }
    SignalingClient.prototype.fetchConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.wsConnectionPromise) {
                    return [2, this.wsConnectionPromise];
                }
                this.wsConnectionPromise = new Promise(function (resolve, reject) {
                    var wsConnection = new _this.client.options.WebSocket(_this.signalingServerUrl);
                    wsConnection.binaryType = 'arraybuffer';
                    wsConnection.onopen = function () {
                        resolve(wsConnection);
                    };
                    wsConnection.onerror = function (error) {
                        reject(error);
                    };
                    wsConnection.onclose = function () {
                        delete _this.wsConnectionPromise;
                        _this.closeSnowdrop.emitIfHandle();
                    };
                    wsConnection.onmessage = _this.handleWsConnectionMessage.bind(_this);
                });
                return [2, this.wsConnectionPromise];
            });
        });
    };
    SignalingClient.prototype.handleWsConnectionMessage = function (message) {
        var signalingMessageHenpojo = signalingMessage_1.signalingMessageTemplate.decode(new Uint8Array(message.data));
        switch (signalingMessageHenpojo.key) {
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER: {
                var offer = Offer_1.Offer.fromHenpojo(signalingMessageHenpojo.value);
                this.offerSnowdrop.emitIfHandle(offer);
                break;
            }
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER: {
                this.answerSnowdrop.emitIfHandle(Answer_1.Answer.fromHenpojo(signalingMessageHenpojo.value));
                break;
            }
            case signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH_OFFER: {
                this.flushOfferSnowdrop.emitIfHandle(FlushOffer_1.FlushOffer.fromHenpojo(signalingMessageHenpojo.value));
                break;
            }
            default:
                throw new Error('Unhandled key');
        }
    };
    SignalingClient.prototype.send = function (bytes) {
        return __awaiter(this, void 0, void 0, function () {
            var wsConnection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.fetchConnection()];
                    case 1:
                        wsConnection = _a.sent();
                        wsConnection.send(pollenium_uvaursi_1.Uu.wrap(bytes).u);
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendOffer = function (offer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(offer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendAnswer = function (answer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(answer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    SignalingClient.prototype.sendFlushOffer = function (flushOffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.send(flushOffer.getEncoding())];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return SignalingClient;
}());
exports.SignalingClient = SignalingClient;

},{"../templates/signalingMessage":15,"./Answer":1,"./FlushOffer":5,"./Offer":10,"pollenium-snowdrop":75,"pollenium-uvaursi":77}],12:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _utils = __importStar(require("./utils"));
var pollenium_buttercup_1 = require("pollenium-buttercup");
exports.Buttercup = pollenium_buttercup_1.Buttercup;
var Client_1 = require("./classes/Client");
exports.Client = Client_1.Client;
var MissiveGenerator_1 = require("./classes/MissiveGenerator");
exports.MissiveGenerator = MissiveGenerator_1.MissiveGenerator;
exports.utils = _utils;

},{"./classes/Client":2,"./classes/MissiveGenerator":9,"./utils":16,"pollenium-buttercup":70}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HASHCASH_RESOLUTION_KEY;
(function (HASHCASH_RESOLUTION_KEY) {
    HASHCASH_RESOLUTION_KEY[HASHCASH_RESOLUTION_KEY["NONCE_HEX"] = 0] = "NONCE_HEX";
    HASHCASH_RESOLUTION_KEY[HASHCASH_RESOLUTION_KEY["TIMEOUT_ERROR"] = 1] = "TIMEOUT_ERROR";
})(HASHCASH_RESOLUTION_KEY = exports.HASHCASH_RESOLUTION_KEY || (exports.HASHCASH_RESOLUTION_KEY = {}));

},{}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Split_1 = __importDefault(require("hendricks/lib/Split"));
var Dictionary_1 = __importDefault(require("hendricks/lib/Dictionary"));
var Fixed_1 = __importDefault(require("hendricks/lib/Fixed"));
var Dynamic_1 = __importDefault(require("hendricks/lib/Dynamic"));
var fixed1 = new Fixed_1.default(1);
var fixed5 = new Fixed_1.default(5);
var fixed32 = new Fixed_1.default(32);
var dynamic2 = new Dynamic_1.default(2);
var MISSIVE_KEY;
(function (MISSIVE_KEY) {
    MISSIVE_KEY["V0"] = "V0";
})(MISSIVE_KEY = exports.MISSIVE_KEY || (exports.MISSIVE_KEY = {}));
exports.missiveTemplate = new Split_1.default(['V0'], [
    new Dictionary_1.default([
        'timestamp',
        'difficulty',
        'applicationId',
        'applicationData',
        'nonce'
    ], [
        fixed5,
        fixed1,
        fixed32,
        dynamic2,
        fixed32
    ])
]);

},{"hendricks/lib/Dictionary":51,"hendricks/lib/Dynamic":52,"hendricks/lib/Fixed":53,"hendricks/lib/Split":54}],15:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Split_1 = __importDefault(require("hendricks/lib/Split"));
var Dictionary_1 = __importDefault(require("hendricks/lib/Dictionary"));
var Fixed_1 = __importDefault(require("hendricks/lib/Fixed"));
var Dynamic_1 = __importDefault(require("hendricks/lib/Dynamic"));
var fixed32 = new Fixed_1.default(32);
var dynamic2 = new Dynamic_1.default(2);
var SIGNALING_MESSAGE_KEY;
(function (SIGNALING_MESSAGE_KEY) {
    SIGNALING_MESSAGE_KEY["OFFER"] = "OFFER";
    SIGNALING_MESSAGE_KEY["ANSWER"] = "ANSWER";
    SIGNALING_MESSAGE_KEY["FLUSH_OFFER"] = "FLUSH_OFFER";
})(SIGNALING_MESSAGE_KEY = exports.SIGNALING_MESSAGE_KEY || (exports.SIGNALING_MESSAGE_KEY = {}));
exports.signalingMessageTemplate = new Split_1.default([
    SIGNALING_MESSAGE_KEY.OFFER,
    SIGNALING_MESSAGE_KEY.ANSWER,
    SIGNALING_MESSAGE_KEY.FLUSH_OFFER
], [
    new Dictionary_1.default([
        'clientNonce',
        'sdpb'
    ], [
        fixed32,
        dynamic2,
    ]),
    new Dictionary_1.default([
        'clientNonce',
        'offerId',
        'sdpb'
    ], [
        fixed32,
        fixed32,
        dynamic2
    ]),
    new Dictionary_1.default([
        'offerId'
    ], [
        fixed32,
    ])
]);

},{"hendricks/lib/Dictionary":51,"hendricks/lib/Dynamic":52,"hendricks/lib/Fixed":53,"hendricks/lib/Split":54}],16:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var shasta = __importStar(require("pollenium-shasta"));
exports.stunServers = [
    'stun.l.google.com:19302',
    'stun1.l.google.com:19302',
    'stun2.l.google.com:19302',
    'stun3.l.google.com:19302',
    'stun4.l.google.com:19302',
    'global.stun.twilio.com:3478?transport=udp'
];
function genNow() {
    return Math.floor((new Date).getTime() / 1000);
}
exports.genNow = genNow;
function genEra(time) {
    return Math.floor(time / 60);
}
exports.genEra = genEra;
function genSimplePeerConfig() {
    return {
        iceServers: exports.stunServers.sort(function () {
            return Math.random() - .5;
        }).slice(0, 2).map(function (stunServer) {
            return {
                urls: "stun:" + stunServer
            };
        })
    };
}
exports.genSimplePeerConfig = genSimplePeerConfig;
function genTimestamp() {
    return pollenium_buttercup_1.Uint40.fromNumber(genNow());
}
exports.genTimestamp = genTimestamp;
var two256 = pollenium_buttercup_1.Uint256.fromNumber(2);
var twofiftyfive256 = pollenium_buttercup_1.Uint256.fromNumber(255);
function genMaxHash(struct) {
    var difficulty = pollenium_buttercup_1.Uint256.fromUintable(struct.difficulty);
    var cover = pollenium_buttercup_1.Uint256.fromUintable(struct.cover);
    var applicationDataLength = pollenium_buttercup_1.Uint256.fromUintable(struct.applicationDataLength);
    var pow = twofiftyfive256.opSub(difficulty);
    var divisor = cover.opAdd(applicationDataLength);
    var maxHash = two256.opPow(pow).opDiv(divisor);
    return maxHash;
}
exports.genMaxHash = genMaxHash;
function genNonce(struct) {
    var maxHash = genMaxHash({
        difficulty: struct.difficulty,
        cover: struct.cover,
        applicationDataLength: struct.applicationDataLength
    });
    while (true) {
        if (genNow() > struct.timeoutAt) {
            throw new Error('Timeout');
        }
        var nonce = pollenium_uvaursi_1.Uu.genRandom(32);
        var prehash = pollenium_uvaursi_1.Uu.genConcat([nonce, struct.noncelessPrehash]);
        var hash = new pollenium_buttercup_1.Uint256(shasta.genSha256(prehash));
        if (hash.compLte(maxHash)) {
            return new pollenium_buttercup_1.Uint256(nonce);
        }
    }
}
exports.genNonce = genNonce;

},{"pollenium-buttercup":70,"pollenium-shasta":74,"pollenium-uvaursi":77}],17:[function(require,module,exports){
"use strict";

/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};

},{}],18:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:ArgsInstanceError')

},{"testable-error":111}],19:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:ArgumentsLengthError')

},{"testable-error":111}],20:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:DescriptionError')

},{"testable-error":111}],21:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:DescriptionsInstanceError')

},{"testable-error":111}],22:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:LabelTypeError')

},{"testable-error":111}],23:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:Api:TestError')

},{"testable-error":111}],24:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:User:ArgumentInstanceError')

},{"testable-error":111}],25:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:User:ArgumentTypeError')

},{"testable-error":111}],26:[function(require,module,exports){
const createTestableError = require('testable-error')

module.exports = createTestableError('Arguguard:User:ArgumentsLengthError')

},{"testable-error":111}],27:[function(require,module,exports){
const ApiArgumentsLengthError = require('./errors/api/ArgumentsLength')
const ApiLabelTypeError = require('./errors/api/LabelType')
const ApiArgsInstanceError = require('./errors/api/ArgsInstance')
const ApiDescriptionsInstanceError = require('./errors/api/DescriptionsInstance')
const ApiDescriptionError = require('./errors/api/Description')

const UserArgumentsLengthError = require('./errors/user/ArgumentsLength')
const UserArgumentTypeError = require('./errors/user/ArgumentType')
const UserArgumentInstanceError = require('./errors/user/ArgumentInstance')

const Validator = require('./lib/Validator')
const getMessage = require('./lib/getMessage')

function getConstructorName(argument) {
  if (argument === undefined) {
    return 'undefined'
  }
  if (!argument.constructor) {
    return argument
  }
  return argument.constructor.name
}

function argumentValidate(label, description, argument) {

  if (description === '*') {
    return
  }

  if (description instanceof Validator) {
    try {
      description.test(argument)
      return
    } catch (err) {
      throw new description.Error(`${label} ${err.message}`)
    }
  }

  const isArray = description.indexOf('[]') === 0
  if (isArray) {
    if (!(argument instanceof Array)) {
      throw new UserArgumentInstanceError(
        getMessage(`${label} constructor`, 'Array', getConstructorName(argument))
      )
    }
    argument.forEach((_argument, _index) => {
      argumentValidate(`${label}[${_index}]`, description.substr(2), _argument)
    })
    return
  }

  // eslint-disable-next-line valid-typeof
  const firstLetter = description.charAt(0)
  const isLowerCase = firstLetter === firstLetter.toLowerCase()

  if (isLowerCase) {
    if (typeof argument !== description) {
      throw new UserArgumentTypeError(getMessage(`${label} type`, description, typeof argument))
    }
    return
  }

  if (argument === undefined || description !== getConstructorName(argument)) {
    throw new UserArgumentInstanceError(getMessage(`${label} constructor`, description, getConstructorName(argument)))
  }
}

const arguguard = function arguguard(label, descriptions, args) {
  if (arguguard.options.disabled === true) {
    return
  }
  apiValidate(...arguments)
  if (args.length > descriptions.length) {
    throw new UserArgumentsLengthError(getMessage(`${label} arguments.length`, `no more than ${descriptions.length}`, args.length))
  }
  descriptions.forEach((description, index) => {
    argumentValidate(`${label} arguments[${index}]`, description, args[index])
  })
}

arguguard.options = {
  disabled: false,
  allowSynonymousConstructors: true
}

module.exports = arguguard

function apiValidate(label, descriptions, args) {
  if (arguments.length !== 3) {
    throw new ApiArgumentsLengthError(getMessage('arguguard() arguments.length', 3, arguments.length))
  }
  if (typeof label !== 'string') {
    throw new ApiLabelTypeError(getMessage('arguguard() arguments[0] (label)', 'string', typeof label))
  }
  if (!(descriptions instanceof Array)) {
    throw new ApiDescriptionsInstanceError(getMessage('arguguard() arguments[1] (description)', 'Array', descriptions.constructor.name))
  }
  descriptions.forEach((description, index) => {
    apiDescriptionValidate(`arguguard() descriptions[${index}]`, description)
  })
  if (!(args instanceof Object)) {
    throw new ApiArgsInstanceError(getMessage('arguguard() arguments[2] (args)', 'Object', args.constructor.name))
  }
}

function apiDescriptionValidate(label, description) {
  if (description instanceof Validator) {
    return
  }
  if (typeof description === 'string') {
    return
  }
  throw new ApiDescriptionError(getMessage(label, 'string/Validator', typeof description))

}

},{"./errors/api/ArgsInstance":18,"./errors/api/ArgumentsLength":19,"./errors/api/Description":20,"./errors/api/DescriptionsInstance":21,"./errors/api/LabelType":22,"./errors/user/ArgumentInstance":24,"./errors/user/ArgumentType":25,"./errors/user/ArgumentsLength":26,"./lib/Validator":28,"./lib/getMessage":29}],28:[function(require,module,exports){
const ApiArgumentsLengthError = require('../errors/api/ArgumentsLength')
const ApiDescriptionError = require('../errors/api/Description')
const ApiTestError = require('../errors/api/Test')
const getMessage = require('./getMessage')
const createTestableErrorClass = require('testable-error')

function Validator(name, test) {
  if (arguments.length !== 2) {
    throw new ApiArgumentsLengthError(getMessage('Validator() arguments.length', '2', arguments.length))
  }
  if (typeof name !== 'string') {
    throw new ApiDescriptionError(getMessage('Validator() arguments[0] (name)', 'string', typeof name))
  }
  if (typeof test !== 'function') {
    throw new ApiTestError(getMessage('Validator() arguments[1] (test)', 'function', typeof test))
  }
  this.name = name
  this.Error = createTestableErrorClass(`Arguguard:User:ValidationError:${name}`)
  this.test = test
}

module.exports = Validator

},{"../errors/api/ArgumentsLength":19,"../errors/api/Description":20,"../errors/api/Test":23,"./getMessage":29,"testable-error":111}],29:[function(require,module,exports){
module.exports = function getMessage(label, expects, actual) {
  return `${label} should be "${expects}", received "${actual}"`
}

},{}],30:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],31:[function(require,module,exports){
(function (module, exports) {
  'use strict';

  // Utils
  function assert (val, msg) {
    if (!val) throw new Error(msg || 'Assertion failed');
  }

  // Could use `inherits` module, but don't want to move from single file
  // architecture yet.
  function inherits (ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function () {};
    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  }

  // BN

  function BN (number, base, endian) {
    if (BN.isBN(number)) {
      return number;
    }

    this.negative = 0;
    this.words = null;
    this.length = 0;

    // Reduction context
    this.red = null;

    if (number !== null) {
      if (base === 'le' || base === 'be') {
        endian = base;
        base = 10;
      }

      this._init(number || 0, base || 10, endian || 'be');
    }
  }
  if (typeof module === 'object') {
    module.exports = BN;
  } else {
    exports.BN = BN;
  }

  BN.BN = BN;
  BN.wordSize = 26;

  var Buffer;
  try {
    Buffer = require('buffer').Buffer;
  } catch (e) {
  }

  BN.isBN = function isBN (num) {
    if (num instanceof BN) {
      return true;
    }

    return num !== null && typeof num === 'object' &&
      num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
  };

  BN.max = function max (left, right) {
    if (left.cmp(right) > 0) return left;
    return right;
  };

  BN.min = function min (left, right) {
    if (left.cmp(right) < 0) return left;
    return right;
  };

  BN.prototype._init = function init (number, base, endian) {
    if (typeof number === 'number') {
      return this._initNumber(number, base, endian);
    }

    if (typeof number === 'object') {
      return this._initArray(number, base, endian);
    }

    if (base === 'hex') {
      base = 16;
    }
    assert(base === (base | 0) && base >= 2 && base <= 36);

    number = number.toString().replace(/\s+/g, '');
    var start = 0;
    if (number[0] === '-') {
      start++;
    }

    if (base === 16) {
      this._parseHex(number, start);
    } else {
      this._parseBase(number, base, start);
    }

    if (number[0] === '-') {
      this.negative = 1;
    }

    this._strip();

    if (endian !== 'le') return;

    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initNumber = function _initNumber (number, base, endian) {
    if (number < 0) {
      this.negative = 1;
      number = -number;
    }
    if (number < 0x4000000) {
      this.words = [ number & 0x3ffffff ];
      this.length = 1;
    } else if (number < 0x10000000000000) {
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff
      ];
      this.length = 2;
    } else {
      assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
      this.words = [
        number & 0x3ffffff,
        (number / 0x4000000) & 0x3ffffff,
        1
      ];
      this.length = 3;
    }

    if (endian !== 'le') return;

    // Reverse the bytes
    this._initArray(this.toArray(), base, endian);
  };

  BN.prototype._initArray = function _initArray (number, base, endian) {
    // Perhaps a Uint8Array
    assert(typeof number.length === 'number');
    if (number.length <= 0) {
      this.words = [ 0 ];
      this.length = 1;
      return this;
    }

    this.length = Math.ceil(number.length / 3);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    var off = 0;
    if (endian === 'be') {
      for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
        w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    } else if (endian === 'le') {
      for (i = 0, j = 0; i < number.length; i += 3) {
        w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
    }
    return this._strip();
  };

  function parseHex (str, start, end) {
    var r = 0;
    var len = Math.min(str.length, end);
    var z = 0;
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r <<= 4;

      var b;

      // 'a' - 'f'
      if (c >= 49 && c <= 54) {
        b = c - 49 + 0xa;

      // 'A' - 'F'
      } else if (c >= 17 && c <= 22) {
        b = c - 17 + 0xa;

      // '0' - '9'
      } else {
        b = c;
      }

      r |= b;
      z |= b;
    }

    assert(!(z & 0xf0), 'Invalid character in ' + str);
    return r;
  }

  BN.prototype._parseHex = function _parseHex (number, start) {
    // Create possibly bigger array to ensure that it fits the number
    this.length = Math.ceil((number.length - start) / 6);
    this.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      this.words[i] = 0;
    }

    var j, w;
    // Scan 24-bit chunks and add them to the number
    var off = 0;
    for (i = number.length - 6, j = 0; i >= start; i -= 6) {
      w = parseHex(number, i, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      off += 24;
      if (off >= 26) {
        off -= 26;
        j++;
      }
    }
    if (i + 6 !== start) {
      w = parseHex(number, start, i + 6);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
    }
    this._strip();
  };

  function parseBase (str, start, end, mul) {
    var r = 0;
    var b = 0;
    var len = Math.min(str.length, end);
    for (var i = start; i < len; i++) {
      var c = str.charCodeAt(i) - 48;

      r *= mul;

      // 'a'
      if (c >= 49) {
        b = c - 49 + 0xa;

      // 'A'
      } else if (c >= 17) {
        b = c - 17 + 0xa;

      // '0' - '9'
      } else {
        b = c;
      }
      assert(c >= 0 && b < mul, 'Invalid character');
      r += b;
    }
    return r;
  }

  BN.prototype._parseBase = function _parseBase (number, base, start) {
    // Initialize as zero
    this.words = [ 0 ];
    this.length = 1;

    // Find length of limb in base
    for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
      limbLen++;
    }
    limbLen--;
    limbPow = (limbPow / base) | 0;

    var total = number.length - start;
    var mod = total % limbLen;
    var end = Math.min(total, total - mod) + start;

    var word = 0;
    for (var i = start; i < end; i += limbLen) {
      word = parseBase(number, i, i + limbLen, base);

      this.imuln(limbPow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }

    if (mod !== 0) {
      var pow = 1;
      word = parseBase(number, i, number.length, base);

      for (i = 0; i < mod; i++) {
        pow *= base;
      }

      this.imuln(pow);
      if (this.words[0] + word < 0x4000000) {
        this.words[0] += word;
      } else {
        this._iaddn(word);
      }
    }
  };

  BN.prototype.copy = function copy (dest) {
    dest.words = new Array(this.length);
    for (var i = 0; i < this.length; i++) {
      dest.words[i] = this.words[i];
    }
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype._move = function _move (dest) {
    dest.words = this.words;
    dest.length = this.length;
    dest.negative = this.negative;
    dest.red = this.red;
  };

  BN.prototype.clone = function clone () {
    var r = new BN(null);
    this.copy(r);
    return r;
  };

  BN.prototype._expand = function _expand (size) {
    while (this.length < size) {
      this.words[this.length++] = 0;
    }
    return this;
  };

  // Remove leading `0` from `this`
  BN.prototype._strip = function strip () {
    while (this.length > 1 && this.words[this.length - 1] === 0) {
      this.length--;
    }
    return this._normSign();
  };

  BN.prototype._normSign = function _normSign () {
    // -0 = 0
    if (this.length === 1 && this.words[0] === 0) {
      this.negative = 0;
    }
    return this;
  };

  BN.prototype.inspect = function inspect () {
    return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
  };

  /*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */

  var zeros = [
    '',
    '0',
    '00',
    '000',
    '0000',
    '00000',
    '000000',
    '0000000',
    '00000000',
    '000000000',
    '0000000000',
    '00000000000',
    '000000000000',
    '0000000000000',
    '00000000000000',
    '000000000000000',
    '0000000000000000',
    '00000000000000000',
    '000000000000000000',
    '0000000000000000000',
    '00000000000000000000',
    '000000000000000000000',
    '0000000000000000000000',
    '00000000000000000000000',
    '000000000000000000000000',
    '0000000000000000000000000'
  ];

  var groupSizes = [
    0, 0,
    25, 16, 12, 11, 10, 9, 8,
    8, 7, 7, 7, 7, 6, 6,
    6, 6, 6, 6, 6, 5, 5,
    5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5
  ];

  var groupBases = [
    0, 0,
    33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
    43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
    16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
    6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
    24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
  ];

  BN.prototype.toString = function toString (base, padding) {
    base = base || 10;
    padding = padding | 0 || 1;

    var out;
    if (base === 16 || base === 'hex') {
      out = '';
      var off = 0;
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = this.words[i];
        var word = (((w << off) | carry) & 0xffffff).toString(16);
        carry = (w >>> (24 - off)) & 0xffffff;
        if (carry !== 0 || i !== this.length - 1) {
          out = zeros[6 - word.length] + word + out;
        } else {
          out = word + out;
        }
        off += 2;
        if (off >= 26) {
          off -= 26;
          i--;
        }
      }
      if (carry !== 0) {
        out = carry.toString(16) + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    if (base === (base | 0) && base >= 2 && base <= 36) {
      // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
      var groupSize = groupSizes[base];
      // var groupBase = Math.pow(base, groupSize);
      var groupBase = groupBases[base];
      out = '';
      var c = this.clone();
      c.negative = 0;
      while (!c.isZero()) {
        var r = c.modrn(groupBase).toString(base);
        c = c.idivn(groupBase);

        if (!c.isZero()) {
          out = zeros[groupSize - r.length] + r + out;
        } else {
          out = r + out;
        }
      }
      if (this.isZero()) {
        out = '0' + out;
      }
      while (out.length % padding !== 0) {
        out = '0' + out;
      }
      if (this.negative !== 0) {
        out = '-' + out;
      }
      return out;
    }

    assert(false, 'Base should be between 2 and 36');
  };

  BN.prototype.toNumber = function toNumber () {
    var ret = this.words[0];
    if (this.length === 2) {
      ret += this.words[1] * 0x4000000;
    } else if (this.length === 3 && this.words[2] === 0x01) {
      // NOTE: at this stage it is known that the top bit is set
      ret += 0x10000000000000 + (this.words[1] * 0x4000000);
    } else if (this.length > 2) {
      assert(false, 'Number can only safely store up to 53 bits');
    }
    return (this.negative !== 0) ? -ret : ret;
  };

  BN.prototype.toJSON = function toJSON () {
    return this.toString(16, 2);
  };

  if (Buffer) {
    BN.prototype.toBuffer = function toBuffer (endian, length) {
      return this.toArrayLike(Buffer, endian, length);
    };
  }

  BN.prototype.toArray = function toArray (endian, length) {
    return this.toArrayLike(Array, endian, length);
  };

  BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
    var byteLength = this.byteLength();
    var reqLength = length || Math.max(1, byteLength);
    assert(byteLength <= reqLength, 'byte array longer than desired length');
    assert(reqLength > 0, 'Requested array length <= 0');

    this._strip();
    var littleEndian = endian === 'le';
    var res = allocate(ArrayType, reqLength);

    var b, i;
    var q = this.clone();
    if (!littleEndian) {
      // Assume big-endian
      for (i = 0; i < reqLength - byteLength; i++) {
        res[i] = 0;
      }

      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[reqLength - i - 1] = b;
      }
    } else {
      for (i = 0; !q.isZero(); i++) {
        b = q.andln(0xff);
        q.iushrn(8);

        res[i] = b;
      }

      for (; i < reqLength; i++) {
        res[i] = 0;
      }
    }

    return res;
  };

  var allocate = function allocate (ArrayType, size) {
    if (ArrayType.allocUnsafe) {
      return ArrayType.allocUnsafe(size);
    }
    return new ArrayType(size);
  };

  if (Math.clz32) {
    BN.prototype._countBits = function _countBits (w) {
      return 32 - Math.clz32(w);
    };
  } else {
    BN.prototype._countBits = function _countBits (w) {
      var t = w;
      var r = 0;
      if (t >= 0x1000) {
        r += 13;
        t >>>= 13;
      }
      if (t >= 0x40) {
        r += 7;
        t >>>= 7;
      }
      if (t >= 0x8) {
        r += 4;
        t >>>= 4;
      }
      if (t >= 0x02) {
        r += 2;
        t >>>= 2;
      }
      return r + t;
    };
  }

  BN.prototype._zeroBits = function _zeroBits (w) {
    // Short-cut
    if (w === 0) return 26;

    var t = w;
    var r = 0;
    if ((t & 0x1fff) === 0) {
      r += 13;
      t >>>= 13;
    }
    if ((t & 0x7f) === 0) {
      r += 7;
      t >>>= 7;
    }
    if ((t & 0xf) === 0) {
      r += 4;
      t >>>= 4;
    }
    if ((t & 0x3) === 0) {
      r += 2;
      t >>>= 2;
    }
    if ((t & 0x1) === 0) {
      r++;
    }
    return r;
  };

  // Return number of used bits in a BN
  BN.prototype.bitLength = function bitLength () {
    var w = this.words[this.length - 1];
    var hi = this._countBits(w);
    return (this.length - 1) * 26 + hi;
  };

  function toBitArray (num) {
    var w = new Array(num.bitLength());

    for (var bit = 0; bit < w.length; bit++) {
      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
    }

    return w;
  }

  // Number of trailing zero bits
  BN.prototype.zeroBits = function zeroBits () {
    if (this.isZero()) return 0;

    var r = 0;
    for (var i = 0; i < this.length; i++) {
      var b = this._zeroBits(this.words[i]);
      r += b;
      if (b !== 26) break;
    }
    return r;
  };

  BN.prototype.byteLength = function byteLength () {
    return Math.ceil(this.bitLength() / 8);
  };

  BN.prototype.toTwos = function toTwos (width) {
    if (this.negative !== 0) {
      return this.abs().inotn(width).iaddn(1);
    }
    return this.clone();
  };

  BN.prototype.fromTwos = function fromTwos (width) {
    if (this.testn(width - 1)) {
      return this.notn(width).iaddn(1).ineg();
    }
    return this.clone();
  };

  BN.prototype.isNeg = function isNeg () {
    return this.negative !== 0;
  };

  // Return negative clone of `this`
  BN.prototype.neg = function neg () {
    return this.clone().ineg();
  };

  BN.prototype.ineg = function ineg () {
    if (!this.isZero()) {
      this.negative ^= 1;
    }

    return this;
  };

  // Or `num` with `this` in-place
  BN.prototype.iuor = function iuor (num) {
    while (this.length < num.length) {
      this.words[this.length++] = 0;
    }

    for (var i = 0; i < num.length; i++) {
      this.words[i] = this.words[i] | num.words[i];
    }

    return this._strip();
  };

  BN.prototype.ior = function ior (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuor(num);
  };

  // Or `num` with `this`
  BN.prototype.or = function or (num) {
    if (this.length > num.length) return this.clone().ior(num);
    return num.clone().ior(this);
  };

  BN.prototype.uor = function uor (num) {
    if (this.length > num.length) return this.clone().iuor(num);
    return num.clone().iuor(this);
  };

  // And `num` with `this` in-place
  BN.prototype.iuand = function iuand (num) {
    // b = min-length(num, this)
    var b;
    if (this.length > num.length) {
      b = num;
    } else {
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = this.words[i] & num.words[i];
    }

    this.length = b.length;

    return this._strip();
  };

  BN.prototype.iand = function iand (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuand(num);
  };

  // And `num` with `this`
  BN.prototype.and = function and (num) {
    if (this.length > num.length) return this.clone().iand(num);
    return num.clone().iand(this);
  };

  BN.prototype.uand = function uand (num) {
    if (this.length > num.length) return this.clone().iuand(num);
    return num.clone().iuand(this);
  };

  // Xor `num` with `this` in-place
  BN.prototype.iuxor = function iuxor (num) {
    // a.length > b.length
    var a;
    var b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    for (var i = 0; i < b.length; i++) {
      this.words[i] = a.words[i] ^ b.words[i];
    }

    if (this !== a) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = a.length;

    return this._strip();
  };

  BN.prototype.ixor = function ixor (num) {
    assert((this.negative | num.negative) === 0);
    return this.iuxor(num);
  };

  // Xor `num` with `this`
  BN.prototype.xor = function xor (num) {
    if (this.length > num.length) return this.clone().ixor(num);
    return num.clone().ixor(this);
  };

  BN.prototype.uxor = function uxor (num) {
    if (this.length > num.length) return this.clone().iuxor(num);
    return num.clone().iuxor(this);
  };

  // Not ``this`` with ``width`` bitwidth
  BN.prototype.inotn = function inotn (width) {
    assert(typeof width === 'number' && width >= 0);

    var bytesNeeded = Math.ceil(width / 26) | 0;
    var bitsLeft = width % 26;

    // Extend the buffer with leading zeroes
    this._expand(bytesNeeded);

    if (bitsLeft > 0) {
      bytesNeeded--;
    }

    // Handle complete words
    for (var i = 0; i < bytesNeeded; i++) {
      this.words[i] = ~this.words[i] & 0x3ffffff;
    }

    // Handle the residue
    if (bitsLeft > 0) {
      this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
    }

    // And remove leading zeroes
    return this._strip();
  };

  BN.prototype.notn = function notn (width) {
    return this.clone().inotn(width);
  };

  // Set `bit` of `this`
  BN.prototype.setn = function setn (bit, val) {
    assert(typeof bit === 'number' && bit >= 0);

    var off = (bit / 26) | 0;
    var wbit = bit % 26;

    this._expand(off + 1);

    if (val) {
      this.words[off] = this.words[off] | (1 << wbit);
    } else {
      this.words[off] = this.words[off] & ~(1 << wbit);
    }

    return this._strip();
  };

  // Add `num` to `this` in-place
  BN.prototype.iadd = function iadd (num) {
    var r;

    // negative + positive
    if (this.negative !== 0 && num.negative === 0) {
      this.negative = 0;
      r = this.isub(num);
      this.negative ^= 1;
      return this._normSign();

    // positive + negative
    } else if (this.negative === 0 && num.negative !== 0) {
      num.negative = 0;
      r = this.isub(num);
      num.negative = 1;
      return r._normSign();
    }

    // a.length > b.length
    var a, b;
    if (this.length > num.length) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      this.words[i] = r & 0x3ffffff;
      carry = r >>> 26;
    }

    this.length = a.length;
    if (carry !== 0) {
      this.words[this.length] = carry;
      this.length++;
    // Copy the rest of the words
    } else if (a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    return this;
  };

  // Add `num` to `this`
  BN.prototype.add = function add (num) {
    var res;
    if (num.negative !== 0 && this.negative === 0) {
      num.negative = 0;
      res = this.sub(num);
      num.negative ^= 1;
      return res;
    } else if (num.negative === 0 && this.negative !== 0) {
      this.negative = 0;
      res = num.sub(this);
      this.negative = 1;
      return res;
    }

    if (this.length > num.length) return this.clone().iadd(num);

    return num.clone().iadd(this);
  };

  // Subtract `num` from `this` in-place
  BN.prototype.isub = function isub (num) {
    // this - (-num) = this + num
    if (num.negative !== 0) {
      num.negative = 0;
      var r = this.iadd(num);
      num.negative = 1;
      return r._normSign();

    // -this - num = -(this + num)
    } else if (this.negative !== 0) {
      this.negative = 0;
      this.iadd(num);
      this.negative = 1;
      return this._normSign();
    }

    // At this point both numbers are positive
    var cmp = this.cmp(num);

    // Optimization - zeroify
    if (cmp === 0) {
      this.negative = 0;
      this.length = 1;
      this.words[0] = 0;
      return this;
    }

    // a > b
    var a, b;
    if (cmp > 0) {
      a = this;
      b = num;
    } else {
      a = num;
      b = this;
    }

    var carry = 0;
    for (var i = 0; i < b.length; i++) {
      r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }
    for (; carry !== 0 && i < a.length; i++) {
      r = (a.words[i] | 0) + carry;
      carry = r >> 26;
      this.words[i] = r & 0x3ffffff;
    }

    // Copy rest of the words
    if (carry === 0 && i < a.length && a !== this) {
      for (; i < a.length; i++) {
        this.words[i] = a.words[i];
      }
    }

    this.length = Math.max(this.length, i);

    if (a !== this) {
      this.negative = 1;
    }

    return this._strip();
  };

  // Subtract `num` from `this`
  BN.prototype.sub = function sub (num) {
    return this.clone().isub(num);
  };

  function smallMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    var len = (self.length + num.length) | 0;
    out.length = len;
    len = (len - 1) | 0;

    // Peel one iteration (compiler can't do it, because of code complexity)
    var a = self.words[0] | 0;
    var b = num.words[0] | 0;
    var r = a * b;

    var lo = r & 0x3ffffff;
    var carry = (r / 0x4000000) | 0;
    out.words[0] = lo;

    for (var k = 1; k < len; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = carry >>> 26;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = (k - j) | 0;
        a = self.words[i] | 0;
        b = num.words[j] | 0;
        r = a * b + rword;
        ncarry += (r / 0x4000000) | 0;
        rword = r & 0x3ffffff;
      }
      out.words[k] = rword | 0;
      carry = ncarry | 0;
    }
    if (carry !== 0) {
      out.words[k] = carry | 0;
    } else {
      out.length--;
    }

    return out._strip();
  }

  // TODO(indutny): it may be reasonable to omit it for users who don't need
  // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
  // multiplication (like elliptic secp256k1).
  var comb10MulTo = function comb10MulTo (self, num, out) {
    var a = self.words;
    var b = num.words;
    var o = out.words;
    var c = 0;
    var lo;
    var mid;
    var hi;
    var a0 = a[0] | 0;
    var al0 = a0 & 0x1fff;
    var ah0 = a0 >>> 13;
    var a1 = a[1] | 0;
    var al1 = a1 & 0x1fff;
    var ah1 = a1 >>> 13;
    var a2 = a[2] | 0;
    var al2 = a2 & 0x1fff;
    var ah2 = a2 >>> 13;
    var a3 = a[3] | 0;
    var al3 = a3 & 0x1fff;
    var ah3 = a3 >>> 13;
    var a4 = a[4] | 0;
    var al4 = a4 & 0x1fff;
    var ah4 = a4 >>> 13;
    var a5 = a[5] | 0;
    var al5 = a5 & 0x1fff;
    var ah5 = a5 >>> 13;
    var a6 = a[6] | 0;
    var al6 = a6 & 0x1fff;
    var ah6 = a6 >>> 13;
    var a7 = a[7] | 0;
    var al7 = a7 & 0x1fff;
    var ah7 = a7 >>> 13;
    var a8 = a[8] | 0;
    var al8 = a8 & 0x1fff;
    var ah8 = a8 >>> 13;
    var a9 = a[9] | 0;
    var al9 = a9 & 0x1fff;
    var ah9 = a9 >>> 13;
    var b0 = b[0] | 0;
    var bl0 = b0 & 0x1fff;
    var bh0 = b0 >>> 13;
    var b1 = b[1] | 0;
    var bl1 = b1 & 0x1fff;
    var bh1 = b1 >>> 13;
    var b2 = b[2] | 0;
    var bl2 = b2 & 0x1fff;
    var bh2 = b2 >>> 13;
    var b3 = b[3] | 0;
    var bl3 = b3 & 0x1fff;
    var bh3 = b3 >>> 13;
    var b4 = b[4] | 0;
    var bl4 = b4 & 0x1fff;
    var bh4 = b4 >>> 13;
    var b5 = b[5] | 0;
    var bl5 = b5 & 0x1fff;
    var bh5 = b5 >>> 13;
    var b6 = b[6] | 0;
    var bl6 = b6 & 0x1fff;
    var bh6 = b6 >>> 13;
    var b7 = b[7] | 0;
    var bl7 = b7 & 0x1fff;
    var bh7 = b7 >>> 13;
    var b8 = b[8] | 0;
    var bl8 = b8 & 0x1fff;
    var bh8 = b8 >>> 13;
    var b9 = b[9] | 0;
    var bl9 = b9 & 0x1fff;
    var bh9 = b9 >>> 13;

    out.negative = self.negative ^ num.negative;
    out.length = 19;
    /* k = 0 */
    lo = Math.imul(al0, bl0);
    mid = Math.imul(al0, bh0);
    mid = (mid + Math.imul(ah0, bl0)) | 0;
    hi = Math.imul(ah0, bh0);
    var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
    w0 &= 0x3ffffff;
    /* k = 1 */
    lo = Math.imul(al1, bl0);
    mid = Math.imul(al1, bh0);
    mid = (mid + Math.imul(ah1, bl0)) | 0;
    hi = Math.imul(ah1, bh0);
    lo = (lo + Math.imul(al0, bl1)) | 0;
    mid = (mid + Math.imul(al0, bh1)) | 0;
    mid = (mid + Math.imul(ah0, bl1)) | 0;
    hi = (hi + Math.imul(ah0, bh1)) | 0;
    var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
    w1 &= 0x3ffffff;
    /* k = 2 */
    lo = Math.imul(al2, bl0);
    mid = Math.imul(al2, bh0);
    mid = (mid + Math.imul(ah2, bl0)) | 0;
    hi = Math.imul(ah2, bh0);
    lo = (lo + Math.imul(al1, bl1)) | 0;
    mid = (mid + Math.imul(al1, bh1)) | 0;
    mid = (mid + Math.imul(ah1, bl1)) | 0;
    hi = (hi + Math.imul(ah1, bh1)) | 0;
    lo = (lo + Math.imul(al0, bl2)) | 0;
    mid = (mid + Math.imul(al0, bh2)) | 0;
    mid = (mid + Math.imul(ah0, bl2)) | 0;
    hi = (hi + Math.imul(ah0, bh2)) | 0;
    var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
    w2 &= 0x3ffffff;
    /* k = 3 */
    lo = Math.imul(al3, bl0);
    mid = Math.imul(al3, bh0);
    mid = (mid + Math.imul(ah3, bl0)) | 0;
    hi = Math.imul(ah3, bh0);
    lo = (lo + Math.imul(al2, bl1)) | 0;
    mid = (mid + Math.imul(al2, bh1)) | 0;
    mid = (mid + Math.imul(ah2, bl1)) | 0;
    hi = (hi + Math.imul(ah2, bh1)) | 0;
    lo = (lo + Math.imul(al1, bl2)) | 0;
    mid = (mid + Math.imul(al1, bh2)) | 0;
    mid = (mid + Math.imul(ah1, bl2)) | 0;
    hi = (hi + Math.imul(ah1, bh2)) | 0;
    lo = (lo + Math.imul(al0, bl3)) | 0;
    mid = (mid + Math.imul(al0, bh3)) | 0;
    mid = (mid + Math.imul(ah0, bl3)) | 0;
    hi = (hi + Math.imul(ah0, bh3)) | 0;
    var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
    w3 &= 0x3ffffff;
    /* k = 4 */
    lo = Math.imul(al4, bl0);
    mid = Math.imul(al4, bh0);
    mid = (mid + Math.imul(ah4, bl0)) | 0;
    hi = Math.imul(ah4, bh0);
    lo = (lo + Math.imul(al3, bl1)) | 0;
    mid = (mid + Math.imul(al3, bh1)) | 0;
    mid = (mid + Math.imul(ah3, bl1)) | 0;
    hi = (hi + Math.imul(ah3, bh1)) | 0;
    lo = (lo + Math.imul(al2, bl2)) | 0;
    mid = (mid + Math.imul(al2, bh2)) | 0;
    mid = (mid + Math.imul(ah2, bl2)) | 0;
    hi = (hi + Math.imul(ah2, bh2)) | 0;
    lo = (lo + Math.imul(al1, bl3)) | 0;
    mid = (mid + Math.imul(al1, bh3)) | 0;
    mid = (mid + Math.imul(ah1, bl3)) | 0;
    hi = (hi + Math.imul(ah1, bh3)) | 0;
    lo = (lo + Math.imul(al0, bl4)) | 0;
    mid = (mid + Math.imul(al0, bh4)) | 0;
    mid = (mid + Math.imul(ah0, bl4)) | 0;
    hi = (hi + Math.imul(ah0, bh4)) | 0;
    var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
    w4 &= 0x3ffffff;
    /* k = 5 */
    lo = Math.imul(al5, bl0);
    mid = Math.imul(al5, bh0);
    mid = (mid + Math.imul(ah5, bl0)) | 0;
    hi = Math.imul(ah5, bh0);
    lo = (lo + Math.imul(al4, bl1)) | 0;
    mid = (mid + Math.imul(al4, bh1)) | 0;
    mid = (mid + Math.imul(ah4, bl1)) | 0;
    hi = (hi + Math.imul(ah4, bh1)) | 0;
    lo = (lo + Math.imul(al3, bl2)) | 0;
    mid = (mid + Math.imul(al3, bh2)) | 0;
    mid = (mid + Math.imul(ah3, bl2)) | 0;
    hi = (hi + Math.imul(ah3, bh2)) | 0;
    lo = (lo + Math.imul(al2, bl3)) | 0;
    mid = (mid + Math.imul(al2, bh3)) | 0;
    mid = (mid + Math.imul(ah2, bl3)) | 0;
    hi = (hi + Math.imul(ah2, bh3)) | 0;
    lo = (lo + Math.imul(al1, bl4)) | 0;
    mid = (mid + Math.imul(al1, bh4)) | 0;
    mid = (mid + Math.imul(ah1, bl4)) | 0;
    hi = (hi + Math.imul(ah1, bh4)) | 0;
    lo = (lo + Math.imul(al0, bl5)) | 0;
    mid = (mid + Math.imul(al0, bh5)) | 0;
    mid = (mid + Math.imul(ah0, bl5)) | 0;
    hi = (hi + Math.imul(ah0, bh5)) | 0;
    var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
    w5 &= 0x3ffffff;
    /* k = 6 */
    lo = Math.imul(al6, bl0);
    mid = Math.imul(al6, bh0);
    mid = (mid + Math.imul(ah6, bl0)) | 0;
    hi = Math.imul(ah6, bh0);
    lo = (lo + Math.imul(al5, bl1)) | 0;
    mid = (mid + Math.imul(al5, bh1)) | 0;
    mid = (mid + Math.imul(ah5, bl1)) | 0;
    hi = (hi + Math.imul(ah5, bh1)) | 0;
    lo = (lo + Math.imul(al4, bl2)) | 0;
    mid = (mid + Math.imul(al4, bh2)) | 0;
    mid = (mid + Math.imul(ah4, bl2)) | 0;
    hi = (hi + Math.imul(ah4, bh2)) | 0;
    lo = (lo + Math.imul(al3, bl3)) | 0;
    mid = (mid + Math.imul(al3, bh3)) | 0;
    mid = (mid + Math.imul(ah3, bl3)) | 0;
    hi = (hi + Math.imul(ah3, bh3)) | 0;
    lo = (lo + Math.imul(al2, bl4)) | 0;
    mid = (mid + Math.imul(al2, bh4)) | 0;
    mid = (mid + Math.imul(ah2, bl4)) | 0;
    hi = (hi + Math.imul(ah2, bh4)) | 0;
    lo = (lo + Math.imul(al1, bl5)) | 0;
    mid = (mid + Math.imul(al1, bh5)) | 0;
    mid = (mid + Math.imul(ah1, bl5)) | 0;
    hi = (hi + Math.imul(ah1, bh5)) | 0;
    lo = (lo + Math.imul(al0, bl6)) | 0;
    mid = (mid + Math.imul(al0, bh6)) | 0;
    mid = (mid + Math.imul(ah0, bl6)) | 0;
    hi = (hi + Math.imul(ah0, bh6)) | 0;
    var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
    w6 &= 0x3ffffff;
    /* k = 7 */
    lo = Math.imul(al7, bl0);
    mid = Math.imul(al7, bh0);
    mid = (mid + Math.imul(ah7, bl0)) | 0;
    hi = Math.imul(ah7, bh0);
    lo = (lo + Math.imul(al6, bl1)) | 0;
    mid = (mid + Math.imul(al6, bh1)) | 0;
    mid = (mid + Math.imul(ah6, bl1)) | 0;
    hi = (hi + Math.imul(ah6, bh1)) | 0;
    lo = (lo + Math.imul(al5, bl2)) | 0;
    mid = (mid + Math.imul(al5, bh2)) | 0;
    mid = (mid + Math.imul(ah5, bl2)) | 0;
    hi = (hi + Math.imul(ah5, bh2)) | 0;
    lo = (lo + Math.imul(al4, bl3)) | 0;
    mid = (mid + Math.imul(al4, bh3)) | 0;
    mid = (mid + Math.imul(ah4, bl3)) | 0;
    hi = (hi + Math.imul(ah4, bh3)) | 0;
    lo = (lo + Math.imul(al3, bl4)) | 0;
    mid = (mid + Math.imul(al3, bh4)) | 0;
    mid = (mid + Math.imul(ah3, bl4)) | 0;
    hi = (hi + Math.imul(ah3, bh4)) | 0;
    lo = (lo + Math.imul(al2, bl5)) | 0;
    mid = (mid + Math.imul(al2, bh5)) | 0;
    mid = (mid + Math.imul(ah2, bl5)) | 0;
    hi = (hi + Math.imul(ah2, bh5)) | 0;
    lo = (lo + Math.imul(al1, bl6)) | 0;
    mid = (mid + Math.imul(al1, bh6)) | 0;
    mid = (mid + Math.imul(ah1, bl6)) | 0;
    hi = (hi + Math.imul(ah1, bh6)) | 0;
    lo = (lo + Math.imul(al0, bl7)) | 0;
    mid = (mid + Math.imul(al0, bh7)) | 0;
    mid = (mid + Math.imul(ah0, bl7)) | 0;
    hi = (hi + Math.imul(ah0, bh7)) | 0;
    var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
    w7 &= 0x3ffffff;
    /* k = 8 */
    lo = Math.imul(al8, bl0);
    mid = Math.imul(al8, bh0);
    mid = (mid + Math.imul(ah8, bl0)) | 0;
    hi = Math.imul(ah8, bh0);
    lo = (lo + Math.imul(al7, bl1)) | 0;
    mid = (mid + Math.imul(al7, bh1)) | 0;
    mid = (mid + Math.imul(ah7, bl1)) | 0;
    hi = (hi + Math.imul(ah7, bh1)) | 0;
    lo = (lo + Math.imul(al6, bl2)) | 0;
    mid = (mid + Math.imul(al6, bh2)) | 0;
    mid = (mid + Math.imul(ah6, bl2)) | 0;
    hi = (hi + Math.imul(ah6, bh2)) | 0;
    lo = (lo + Math.imul(al5, bl3)) | 0;
    mid = (mid + Math.imul(al5, bh3)) | 0;
    mid = (mid + Math.imul(ah5, bl3)) | 0;
    hi = (hi + Math.imul(ah5, bh3)) | 0;
    lo = (lo + Math.imul(al4, bl4)) | 0;
    mid = (mid + Math.imul(al4, bh4)) | 0;
    mid = (mid + Math.imul(ah4, bl4)) | 0;
    hi = (hi + Math.imul(ah4, bh4)) | 0;
    lo = (lo + Math.imul(al3, bl5)) | 0;
    mid = (mid + Math.imul(al3, bh5)) | 0;
    mid = (mid + Math.imul(ah3, bl5)) | 0;
    hi = (hi + Math.imul(ah3, bh5)) | 0;
    lo = (lo + Math.imul(al2, bl6)) | 0;
    mid = (mid + Math.imul(al2, bh6)) | 0;
    mid = (mid + Math.imul(ah2, bl6)) | 0;
    hi = (hi + Math.imul(ah2, bh6)) | 0;
    lo = (lo + Math.imul(al1, bl7)) | 0;
    mid = (mid + Math.imul(al1, bh7)) | 0;
    mid = (mid + Math.imul(ah1, bl7)) | 0;
    hi = (hi + Math.imul(ah1, bh7)) | 0;
    lo = (lo + Math.imul(al0, bl8)) | 0;
    mid = (mid + Math.imul(al0, bh8)) | 0;
    mid = (mid + Math.imul(ah0, bl8)) | 0;
    hi = (hi + Math.imul(ah0, bh8)) | 0;
    var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
    w8 &= 0x3ffffff;
    /* k = 9 */
    lo = Math.imul(al9, bl0);
    mid = Math.imul(al9, bh0);
    mid = (mid + Math.imul(ah9, bl0)) | 0;
    hi = Math.imul(ah9, bh0);
    lo = (lo + Math.imul(al8, bl1)) | 0;
    mid = (mid + Math.imul(al8, bh1)) | 0;
    mid = (mid + Math.imul(ah8, bl1)) | 0;
    hi = (hi + Math.imul(ah8, bh1)) | 0;
    lo = (lo + Math.imul(al7, bl2)) | 0;
    mid = (mid + Math.imul(al7, bh2)) | 0;
    mid = (mid + Math.imul(ah7, bl2)) | 0;
    hi = (hi + Math.imul(ah7, bh2)) | 0;
    lo = (lo + Math.imul(al6, bl3)) | 0;
    mid = (mid + Math.imul(al6, bh3)) | 0;
    mid = (mid + Math.imul(ah6, bl3)) | 0;
    hi = (hi + Math.imul(ah6, bh3)) | 0;
    lo = (lo + Math.imul(al5, bl4)) | 0;
    mid = (mid + Math.imul(al5, bh4)) | 0;
    mid = (mid + Math.imul(ah5, bl4)) | 0;
    hi = (hi + Math.imul(ah5, bh4)) | 0;
    lo = (lo + Math.imul(al4, bl5)) | 0;
    mid = (mid + Math.imul(al4, bh5)) | 0;
    mid = (mid + Math.imul(ah4, bl5)) | 0;
    hi = (hi + Math.imul(ah4, bh5)) | 0;
    lo = (lo + Math.imul(al3, bl6)) | 0;
    mid = (mid + Math.imul(al3, bh6)) | 0;
    mid = (mid + Math.imul(ah3, bl6)) | 0;
    hi = (hi + Math.imul(ah3, bh6)) | 0;
    lo = (lo + Math.imul(al2, bl7)) | 0;
    mid = (mid + Math.imul(al2, bh7)) | 0;
    mid = (mid + Math.imul(ah2, bl7)) | 0;
    hi = (hi + Math.imul(ah2, bh7)) | 0;
    lo = (lo + Math.imul(al1, bl8)) | 0;
    mid = (mid + Math.imul(al1, bh8)) | 0;
    mid = (mid + Math.imul(ah1, bl8)) | 0;
    hi = (hi + Math.imul(ah1, bh8)) | 0;
    lo = (lo + Math.imul(al0, bl9)) | 0;
    mid = (mid + Math.imul(al0, bh9)) | 0;
    mid = (mid + Math.imul(ah0, bl9)) | 0;
    hi = (hi + Math.imul(ah0, bh9)) | 0;
    var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
    w9 &= 0x3ffffff;
    /* k = 10 */
    lo = Math.imul(al9, bl1);
    mid = Math.imul(al9, bh1);
    mid = (mid + Math.imul(ah9, bl1)) | 0;
    hi = Math.imul(ah9, bh1);
    lo = (lo + Math.imul(al8, bl2)) | 0;
    mid = (mid + Math.imul(al8, bh2)) | 0;
    mid = (mid + Math.imul(ah8, bl2)) | 0;
    hi = (hi + Math.imul(ah8, bh2)) | 0;
    lo = (lo + Math.imul(al7, bl3)) | 0;
    mid = (mid + Math.imul(al7, bh3)) | 0;
    mid = (mid + Math.imul(ah7, bl3)) | 0;
    hi = (hi + Math.imul(ah7, bh3)) | 0;
    lo = (lo + Math.imul(al6, bl4)) | 0;
    mid = (mid + Math.imul(al6, bh4)) | 0;
    mid = (mid + Math.imul(ah6, bl4)) | 0;
    hi = (hi + Math.imul(ah6, bh4)) | 0;
    lo = (lo + Math.imul(al5, bl5)) | 0;
    mid = (mid + Math.imul(al5, bh5)) | 0;
    mid = (mid + Math.imul(ah5, bl5)) | 0;
    hi = (hi + Math.imul(ah5, bh5)) | 0;
    lo = (lo + Math.imul(al4, bl6)) | 0;
    mid = (mid + Math.imul(al4, bh6)) | 0;
    mid = (mid + Math.imul(ah4, bl6)) | 0;
    hi = (hi + Math.imul(ah4, bh6)) | 0;
    lo = (lo + Math.imul(al3, bl7)) | 0;
    mid = (mid + Math.imul(al3, bh7)) | 0;
    mid = (mid + Math.imul(ah3, bl7)) | 0;
    hi = (hi + Math.imul(ah3, bh7)) | 0;
    lo = (lo + Math.imul(al2, bl8)) | 0;
    mid = (mid + Math.imul(al2, bh8)) | 0;
    mid = (mid + Math.imul(ah2, bl8)) | 0;
    hi = (hi + Math.imul(ah2, bh8)) | 0;
    lo = (lo + Math.imul(al1, bl9)) | 0;
    mid = (mid + Math.imul(al1, bh9)) | 0;
    mid = (mid + Math.imul(ah1, bl9)) | 0;
    hi = (hi + Math.imul(ah1, bh9)) | 0;
    var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
    w10 &= 0x3ffffff;
    /* k = 11 */
    lo = Math.imul(al9, bl2);
    mid = Math.imul(al9, bh2);
    mid = (mid + Math.imul(ah9, bl2)) | 0;
    hi = Math.imul(ah9, bh2);
    lo = (lo + Math.imul(al8, bl3)) | 0;
    mid = (mid + Math.imul(al8, bh3)) | 0;
    mid = (mid + Math.imul(ah8, bl3)) | 0;
    hi = (hi + Math.imul(ah8, bh3)) | 0;
    lo = (lo + Math.imul(al7, bl4)) | 0;
    mid = (mid + Math.imul(al7, bh4)) | 0;
    mid = (mid + Math.imul(ah7, bl4)) | 0;
    hi = (hi + Math.imul(ah7, bh4)) | 0;
    lo = (lo + Math.imul(al6, bl5)) | 0;
    mid = (mid + Math.imul(al6, bh5)) | 0;
    mid = (mid + Math.imul(ah6, bl5)) | 0;
    hi = (hi + Math.imul(ah6, bh5)) | 0;
    lo = (lo + Math.imul(al5, bl6)) | 0;
    mid = (mid + Math.imul(al5, bh6)) | 0;
    mid = (mid + Math.imul(ah5, bl6)) | 0;
    hi = (hi + Math.imul(ah5, bh6)) | 0;
    lo = (lo + Math.imul(al4, bl7)) | 0;
    mid = (mid + Math.imul(al4, bh7)) | 0;
    mid = (mid + Math.imul(ah4, bl7)) | 0;
    hi = (hi + Math.imul(ah4, bh7)) | 0;
    lo = (lo + Math.imul(al3, bl8)) | 0;
    mid = (mid + Math.imul(al3, bh8)) | 0;
    mid = (mid + Math.imul(ah3, bl8)) | 0;
    hi = (hi + Math.imul(ah3, bh8)) | 0;
    lo = (lo + Math.imul(al2, bl9)) | 0;
    mid = (mid + Math.imul(al2, bh9)) | 0;
    mid = (mid + Math.imul(ah2, bl9)) | 0;
    hi = (hi + Math.imul(ah2, bh9)) | 0;
    var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
    w11 &= 0x3ffffff;
    /* k = 12 */
    lo = Math.imul(al9, bl3);
    mid = Math.imul(al9, bh3);
    mid = (mid + Math.imul(ah9, bl3)) | 0;
    hi = Math.imul(ah9, bh3);
    lo = (lo + Math.imul(al8, bl4)) | 0;
    mid = (mid + Math.imul(al8, bh4)) | 0;
    mid = (mid + Math.imul(ah8, bl4)) | 0;
    hi = (hi + Math.imul(ah8, bh4)) | 0;
    lo = (lo + Math.imul(al7, bl5)) | 0;
    mid = (mid + Math.imul(al7, bh5)) | 0;
    mid = (mid + Math.imul(ah7, bl5)) | 0;
    hi = (hi + Math.imul(ah7, bh5)) | 0;
    lo = (lo + Math.imul(al6, bl6)) | 0;
    mid = (mid + Math.imul(al6, bh6)) | 0;
    mid = (mid + Math.imul(ah6, bl6)) | 0;
    hi = (hi + Math.imul(ah6, bh6)) | 0;
    lo = (lo + Math.imul(al5, bl7)) | 0;
    mid = (mid + Math.imul(al5, bh7)) | 0;
    mid = (mid + Math.imul(ah5, bl7)) | 0;
    hi = (hi + Math.imul(ah5, bh7)) | 0;
    lo = (lo + Math.imul(al4, bl8)) | 0;
    mid = (mid + Math.imul(al4, bh8)) | 0;
    mid = (mid + Math.imul(ah4, bl8)) | 0;
    hi = (hi + Math.imul(ah4, bh8)) | 0;
    lo = (lo + Math.imul(al3, bl9)) | 0;
    mid = (mid + Math.imul(al3, bh9)) | 0;
    mid = (mid + Math.imul(ah3, bl9)) | 0;
    hi = (hi + Math.imul(ah3, bh9)) | 0;
    var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
    w12 &= 0x3ffffff;
    /* k = 13 */
    lo = Math.imul(al9, bl4);
    mid = Math.imul(al9, bh4);
    mid = (mid + Math.imul(ah9, bl4)) | 0;
    hi = Math.imul(ah9, bh4);
    lo = (lo + Math.imul(al8, bl5)) | 0;
    mid = (mid + Math.imul(al8, bh5)) | 0;
    mid = (mid + Math.imul(ah8, bl5)) | 0;
    hi = (hi + Math.imul(ah8, bh5)) | 0;
    lo = (lo + Math.imul(al7, bl6)) | 0;
    mid = (mid + Math.imul(al7, bh6)) | 0;
    mid = (mid + Math.imul(ah7, bl6)) | 0;
    hi = (hi + Math.imul(ah7, bh6)) | 0;
    lo = (lo + Math.imul(al6, bl7)) | 0;
    mid = (mid + Math.imul(al6, bh7)) | 0;
    mid = (mid + Math.imul(ah6, bl7)) | 0;
    hi = (hi + Math.imul(ah6, bh7)) | 0;
    lo = (lo + Math.imul(al5, bl8)) | 0;
    mid = (mid + Math.imul(al5, bh8)) | 0;
    mid = (mid + Math.imul(ah5, bl8)) | 0;
    hi = (hi + Math.imul(ah5, bh8)) | 0;
    lo = (lo + Math.imul(al4, bl9)) | 0;
    mid = (mid + Math.imul(al4, bh9)) | 0;
    mid = (mid + Math.imul(ah4, bl9)) | 0;
    hi = (hi + Math.imul(ah4, bh9)) | 0;
    var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
    w13 &= 0x3ffffff;
    /* k = 14 */
    lo = Math.imul(al9, bl5);
    mid = Math.imul(al9, bh5);
    mid = (mid + Math.imul(ah9, bl5)) | 0;
    hi = Math.imul(ah9, bh5);
    lo = (lo + Math.imul(al8, bl6)) | 0;
    mid = (mid + Math.imul(al8, bh6)) | 0;
    mid = (mid + Math.imul(ah8, bl6)) | 0;
    hi = (hi + Math.imul(ah8, bh6)) | 0;
    lo = (lo + Math.imul(al7, bl7)) | 0;
    mid = (mid + Math.imul(al7, bh7)) | 0;
    mid = (mid + Math.imul(ah7, bl7)) | 0;
    hi = (hi + Math.imul(ah7, bh7)) | 0;
    lo = (lo + Math.imul(al6, bl8)) | 0;
    mid = (mid + Math.imul(al6, bh8)) | 0;
    mid = (mid + Math.imul(ah6, bl8)) | 0;
    hi = (hi + Math.imul(ah6, bh8)) | 0;
    lo = (lo + Math.imul(al5, bl9)) | 0;
    mid = (mid + Math.imul(al5, bh9)) | 0;
    mid = (mid + Math.imul(ah5, bl9)) | 0;
    hi = (hi + Math.imul(ah5, bh9)) | 0;
    var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
    w14 &= 0x3ffffff;
    /* k = 15 */
    lo = Math.imul(al9, bl6);
    mid = Math.imul(al9, bh6);
    mid = (mid + Math.imul(ah9, bl6)) | 0;
    hi = Math.imul(ah9, bh6);
    lo = (lo + Math.imul(al8, bl7)) | 0;
    mid = (mid + Math.imul(al8, bh7)) | 0;
    mid = (mid + Math.imul(ah8, bl7)) | 0;
    hi = (hi + Math.imul(ah8, bh7)) | 0;
    lo = (lo + Math.imul(al7, bl8)) | 0;
    mid = (mid + Math.imul(al7, bh8)) | 0;
    mid = (mid + Math.imul(ah7, bl8)) | 0;
    hi = (hi + Math.imul(ah7, bh8)) | 0;
    lo = (lo + Math.imul(al6, bl9)) | 0;
    mid = (mid + Math.imul(al6, bh9)) | 0;
    mid = (mid + Math.imul(ah6, bl9)) | 0;
    hi = (hi + Math.imul(ah6, bh9)) | 0;
    var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
    w15 &= 0x3ffffff;
    /* k = 16 */
    lo = Math.imul(al9, bl7);
    mid = Math.imul(al9, bh7);
    mid = (mid + Math.imul(ah9, bl7)) | 0;
    hi = Math.imul(ah9, bh7);
    lo = (lo + Math.imul(al8, bl8)) | 0;
    mid = (mid + Math.imul(al8, bh8)) | 0;
    mid = (mid + Math.imul(ah8, bl8)) | 0;
    hi = (hi + Math.imul(ah8, bh8)) | 0;
    lo = (lo + Math.imul(al7, bl9)) | 0;
    mid = (mid + Math.imul(al7, bh9)) | 0;
    mid = (mid + Math.imul(ah7, bl9)) | 0;
    hi = (hi + Math.imul(ah7, bh9)) | 0;
    var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
    w16 &= 0x3ffffff;
    /* k = 17 */
    lo = Math.imul(al9, bl8);
    mid = Math.imul(al9, bh8);
    mid = (mid + Math.imul(ah9, bl8)) | 0;
    hi = Math.imul(ah9, bh8);
    lo = (lo + Math.imul(al8, bl9)) | 0;
    mid = (mid + Math.imul(al8, bh9)) | 0;
    mid = (mid + Math.imul(ah8, bl9)) | 0;
    hi = (hi + Math.imul(ah8, bh9)) | 0;
    var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
    w17 &= 0x3ffffff;
    /* k = 18 */
    lo = Math.imul(al9, bl9);
    mid = Math.imul(al9, bh9);
    mid = (mid + Math.imul(ah9, bl9)) | 0;
    hi = Math.imul(ah9, bh9);
    var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
    c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
    w18 &= 0x3ffffff;
    o[0] = w0;
    o[1] = w1;
    o[2] = w2;
    o[3] = w3;
    o[4] = w4;
    o[5] = w5;
    o[6] = w6;
    o[7] = w7;
    o[8] = w8;
    o[9] = w9;
    o[10] = w10;
    o[11] = w11;
    o[12] = w12;
    o[13] = w13;
    o[14] = w14;
    o[15] = w15;
    o[16] = w16;
    o[17] = w17;
    o[18] = w18;
    if (c !== 0) {
      o[19] = c;
      out.length++;
    }
    return out;
  };

  // Polyfill comb
  if (!Math.imul) {
    comb10MulTo = smallMulTo;
  }

  function bigMulTo (self, num, out) {
    out.negative = num.negative ^ self.negative;
    out.length = self.length + num.length;

    var carry = 0;
    var hncarry = 0;
    for (var k = 0; k < out.length - 1; k++) {
      // Sum all words with the same `i + j = k` and accumulate `ncarry`,
      // note that ncarry could be >= 0x3ffffff
      var ncarry = hncarry;
      hncarry = 0;
      var rword = carry & 0x3ffffff;
      var maxJ = Math.min(k, num.length - 1);
      for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
        var i = k - j;
        var a = self.words[i] | 0;
        var b = num.words[j] | 0;
        var r = a * b;

        var lo = r & 0x3ffffff;
        ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
        lo = (lo + rword) | 0;
        rword = lo & 0x3ffffff;
        ncarry = (ncarry + (lo >>> 26)) | 0;

        hncarry += ncarry >>> 26;
        ncarry &= 0x3ffffff;
      }
      out.words[k] = rword;
      carry = ncarry;
      ncarry = hncarry;
    }
    if (carry !== 0) {
      out.words[k] = carry;
    } else {
      out.length--;
    }

    return out._strip();
  }

  function jumboMulTo (self, num, out) {
    var fftm = new FFTM();
    return fftm.mulp(self, num, out);
  }

  BN.prototype.mulTo = function mulTo (num, out) {
    var res;
    var len = this.length + num.length;
    if (this.length === 10 && num.length === 10) {
      res = comb10MulTo(this, num, out);
    } else if (len < 63) {
      res = smallMulTo(this, num, out);
    } else if (len < 1024) {
      res = bigMulTo(this, num, out);
    } else {
      res = jumboMulTo(this, num, out);
    }

    return res;
  };

  // Cooley-Tukey algorithm for FFT
  // slightly revisited to rely on looping instead of recursion

  function FFTM (x, y) {
    this.x = x;
    this.y = y;
  }

  FFTM.prototype.makeRBT = function makeRBT (N) {
    var t = new Array(N);
    var l = BN.prototype._countBits(N) - 1;
    for (var i = 0; i < N; i++) {
      t[i] = this.revBin(i, l, N);
    }

    return t;
  };

  // Returns binary-reversed representation of `x`
  FFTM.prototype.revBin = function revBin (x, l, N) {
    if (x === 0 || x === N - 1) return x;

    var rb = 0;
    for (var i = 0; i < l; i++) {
      rb |= (x & 1) << (l - i - 1);
      x >>= 1;
    }

    return rb;
  };

  // Performs "tweedling" phase, therefore 'emulating'
  // behaviour of the recursive algorithm
  FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
    for (var i = 0; i < N; i++) {
      rtws[i] = rws[rbt[i]];
      itws[i] = iws[rbt[i]];
    }
  };

  FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
    this.permute(rbt, rws, iws, rtws, itws, N);

    for (var s = 1; s < N; s <<= 1) {
      var l = s << 1;

      var rtwdf = Math.cos(2 * Math.PI / l);
      var itwdf = Math.sin(2 * Math.PI / l);

      for (var p = 0; p < N; p += l) {
        var rtwdf_ = rtwdf;
        var itwdf_ = itwdf;

        for (var j = 0; j < s; j++) {
          var re = rtws[p + j];
          var ie = itws[p + j];

          var ro = rtws[p + j + s];
          var io = itws[p + j + s];

          var rx = rtwdf_ * ro - itwdf_ * io;

          io = rtwdf_ * io + itwdf_ * ro;
          ro = rx;

          rtws[p + j] = re + ro;
          itws[p + j] = ie + io;

          rtws[p + j + s] = re - ro;
          itws[p + j + s] = ie - io;

          /* jshint maxdepth : false */
          if (j !== l) {
            rx = rtwdf * rtwdf_ - itwdf * itwdf_;

            itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
            rtwdf_ = rx;
          }
        }
      }
    }
  };

  FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
    var N = Math.max(m, n) | 1;
    var odd = N & 1;
    var i = 0;
    for (N = N / 2 | 0; N; N = N >>> 1) {
      i++;
    }

    return 1 << i + 1 + odd;
  };

  FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
    if (N <= 1) return;

    for (var i = 0; i < N / 2; i++) {
      var t = rws[i];

      rws[i] = rws[N - i - 1];
      rws[N - i - 1] = t;

      t = iws[i];

      iws[i] = -iws[N - i - 1];
      iws[N - i - 1] = -t;
    }
  };

  FFTM.prototype.normalize13b = function normalize13b (ws, N) {
    var carry = 0;
    for (var i = 0; i < N / 2; i++) {
      var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
        Math.round(ws[2 * i] / N) +
        carry;

      ws[i] = w & 0x3ffffff;

      if (w < 0x4000000) {
        carry = 0;
      } else {
        carry = w / 0x4000000 | 0;
      }
    }

    return ws;
  };

  FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
    var carry = 0;
    for (var i = 0; i < len; i++) {
      carry = carry + (ws[i] | 0);

      rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
      rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
    }

    // Pad with zeroes
    for (i = 2 * len; i < N; ++i) {
      rws[i] = 0;
    }

    assert(carry === 0);
    assert((carry & ~0x1fff) === 0);
  };

  FFTM.prototype.stub = function stub (N) {
    var ph = new Array(N);
    for (var i = 0; i < N; i++) {
      ph[i] = 0;
    }

    return ph;
  };

  FFTM.prototype.mulp = function mulp (x, y, out) {
    var N = 2 * this.guessLen13b(x.length, y.length);

    var rbt = this.makeRBT(N);

    var _ = this.stub(N);

    var rws = new Array(N);
    var rwst = new Array(N);
    var iwst = new Array(N);

    var nrws = new Array(N);
    var nrwst = new Array(N);
    var niwst = new Array(N);

    var rmws = out.words;
    rmws.length = N;

    this.convert13b(x.words, x.length, rws, N);
    this.convert13b(y.words, y.length, nrws, N);

    this.transform(rws, _, rwst, iwst, N, rbt);
    this.transform(nrws, _, nrwst, niwst, N, rbt);

    for (var i = 0; i < N; i++) {
      var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
      iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
      rwst[i] = rx;
    }

    this.conjugate(rwst, iwst, N);
    this.transform(rwst, iwst, rmws, _, N, rbt);
    this.conjugate(rmws, _, N);
    this.normalize13b(rmws, N);

    out.negative = x.negative ^ y.negative;
    out.length = x.length + y.length;
    return out._strip();
  };

  // Multiply `this` by `num`
  BN.prototype.mul = function mul (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return this.mulTo(num, out);
  };

  // Multiply employing FFT
  BN.prototype.mulf = function mulf (num) {
    var out = new BN(null);
    out.words = new Array(this.length + num.length);
    return jumboMulTo(this, num, out);
  };

  // In-place Multiplication
  BN.prototype.imul = function imul (num) {
    return this.clone().mulTo(num, this);
  };

  BN.prototype.imuln = function imuln (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(typeof num === 'number');
    assert(num < 0x4000000);

    // Carry
    var carry = 0;
    for (var i = 0; i < this.length; i++) {
      var w = (this.words[i] | 0) * num;
      var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
      carry >>= 26;
      carry += (w / 0x4000000) | 0;
      // NOTE: lo is 27bit maximum
      carry += lo >>> 26;
      this.words[i] = lo & 0x3ffffff;
    }

    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }

    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.muln = function muln (num) {
    return this.clone().imuln(num);
  };

  // `this` * `this`
  BN.prototype.sqr = function sqr () {
    return this.mul(this);
  };

  // `this` * `this` in-place
  BN.prototype.isqr = function isqr () {
    return this.imul(this.clone());
  };

  // Math.pow(`this`, `num`)
  BN.prototype.pow = function pow (num) {
    var w = toBitArray(num);
    if (w.length === 0) return new BN(1);

    // Skip leading zeroes
    var res = this;
    for (var i = 0; i < w.length; i++, res = res.sqr()) {
      if (w[i] !== 0) break;
    }

    if (++i < w.length) {
      for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
        if (w[i] === 0) continue;

        res = res.mul(q);
      }
    }

    return res;
  };

  // Shift-left in-place
  BN.prototype.iushln = function iushln (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;
    var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
    var i;

    if (r !== 0) {
      var carry = 0;

      for (i = 0; i < this.length; i++) {
        var newCarry = this.words[i] & carryMask;
        var c = ((this.words[i] | 0) - newCarry) << r;
        this.words[i] = c | carry;
        carry = newCarry >>> (26 - r);
      }

      if (carry) {
        this.words[i] = carry;
        this.length++;
      }
    }

    if (s !== 0) {
      for (i = this.length - 1; i >= 0; i--) {
        this.words[i + s] = this.words[i];
      }

      for (i = 0; i < s; i++) {
        this.words[i] = 0;
      }

      this.length += s;
    }

    return this._strip();
  };

  BN.prototype.ishln = function ishln (bits) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushln(bits);
  };

  // Shift-right in-place
  // NOTE: `hint` is a lowest bit before trailing zeroes
  // NOTE: if `extended` is present - it will be filled with destroyed bits
  BN.prototype.iushrn = function iushrn (bits, hint, extended) {
    assert(typeof bits === 'number' && bits >= 0);
    var h;
    if (hint) {
      h = (hint - (hint % 26)) / 26;
    } else {
      h = 0;
    }

    var r = bits % 26;
    var s = Math.min((bits - r) / 26, this.length);
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    var maskedWords = extended;

    h -= s;
    h = Math.max(0, h);

    // Extended mode, copy masked part
    if (maskedWords) {
      for (var i = 0; i < s; i++) {
        maskedWords.words[i] = this.words[i];
      }
      maskedWords.length = s;
    }

    if (s === 0) {
      // No-op, we should not move anything at all
    } else if (this.length > s) {
      this.length -= s;
      for (i = 0; i < this.length; i++) {
        this.words[i] = this.words[i + s];
      }
    } else {
      this.words[0] = 0;
      this.length = 1;
    }

    var carry = 0;
    for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
      var word = this.words[i] | 0;
      this.words[i] = (carry << (26 - r)) | (word >>> r);
      carry = word & mask;
    }

    // Push carried bits as a mask
    if (maskedWords && carry !== 0) {
      maskedWords.words[maskedWords.length++] = carry;
    }

    if (this.length === 0) {
      this.words[0] = 0;
      this.length = 1;
    }

    return this._strip();
  };

  BN.prototype.ishrn = function ishrn (bits, hint, extended) {
    // TODO(indutny): implement me
    assert(this.negative === 0);
    return this.iushrn(bits, hint, extended);
  };

  // Shift-left
  BN.prototype.shln = function shln (bits) {
    return this.clone().ishln(bits);
  };

  BN.prototype.ushln = function ushln (bits) {
    return this.clone().iushln(bits);
  };

  // Shift-right
  BN.prototype.shrn = function shrn (bits) {
    return this.clone().ishrn(bits);
  };

  BN.prototype.ushrn = function ushrn (bits) {
    return this.clone().iushrn(bits);
  };

  // Test if n bit is set
  BN.prototype.testn = function testn (bit) {
    assert(typeof bit === 'number' && bit >= 0);
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) return false;

    // Check bit and return
    var w = this.words[s];

    return !!(w & q);
  };

  // Return only lowers bits of number (in-place)
  BN.prototype.imaskn = function imaskn (bits) {
    assert(typeof bits === 'number' && bits >= 0);
    var r = bits % 26;
    var s = (bits - r) / 26;

    assert(this.negative === 0, 'imaskn works only with positive numbers');

    if (this.length <= s) {
      return this;
    }

    if (r !== 0) {
      s++;
    }
    this.length = Math.min(s, this.length);

    if (r !== 0) {
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      this.words[this.length - 1] &= mask;
    }

    return this._strip();
  };

  // Return only lowers bits of number
  BN.prototype.maskn = function maskn (bits) {
    return this.clone().imaskn(bits);
  };

  // Add plain number `num` to `this`
  BN.prototype.iaddn = function iaddn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.isubn(-num);

    // Possible sign change
    if (this.negative !== 0) {
      if (this.length === 1 && (this.words[0] | 0) < num) {
        this.words[0] = num - (this.words[0] | 0);
        this.negative = 0;
        return this;
      }

      this.negative = 0;
      this.isubn(num);
      this.negative = 1;
      return this;
    }

    // Add without checks
    return this._iaddn(num);
  };

  BN.prototype._iaddn = function _iaddn (num) {
    this.words[0] += num;

    // Carry
    for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
      this.words[i] -= 0x4000000;
      if (i === this.length - 1) {
        this.words[i + 1] = 1;
      } else {
        this.words[i + 1]++;
      }
    }
    this.length = Math.max(this.length, i + 1);

    return this;
  };

  // Subtract plain number `num` from `this`
  BN.prototype.isubn = function isubn (num) {
    assert(typeof num === 'number');
    assert(num < 0x4000000);
    if (num < 0) return this.iaddn(-num);

    if (this.negative !== 0) {
      this.negative = 0;
      this.iaddn(num);
      this.negative = 1;
      return this;
    }

    this.words[0] -= num;

    if (this.length === 1 && this.words[0] < 0) {
      this.words[0] = -this.words[0];
      this.negative = 1;
    } else {
      // Carry
      for (var i = 0; i < this.length && this.words[i] < 0; i++) {
        this.words[i] += 0x4000000;
        this.words[i + 1] -= 1;
      }
    }

    return this._strip();
  };

  BN.prototype.addn = function addn (num) {
    return this.clone().iaddn(num);
  };

  BN.prototype.subn = function subn (num) {
    return this.clone().isubn(num);
  };

  BN.prototype.iabs = function iabs () {
    this.negative = 0;

    return this;
  };

  BN.prototype.abs = function abs () {
    return this.clone().iabs();
  };

  BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
    var len = num.length + shift;
    var i;

    this._expand(len);

    var w;
    var carry = 0;
    for (i = 0; i < num.length; i++) {
      w = (this.words[i + shift] | 0) + carry;
      var right = (num.words[i] | 0) * mul;
      w -= right & 0x3ffffff;
      carry = (w >> 26) - ((right / 0x4000000) | 0);
      this.words[i + shift] = w & 0x3ffffff;
    }
    for (; i < this.length - shift; i++) {
      w = (this.words[i + shift] | 0) + carry;
      carry = w >> 26;
      this.words[i + shift] = w & 0x3ffffff;
    }

    if (carry === 0) return this._strip();

    // Subtraction overflow
    assert(carry === -1);
    carry = 0;
    for (i = 0; i < this.length; i++) {
      w = -(this.words[i] | 0) + carry;
      carry = w >> 26;
      this.words[i] = w & 0x3ffffff;
    }
    this.negative = 1;

    return this._strip();
  };

  BN.prototype._wordDiv = function _wordDiv (num, mode) {
    var shift = this.length - num.length;

    var a = this.clone();
    var b = num;

    // Normalize
    var bhi = b.words[b.length - 1] | 0;
    var bhiBits = this._countBits(bhi);
    shift = 26 - bhiBits;
    if (shift !== 0) {
      b = b.ushln(shift);
      a.iushln(shift);
      bhi = b.words[b.length - 1] | 0;
    }

    // Initialize quotient
    var m = a.length - b.length;
    var q;

    if (mode !== 'mod') {
      q = new BN(null);
      q.length = m + 1;
      q.words = new Array(q.length);
      for (var i = 0; i < q.length; i++) {
        q.words[i] = 0;
      }
    }

    var diff = a.clone()._ishlnsubmul(b, 1, m);
    if (diff.negative === 0) {
      a = diff;
      if (q) {
        q.words[m] = 1;
      }
    }

    for (var j = m - 1; j >= 0; j--) {
      var qj = (a.words[b.length + j] | 0) * 0x4000000 +
        (a.words[b.length + j - 1] | 0);

      // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
      // (0x7ffffff)
      qj = Math.min((qj / bhi) | 0, 0x3ffffff);

      a._ishlnsubmul(b, qj, j);
      while (a.negative !== 0) {
        qj--;
        a.negative = 0;
        a._ishlnsubmul(b, 1, j);
        if (!a.isZero()) {
          a.negative ^= 1;
        }
      }
      if (q) {
        q.words[j] = qj;
      }
    }
    if (q) {
      q._strip();
    }
    a._strip();

    // Denormalize
    if (mode !== 'div' && shift !== 0) {
      a.iushrn(shift);
    }

    return {
      div: q || null,
      mod: a
    };
  };

  // NOTE: 1) `mode` can be set to `mod` to request mod only,
  //       to `div` to request div only, or be absent to
  //       request both div & mod
  //       2) `positive` is true if unsigned mod is requested
  BN.prototype.divmod = function divmod (num, mode, positive) {
    assert(!num.isZero());

    if (this.isZero()) {
      return {
        div: new BN(0),
        mod: new BN(0)
      };
    }

    var div, mod, res;
    if (this.negative !== 0 && num.negative === 0) {
      res = this.neg().divmod(num, mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.iadd(num);
        }
      }

      return {
        div: div,
        mod: mod
      };
    }

    if (this.negative === 0 && num.negative !== 0) {
      res = this.divmod(num.neg(), mode);

      if (mode !== 'mod') {
        div = res.div.neg();
      }

      return {
        div: div,
        mod: res.mod
      };
    }

    if ((this.negative & num.negative) !== 0) {
      res = this.neg().divmod(num.neg(), mode);

      if (mode !== 'div') {
        mod = res.mod.neg();
        if (positive && mod.negative !== 0) {
          mod.isub(num);
        }
      }

      return {
        div: res.div,
        mod: mod
      };
    }

    // Both numbers are positive at this point

    // Strip both numbers to approximate shift value
    if (num.length > this.length || this.cmp(num) < 0) {
      return {
        div: new BN(0),
        mod: this
      };
    }

    // Very short reduction
    if (num.length === 1) {
      if (mode === 'div') {
        return {
          div: this.divn(num.words[0]),
          mod: null
        };
      }

      if (mode === 'mod') {
        return {
          div: null,
          mod: new BN(this.modrn(num.words[0]))
        };
      }

      return {
        div: this.divn(num.words[0]),
        mod: new BN(this.modrn(num.words[0]))
      };
    }

    return this._wordDiv(num, mode);
  };

  // Find `this` / `num`
  BN.prototype.div = function div (num) {
    return this.divmod(num, 'div', false).div;
  };

  // Find `this` % `num`
  BN.prototype.mod = function mod (num) {
    return this.divmod(num, 'mod', false).mod;
  };

  BN.prototype.umod = function umod (num) {
    return this.divmod(num, 'mod', true).mod;
  };

  // Find Round(`this` / `num`)
  BN.prototype.divRound = function divRound (num) {
    var dm = this.divmod(num);

    // Fast case - exact division
    if (dm.mod.isZero()) return dm.div;

    var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

    var half = num.ushrn(1);
    var r2 = num.andln(1);
    var cmp = mod.cmp(half);

    // Round down
    if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

    // Round up
    return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
  };

  BN.prototype.modrn = function modrn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);
    var p = (1 << 26) % num;

    var acc = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      acc = (p * acc + (this.words[i] | 0)) % num;
    }

    return isNegNum ? -acc : acc;
  };

  // WARNING: DEPRECATED
  BN.prototype.modn = function modn (num) {
    return this.modrn(num);
  };

  // In-place division by number
  BN.prototype.idivn = function idivn (num) {
    var isNegNum = num < 0;
    if (isNegNum) num = -num;

    assert(num <= 0x3ffffff);

    var carry = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var w = (this.words[i] | 0) + carry * 0x4000000;
      this.words[i] = (w / num) | 0;
      carry = w % num;
    }

    this._strip();
    return isNegNum ? this.ineg() : this;
  };

  BN.prototype.divn = function divn (num) {
    return this.clone().idivn(num);
  };

  BN.prototype.egcd = function egcd (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var x = this;
    var y = p.clone();

    if (x.negative !== 0) {
      x = x.umod(p);
    } else {
      x = x.clone();
    }

    // A * x + B * y = x
    var A = new BN(1);
    var B = new BN(0);

    // C * x + D * y = y
    var C = new BN(0);
    var D = new BN(1);

    var g = 0;

    while (x.isEven() && y.isEven()) {
      x.iushrn(1);
      y.iushrn(1);
      ++g;
    }

    var yp = y.clone();
    var xp = x.clone();

    while (!x.isZero()) {
      for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        x.iushrn(i);
        while (i-- > 0) {
          if (A.isOdd() || B.isOdd()) {
            A.iadd(yp);
            B.isub(xp);
          }

          A.iushrn(1);
          B.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        y.iushrn(j);
        while (j-- > 0) {
          if (C.isOdd() || D.isOdd()) {
            C.iadd(yp);
            D.isub(xp);
          }

          C.iushrn(1);
          D.iushrn(1);
        }
      }

      if (x.cmp(y) >= 0) {
        x.isub(y);
        A.isub(C);
        B.isub(D);
      } else {
        y.isub(x);
        C.isub(A);
        D.isub(B);
      }
    }

    return {
      a: C,
      b: D,
      gcd: y.iushln(g)
    };
  };

  // This is reduced incarnation of the binary EEA
  // above, designated to invert members of the
  // _prime_ fields F(p) at a maximal speed
  BN.prototype._invmp = function _invmp (p) {
    assert(p.negative === 0);
    assert(!p.isZero());

    var a = this;
    var b = p.clone();

    if (a.negative !== 0) {
      a = a.umod(p);
    } else {
      a = a.clone();
    }

    var x1 = new BN(1);
    var x2 = new BN(0);

    var delta = b.clone();

    while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
      for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
      if (i > 0) {
        a.iushrn(i);
        while (i-- > 0) {
          if (x1.isOdd()) {
            x1.iadd(delta);
          }

          x1.iushrn(1);
        }
      }

      for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
      if (j > 0) {
        b.iushrn(j);
        while (j-- > 0) {
          if (x2.isOdd()) {
            x2.iadd(delta);
          }

          x2.iushrn(1);
        }
      }

      if (a.cmp(b) >= 0) {
        a.isub(b);
        x1.isub(x2);
      } else {
        b.isub(a);
        x2.isub(x1);
      }
    }

    var res;
    if (a.cmpn(1) === 0) {
      res = x1;
    } else {
      res = x2;
    }

    if (res.cmpn(0) < 0) {
      res.iadd(p);
    }

    return res;
  };

  BN.prototype.gcd = function gcd (num) {
    if (this.isZero()) return num.abs();
    if (num.isZero()) return this.abs();

    var a = this.clone();
    var b = num.clone();
    a.negative = 0;
    b.negative = 0;

    // Remove common factor of two
    for (var shift = 0; a.isEven() && b.isEven(); shift++) {
      a.iushrn(1);
      b.iushrn(1);
    }

    do {
      while (a.isEven()) {
        a.iushrn(1);
      }
      while (b.isEven()) {
        b.iushrn(1);
      }

      var r = a.cmp(b);
      if (r < 0) {
        // Swap `a` and `b` to make `a` always bigger than `b`
        var t = a;
        a = b;
        b = t;
      } else if (r === 0 || b.cmpn(1) === 0) {
        break;
      }

      a.isub(b);
    } while (true);

    return b.iushln(shift);
  };

  // Invert number in the field F(num)
  BN.prototype.invm = function invm (num) {
    return this.egcd(num).a.umod(num);
  };

  BN.prototype.isEven = function isEven () {
    return (this.words[0] & 1) === 0;
  };

  BN.prototype.isOdd = function isOdd () {
    return (this.words[0] & 1) === 1;
  };

  // And first word and num
  BN.prototype.andln = function andln (num) {
    return this.words[0] & num;
  };

  // Increment at the bit position in-line
  BN.prototype.bincn = function bincn (bit) {
    assert(typeof bit === 'number');
    var r = bit % 26;
    var s = (bit - r) / 26;
    var q = 1 << r;

    // Fast case: bit is much higher than all existing words
    if (this.length <= s) {
      this._expand(s + 1);
      this.words[s] |= q;
      return this;
    }

    // Add bit and propagate, if needed
    var carry = q;
    for (var i = s; carry !== 0 && i < this.length; i++) {
      var w = this.words[i] | 0;
      w += carry;
      carry = w >>> 26;
      w &= 0x3ffffff;
      this.words[i] = w;
    }
    if (carry !== 0) {
      this.words[i] = carry;
      this.length++;
    }
    return this;
  };

  BN.prototype.isZero = function isZero () {
    return this.length === 1 && this.words[0] === 0;
  };

  BN.prototype.cmpn = function cmpn (num) {
    var negative = num < 0;

    if (this.negative !== 0 && !negative) return -1;
    if (this.negative === 0 && negative) return 1;

    this._strip();

    var res;
    if (this.length > 1) {
      res = 1;
    } else {
      if (negative) {
        num = -num;
      }

      assert(num <= 0x3ffffff, 'Number is too big');

      var w = this.words[0] | 0;
      res = w === num ? 0 : w < num ? -1 : 1;
    }
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Compare two numbers and return:
  // 1 - if `this` > `num`
  // 0 - if `this` == `num`
  // -1 - if `this` < `num`
  BN.prototype.cmp = function cmp (num) {
    if (this.negative !== 0 && num.negative === 0) return -1;
    if (this.negative === 0 && num.negative !== 0) return 1;

    var res = this.ucmp(num);
    if (this.negative !== 0) return -res | 0;
    return res;
  };

  // Unsigned comparison
  BN.prototype.ucmp = function ucmp (num) {
    // At this point both numbers have the same sign
    if (this.length > num.length) return 1;
    if (this.length < num.length) return -1;

    var res = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      var a = this.words[i] | 0;
      var b = num.words[i] | 0;

      if (a === b) continue;
      if (a < b) {
        res = -1;
      } else if (a > b) {
        res = 1;
      }
      break;
    }
    return res;
  };

  BN.prototype.gtn = function gtn (num) {
    return this.cmpn(num) === 1;
  };

  BN.prototype.gt = function gt (num) {
    return this.cmp(num) === 1;
  };

  BN.prototype.gten = function gten (num) {
    return this.cmpn(num) >= 0;
  };

  BN.prototype.gte = function gte (num) {
    return this.cmp(num) >= 0;
  };

  BN.prototype.ltn = function ltn (num) {
    return this.cmpn(num) === -1;
  };

  BN.prototype.lt = function lt (num) {
    return this.cmp(num) === -1;
  };

  BN.prototype.lten = function lten (num) {
    return this.cmpn(num) <= 0;
  };

  BN.prototype.lte = function lte (num) {
    return this.cmp(num) <= 0;
  };

  BN.prototype.eqn = function eqn (num) {
    return this.cmpn(num) === 0;
  };

  BN.prototype.eq = function eq (num) {
    return this.cmp(num) === 0;
  };

  //
  // A reduce context, could be using montgomery or something better, depending
  // on the `m` itself.
  //
  BN.red = function red (num) {
    return new Red(num);
  };

  BN.prototype.toRed = function toRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    assert(this.negative === 0, 'red works only with positives');
    return ctx.convertTo(this)._forceRed(ctx);
  };

  BN.prototype.fromRed = function fromRed () {
    assert(this.red, 'fromRed works only with numbers in reduction context');
    return this.red.convertFrom(this);
  };

  BN.prototype._forceRed = function _forceRed (ctx) {
    this.red = ctx;
    return this;
  };

  BN.prototype.forceRed = function forceRed (ctx) {
    assert(!this.red, 'Already a number in reduction context');
    return this._forceRed(ctx);
  };

  BN.prototype.redAdd = function redAdd (num) {
    assert(this.red, 'redAdd works only with red numbers');
    return this.red.add(this, num);
  };

  BN.prototype.redIAdd = function redIAdd (num) {
    assert(this.red, 'redIAdd works only with red numbers');
    return this.red.iadd(this, num);
  };

  BN.prototype.redSub = function redSub (num) {
    assert(this.red, 'redSub works only with red numbers');
    return this.red.sub(this, num);
  };

  BN.prototype.redISub = function redISub (num) {
    assert(this.red, 'redISub works only with red numbers');
    return this.red.isub(this, num);
  };

  BN.prototype.redShl = function redShl (num) {
    assert(this.red, 'redShl works only with red numbers');
    return this.red.shl(this, num);
  };

  BN.prototype.redMul = function redMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.mul(this, num);
  };

  BN.prototype.redIMul = function redIMul (num) {
    assert(this.red, 'redMul works only with red numbers');
    this.red._verify2(this, num);
    return this.red.imul(this, num);
  };

  BN.prototype.redSqr = function redSqr () {
    assert(this.red, 'redSqr works only with red numbers');
    this.red._verify1(this);
    return this.red.sqr(this);
  };

  BN.prototype.redISqr = function redISqr () {
    assert(this.red, 'redISqr works only with red numbers');
    this.red._verify1(this);
    return this.red.isqr(this);
  };

  // Square root over p
  BN.prototype.redSqrt = function redSqrt () {
    assert(this.red, 'redSqrt works only with red numbers');
    this.red._verify1(this);
    return this.red.sqrt(this);
  };

  BN.prototype.redInvm = function redInvm () {
    assert(this.red, 'redInvm works only with red numbers');
    this.red._verify1(this);
    return this.red.invm(this);
  };

  // Return negative clone of `this` % `red modulo`
  BN.prototype.redNeg = function redNeg () {
    assert(this.red, 'redNeg works only with red numbers');
    this.red._verify1(this);
    return this.red.neg(this);
  };

  BN.prototype.redPow = function redPow (num) {
    assert(this.red && !num.red, 'redPow(normalNum)');
    this.red._verify1(this);
    return this.red.pow(this, num);
  };

  // Prime numbers with efficient reduction
  var primes = {
    k256: null,
    p224: null,
    p192: null,
    p25519: null
  };

  // Pseudo-Mersenne prime
  function MPrime (name, p) {
    // P = 2 ^ N - K
    this.name = name;
    this.p = new BN(p, 16);
    this.n = this.p.bitLength();
    this.k = new BN(1).iushln(this.n).isub(this.p);

    this.tmp = this._tmp();
  }

  MPrime.prototype._tmp = function _tmp () {
    var tmp = new BN(null);
    tmp.words = new Array(Math.ceil(this.n / 13));
    return tmp;
  };

  MPrime.prototype.ireduce = function ireduce (num) {
    // Assumes that `num` is less than `P^2`
    // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
    var r = num;
    var rlen;

    do {
      this.split(r, this.tmp);
      r = this.imulK(r);
      r = r.iadd(this.tmp);
      rlen = r.bitLength();
    } while (rlen > this.n);

    var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
    if (cmp === 0) {
      r.words[0] = 0;
      r.length = 1;
    } else if (cmp > 0) {
      r.isub(this.p);
    } else {
      r._strip();
    }

    return r;
  };

  MPrime.prototype.split = function split (input, out) {
    input.iushrn(this.n, 0, out);
  };

  MPrime.prototype.imulK = function imulK (num) {
    return num.imul(this.k);
  };

  function K256 () {
    MPrime.call(
      this,
      'k256',
      'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
  }
  inherits(K256, MPrime);

  K256.prototype.split = function split (input, output) {
    // 256 = 9 * 26 + 22
    var mask = 0x3fffff;

    var outLen = Math.min(input.length, 9);
    for (var i = 0; i < outLen; i++) {
      output.words[i] = input.words[i];
    }
    output.length = outLen;

    if (input.length <= 9) {
      input.words[0] = 0;
      input.length = 1;
      return;
    }

    // Shift by 9 limbs
    var prev = input.words[9];
    output.words[output.length++] = prev & mask;

    for (i = 10; i < input.length; i++) {
      var next = input.words[i] | 0;
      input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
      prev = next;
    }
    prev >>>= 22;
    input.words[i - 10] = prev;
    if (prev === 0 && input.length > 10) {
      input.length -= 10;
    } else {
      input.length -= 9;
    }
  };

  K256.prototype.imulK = function imulK (num) {
    // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
    num.words[num.length] = 0;
    num.words[num.length + 1] = 0;
    num.length += 2;

    // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
    var lo = 0;
    for (var i = 0; i < num.length; i++) {
      var w = num.words[i] | 0;
      lo += w * 0x3d1;
      num.words[i] = lo & 0x3ffffff;
      lo = w * 0x40 + ((lo / 0x4000000) | 0);
    }

    // Fast length reduction
    if (num.words[num.length - 1] === 0) {
      num.length--;
      if (num.words[num.length - 1] === 0) {
        num.length--;
      }
    }
    return num;
  };

  function P224 () {
    MPrime.call(
      this,
      'p224',
      'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
  }
  inherits(P224, MPrime);

  function P192 () {
    MPrime.call(
      this,
      'p192',
      'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
  }
  inherits(P192, MPrime);

  function P25519 () {
    // 2 ^ 255 - 19
    MPrime.call(
      this,
      '25519',
      '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
  }
  inherits(P25519, MPrime);

  P25519.prototype.imulK = function imulK (num) {
    // K = 0x13
    var carry = 0;
    for (var i = 0; i < num.length; i++) {
      var hi = (num.words[i] | 0) * 0x13 + carry;
      var lo = hi & 0x3ffffff;
      hi >>>= 26;

      num.words[i] = lo;
      carry = hi;
    }
    if (carry !== 0) {
      num.words[num.length++] = carry;
    }
    return num;
  };

  // Exported mostly for testing purposes, use plain name instead
  BN._prime = function prime (name) {
    // Cached version of prime
    if (primes[name]) return primes[name];

    var prime;
    if (name === 'k256') {
      prime = new K256();
    } else if (name === 'p224') {
      prime = new P224();
    } else if (name === 'p192') {
      prime = new P192();
    } else if (name === 'p25519') {
      prime = new P25519();
    } else {
      throw new Error('Unknown prime ' + name);
    }
    primes[name] = prime;

    return prime;
  };

  //
  // Base reduction engine
  //
  function Red (m) {
    if (typeof m === 'string') {
      var prime = BN._prime(m);
      this.m = prime.p;
      this.prime = prime;
    } else {
      assert(m.gtn(1), 'modulus must be greater than 1');
      this.m = m;
      this.prime = null;
    }
  }

  Red.prototype._verify1 = function _verify1 (a) {
    assert(a.negative === 0, 'red works only with positives');
    assert(a.red, 'red works only with red numbers');
  };

  Red.prototype._verify2 = function _verify2 (a, b) {
    assert((a.negative | b.negative) === 0, 'red works only with positives');
    assert(a.red && a.red === b.red,
      'red works only with red numbers');
  };

  Red.prototype.imod = function imod (a) {
    if (this.prime) return this.prime.ireduce(a)._forceRed(this);

    a.umod(this.m)._forceRed(this)._move(a);
    return a;
  };

  Red.prototype.neg = function neg (a) {
    if (a.isZero()) {
      return a.clone();
    }

    return this.m.sub(a)._forceRed(this);
  };

  Red.prototype.add = function add (a, b) {
    this._verify2(a, b);

    var res = a.add(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.iadd = function iadd (a, b) {
    this._verify2(a, b);

    var res = a.iadd(b);
    if (res.cmp(this.m) >= 0) {
      res.isub(this.m);
    }
    return res;
  };

  Red.prototype.sub = function sub (a, b) {
    this._verify2(a, b);

    var res = a.sub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res._forceRed(this);
  };

  Red.prototype.isub = function isub (a, b) {
    this._verify2(a, b);

    var res = a.isub(b);
    if (res.cmpn(0) < 0) {
      res.iadd(this.m);
    }
    return res;
  };

  Red.prototype.shl = function shl (a, num) {
    this._verify1(a);
    return this.imod(a.ushln(num));
  };

  Red.prototype.imul = function imul (a, b) {
    this._verify2(a, b);
    return this.imod(a.imul(b));
  };

  Red.prototype.mul = function mul (a, b) {
    this._verify2(a, b);
    return this.imod(a.mul(b));
  };

  Red.prototype.isqr = function isqr (a) {
    return this.imul(a, a.clone());
  };

  Red.prototype.sqr = function sqr (a) {
    return this.mul(a, a);
  };

  Red.prototype.sqrt = function sqrt (a) {
    if (a.isZero()) return a.clone();

    var mod3 = this.m.andln(3);
    assert(mod3 % 2 === 1);

    // Fast case
    if (mod3 === 3) {
      var pow = this.m.add(new BN(1)).iushrn(2);
      return this.pow(a, pow);
    }

    // Tonelli-Shanks algorithm (Totally unoptimized and slow)
    //
    // Find Q and S, that Q * 2 ^ S = (P - 1)
    var q = this.m.subn(1);
    var s = 0;
    while (!q.isZero() && q.andln(1) === 0) {
      s++;
      q.iushrn(1);
    }
    assert(!q.isZero());

    var one = new BN(1).toRed(this);
    var nOne = one.redNeg();

    // Find quadratic non-residue
    // NOTE: Max is such because of generalized Riemann hypothesis.
    var lpow = this.m.subn(1).iushrn(1);
    var z = this.m.bitLength();
    z = new BN(2 * z * z).toRed(this);

    while (this.pow(z, lpow).cmp(nOne) !== 0) {
      z.redIAdd(nOne);
    }

    var c = this.pow(z, q);
    var r = this.pow(a, q.addn(1).iushrn(1));
    var t = this.pow(a, q);
    var m = s;
    while (t.cmp(one) !== 0) {
      var tmp = t;
      for (var i = 0; tmp.cmp(one) !== 0; i++) {
        tmp = tmp.redSqr();
      }
      assert(i < m);
      var b = this.pow(c, new BN(1).iushln(m - i - 1));

      r = r.redMul(b);
      c = b.redSqr();
      t = t.redMul(c);
      m = i;
    }

    return r;
  };

  Red.prototype.invm = function invm (a) {
    var inv = a._invmp(this.m);
    if (inv.negative !== 0) {
      inv.negative = 0;
      return this.imod(inv).redNeg();
    } else {
      return this.imod(inv);
    }
  };

  Red.prototype.pow = function pow (a, num) {
    if (num.isZero()) return new BN(1).toRed(this);
    if (num.cmpn(1) === 0) return a.clone();

    var windowSize = 4;
    var wnd = new Array(1 << windowSize);
    wnd[0] = new BN(1).toRed(this);
    wnd[1] = a;
    for (var i = 2; i < wnd.length; i++) {
      wnd[i] = this.mul(wnd[i - 1], a);
    }

    var res = wnd[0];
    var current = 0;
    var currentLen = 0;
    var start = num.bitLength() % 26;
    if (start === 0) {
      start = 26;
    }

    for (i = num.length - 1; i >= 0; i--) {
      var word = num.words[i];
      for (var j = start - 1; j >= 0; j--) {
        var bit = (word >> j) & 1;
        if (res !== wnd[0]) {
          res = this.sqr(res);
        }

        if (bit === 0 && current === 0) {
          currentLen = 0;
          continue;
        }

        current <<= 1;
        current |= bit;
        currentLen++;
        if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

        res = this.mul(res, wnd[current]);
        currentLen = 0;
        current = 0;
      }
      start = 26;
    }

    return res;
  };

  Red.prototype.convertTo = function convertTo (num) {
    var r = num.umod(this.m);

    return r === num ? r.clone() : r;
  };

  Red.prototype.convertFrom = function convertFrom (num) {
    var res = num.clone();
    res.red = null;
    return res;
  };

  //
  // Montgomery method engine
  //

  BN.mont = function mont (num) {
    return new Mont(num);
  };

  function Mont (m) {
    Red.call(this, m);

    this.shift = this.m.bitLength();
    if (this.shift % 26 !== 0) {
      this.shift += 26 - (this.shift % 26);
    }

    this.r = new BN(1).iushln(this.shift);
    this.r2 = this.imod(this.r.sqr());
    this.rinv = this.r._invmp(this.m);

    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
    this.minv = this.minv.umod(this.r);
    this.minv = this.r.sub(this.minv);
  }
  inherits(Mont, Red);

  Mont.prototype.convertTo = function convertTo (num) {
    return this.imod(num.ushln(this.shift));
  };

  Mont.prototype.convertFrom = function convertFrom (num) {
    var r = this.imod(num.mul(this.rinv));
    r.red = null;
    return r;
  };

  Mont.prototype.imul = function imul (a, b) {
    if (a.isZero() || b.isZero()) {
      a.words[0] = 0;
      a.length = 1;
      return a;
    }

    var t = a.imul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;

    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.mul = function mul (a, b) {
    if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

    var t = a.mul(b);
    var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
    var u = t.isub(c).iushrn(this.shift);
    var res = u;
    if (u.cmp(this.m) >= 0) {
      res = u.isub(this.m);
    } else if (u.cmpn(0) < 0) {
      res = u.iadd(this.m);
    }

    return res._forceRed(this);
  };

  Mont.prototype.invm = function invm (a) {
    // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
    var res = this.imod(a._invmp(this.m).mul(this.r2));
    return res._forceRed(this);
  };
})(typeof module === 'undefined' || module, this);

},{"buffer":32}],32:[function(require,module,exports){

},{}],33:[function(require,module,exports){
(function (Buffer){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol.for === 'function')
    ? Symbol.for('nodejs.util.inspect.custom')
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

}).call(this,require("buffer").Buffer)
},{"base64-js":30,"buffer":33,"ieee754":57}],34:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../insert-module-globals/node_modules/is-buffer/index.js")})
},{"../../insert-module-globals/node_modules/is-buffer/index.js":59}],35:[function(require,module,exports){
'use strict';

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;
	const clear = defaultClear || clearTimeout;

	const signalListener = () => {
		clear(timeoutId);
		rejectFn(createAbortError());
	};

	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

		rejectFn = reject;
		timeoutId = (set || setTimeout)(settle, ms);
	});

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		cleanup();
		settle();
	};

	return delayPromise;
};

const delay = createDelay({willResolve: true});
delay.reject = createDelay({willResolve: false});
delay.createWithTimers = ({clearTimeout, setTimeout}) => {
	const delay = createDelay({clearTimeout, setTimeout, willResolve: true});
	delay.reject = createDelay({clearTimeout, setTimeout, willResolve: false});
	return delay;
};

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;

},{}],36:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],37:[function(require,module,exports){
// originally pulled out of simple-peer

module.exports = function getBrowserRTC () {
  if (typeof window === 'undefined') return null
  var wrtc = {
    RTCPeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection,
    RTCSessionDescription: window.RTCSessionDescription ||
      window.mozRTCSessionDescription || window.webkitRTCSessionDescription,
    RTCIceCandidate: window.RTCIceCandidate || window.mozRTCIceCandidate ||
      window.webkitRTCIceCandidate
  }
  if (!wrtc.RTCPeerConnection) return null
  return wrtc
}

},{}],38:[function(require,module,exports){
var hash = exports;

hash.utils = require('./hash/utils');
hash.common = require('./hash/common');
hash.sha = require('./hash/sha');
hash.ripemd = require('./hash/ripemd');
hash.hmac = require('./hash/hmac');

// Proxy hash functions to the main object
hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;

},{"./hash/common":39,"./hash/hmac":40,"./hash/ripemd":41,"./hash/sha":42,"./hash/utils":49}],39:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var assert = require('minimalistic-assert');

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function update(msg, enc) {
  // Convert message to array, pad it, and join into 32bit blocks
  msg = utils.toArray(msg, enc);
  if (!this.pending)
    this.pending = msg;
  else
    this.pending = this.pending.concat(msg);
  this.pendingTotal += msg.length;

  // Enough data, try updating
  if (this.pending.length >= this._delta8) {
    msg = this.pending;

    // Process pending data in blocks
    var r = msg.length % this._delta8;
    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0)
      this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function digest(enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function pad() {
  var len = this.pendingTotal;
  var bytes = this._delta8;
  var k = bytes - ((len + this.padLength) % bytes);
  var res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++)
    res[i] = 0;

  // Append length
  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++)
      res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++)
      res[i++] = 0;
  }

  return res;
};

},{"./utils":49,"minimalistic-assert":62}],40:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var assert = require('minimalistic-assert');

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac))
    return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function init(key) {
  // Shorten key, if needed
  if (key.length > this.blockSize)
    key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  // Add padding to key
  for (var i = key.length; i < this.blockSize; i++)
    key.push(0);

  for (i = 0; i < key.length; i++)
    key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  // 0x36 ^ 0x5c = 0x6a
  for (i = 0; i < key.length; i++)
    key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function update(msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function digest(enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};

},{"./utils":49,"minimalistic-assert":62}],41:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var common = require('./common');

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_3 = utils.sum32_3;
var sum32_4 = utils.sum32_4;
var BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160))
    return new RIPEMD160();

  BlockHash.call(this);

  this.h = [ 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 ];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function update(msg, start) {
  var A = this.h[0];
  var B = this.h[1];
  var C = this.h[2];
  var D = this.h[3];
  var E = this.h[4];
  var Ah = A;
  var Bh = B;
  var Ch = C;
  var Dh = D;
  var Eh = E;
  for (var j = 0; j < 80; j++) {
    var T = sum32(
      rotl32(
        sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
        s[j]),
      E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(
        sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
        sh[j]),
      Eh);
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'little');
  else
    return utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  if (j <= 15)
    return x ^ y ^ z;
  else if (j <= 31)
    return (x & y) | ((~x) & z);
  else if (j <= 47)
    return (x | (~y)) ^ z;
  else if (j <= 63)
    return (x & z) | (y & (~z));
  else
    return x ^ (y | (~z));
}

function K(j) {
  if (j <= 15)
    return 0x00000000;
  else if (j <= 31)
    return 0x5a827999;
  else if (j <= 47)
    return 0x6ed9eba1;
  else if (j <= 63)
    return 0x8f1bbcdc;
  else
    return 0xa953fd4e;
}

function Kh(j) {
  if (j <= 15)
    return 0x50a28be6;
  else if (j <= 31)
    return 0x5c4dd124;
  else if (j <= 47)
    return 0x6d703ef3;
  else if (j <= 63)
    return 0x7a6d76e9;
  else
    return 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];

},{"./common":39,"./utils":49}],42:[function(require,module,exports){
'use strict';

exports.sha1 = require('./sha/1');
exports.sha224 = require('./sha/224');
exports.sha256 = require('./sha/256');
exports.sha384 = require('./sha/384');
exports.sha512 = require('./sha/512');

},{"./sha/1":43,"./sha/224":44,"./sha/256":45,"./sha/384":46,"./sha/512":47}],43:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var shaCommon = require('./common');

var rotl32 = utils.rotl32;
var sum32 = utils.sum32;
var sum32_5 = utils.sum32_5;
var ft_1 = shaCommon.ft_1;
var BlockHash = common.BlockHash;

var sha1_K = [
  0x5A827999, 0x6ED9EBA1,
  0x8F1BBCDC, 0xCA62C1D6
];

function SHA1() {
  if (!(this instanceof SHA1))
    return new SHA1();

  BlockHash.call(this);
  this.h = [
    0x67452301, 0xefcdab89, 0x98badcfe,
    0x10325476, 0xc3d2e1f0 ];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];

  for(; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20);
    var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

},{"../common":39,"../utils":49,"./common":48}],44:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var SHA256 = require('./256');

function SHA224() {
  if (!(this instanceof SHA224))
    return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4 ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function digest(enc) {
  // Just truncate output
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 7), 'big');
  else
    return utils.split32(this.h.slice(0, 7), 'big');
};


},{"../utils":49,"./256":45}],45:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var shaCommon = require('./common');
var assert = require('minimalistic-assert');

var sum32 = utils.sum32;
var sum32_4 = utils.sum32_4;
var sum32_5 = utils.sum32_5;
var ch32 = shaCommon.ch32;
var maj32 = shaCommon.maj32;
var s0_256 = shaCommon.s0_256;
var s1_256 = shaCommon.s1_256;
var g0_256 = shaCommon.g0_256;
var g1_256 = shaCommon.g1_256;

var BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256))
    return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function _update(msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0];
  var b = this.h[1];
  var c = this.h[2];
  var d = this.h[3];
  var e = this.h[4];
  var f = this.h[5];
  var g = this.h[6];
  var h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
    var T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

},{"../common":39,"../utils":49,"./common":48,"minimalistic-assert":62}],46:[function(require,module,exports){
'use strict';

var utils = require('../utils');

var SHA512 = require('./512');

function SHA384() {
  if (!(this instanceof SHA384))
    return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8,
    0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17,
    0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31,
    0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7,
    0x47b5481d, 0xbefa4fa4 ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h.slice(0, 12), 'big');
  else
    return utils.split32(this.h.slice(0, 12), 'big');
};

},{"../utils":49,"./512":47}],47:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var common = require('../common');
var assert = require('minimalistic-assert');

var rotr64_hi = utils.rotr64_hi;
var rotr64_lo = utils.rotr64_lo;
var shr64_hi = utils.shr64_hi;
var shr64_lo = utils.shr64_lo;
var sum64 = utils.sum64;
var sum64_hi = utils.sum64_hi;
var sum64_lo = utils.sum64_lo;
var sum64_4_hi = utils.sum64_4_hi;
var sum64_4_lo = utils.sum64_4_lo;
var sum64_5_hi = utils.sum64_5_hi;
var sum64_5_lo = utils.sum64_5_lo;

var BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512))
    return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908,
    0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b,
    0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1,
    0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b,
    0x5be0cd19, 0x137e2179 ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
  var W = this.W;

  // 32 x 32bit words
  for (var i = 0; i < 32; i++)
    W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);  // i - 2
    var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
    var c1_hi = W[i - 14];  // i - 7
    var c1_lo = W[i - 13];
    var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);  // i - 15
    var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
    var c3_hi = W[i - 32];  // i - 16
    var c3_lo = W[i - 31];

    W[i] = sum64_4_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function _update(msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W;

  var ah = this.h[0];
  var al = this.h[1];
  var bh = this.h[2];
  var bl = this.h[3];
  var ch = this.h[4];
  var cl = this.h[5];
  var dh = this.h[6];
  var dl = this.h[7];
  var eh = this.h[8];
  var el = this.h[9];
  var fh = this.h[10];
  var fl = this.h[11];
  var gh = this.h[12];
  var gl = this.h[13];
  var hh = this.h[14];
  var hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh;
    var c0_lo = hl;
    var c1_hi = s1_512_hi(eh, el);
    var c1_lo = s1_512_lo(eh, el);
    var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
    var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
    var c3_hi = this.k[i];
    var c3_lo = this.k[i + 1];
    var c4_hi = W[i];
    var c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo,
      c1_hi, c1_lo,
      c2_hi, c2_lo,
      c3_hi, c3_lo,
      c4_hi, c4_lo);

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
    var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function digest(enc) {
  if (enc === 'hex')
    return utils.toHex32(this.h, 'big');
  else
    return utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ ((~xh) & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ ((~xl) & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 28);
  var c1_hi = rotr64_hi(xl, xh, 2);  // 34
  var c2_hi = rotr64_hi(xl, xh, 7);  // 39

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 28);
  var c1_lo = rotr64_lo(xl, xh, 2);  // 34
  var c2_lo = rotr64_lo(xl, xh, 7);  // 39

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 14);
  var c1_hi = rotr64_hi(xh, xl, 18);
  var c2_hi = rotr64_hi(xl, xh, 9);  // 41

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 14);
  var c1_lo = rotr64_lo(xh, xl, 18);
  var c2_lo = rotr64_lo(xl, xh, 9);  // 41

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 1);
  var c1_hi = rotr64_hi(xh, xl, 8);
  var c2_hi = shr64_hi(xh, xl, 7);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 1);
  var c1_lo = rotr64_lo(xh, xl, 8);
  var c2_lo = shr64_lo(xh, xl, 7);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var c0_hi = rotr64_hi(xh, xl, 19);
  var c1_hi = rotr64_hi(xl, xh, 29);  // 61
  var c2_hi = shr64_hi(xh, xl, 6);

  var r = c0_hi ^ c1_hi ^ c2_hi;
  if (r < 0)
    r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var c0_lo = rotr64_lo(xh, xl, 19);
  var c1_lo = rotr64_lo(xl, xh, 29);  // 61
  var c2_lo = shr64_lo(xh, xl, 6);

  var r = c0_lo ^ c1_lo ^ c2_lo;
  if (r < 0)
    r += 0x100000000;
  return r;
}

},{"../common":39,"../utils":49,"minimalistic-assert":62}],48:[function(require,module,exports){
'use strict';

var utils = require('../utils');
var rotr32 = utils.rotr32;

function ft_1(s, x, y, z) {
  if (s === 0)
    return ch32(x, y, z);
  if (s === 1 || s === 3)
    return p32(x, y, z);
  if (s === 2)
    return maj32(x, y, z);
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ ((~x) & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;

},{"../utils":49}],49:[function(require,module,exports){
'use strict';

var assert = require('minimalistic-assert');
var inherits = require('inherits');

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  if ((msg.charCodeAt(i) & 0xFC00) !== 0xD800) {
    return false;
  }
  if (i < 0 || i + 1 >= msg.length) {
    return false;
  }
  return (msg.charCodeAt(i + 1) & 0xFC00) === 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg))
    return msg.slice();
  if (!msg)
    return [];
  var res = [];
  if (typeof msg === 'string') {
    if (!enc) {
      // Inspired by stringToUtf8ByteArray() in closure-library by Google
      // https://github.com/google/closure-library/blob/8598d87242af59aac233270742c8984e2b2bdbe0/closure/goog/crypt/crypt.js#L117-L143
      // Apache License 2.0
      // https://github.com/google/closure-library/blob/master/LICENSE
      var p = 0;
      for (var i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) {
          res[p++] = c;
        } else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    } else if (enc === 'hex') {
      msg = msg.replace(/[^a-z0-9]+/ig, '');
      if (msg.length % 2 !== 0)
        msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else {
    for (i = 0; i < msg.length; i++)
      res[i] = msg[i] | 0;
  }
  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++)
    res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res = (w >>> 24) |
            ((w >>> 8) & 0xff00) |
            ((w << 8) & 0xff0000) |
            ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little')
      w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  if (word.length === 1)
    return '0' + word;
  else
    return word;
}
exports.zero2 = zero2;

function zero8(word) {
  if (word.length === 7)
    return '0' + word;
  else if (word.length === 6)
    return '00' + word;
  else if (word.length === 5)
    return '000' + word;
  else if (word.length === 4)
    return '0000' + word;
  else if (word.length === 3)
    return '00000' + word;
  else if (word.length === 2)
    return '000000' + word;
  else if (word.length === 1)
    return '0000000' + word;
  else
    return word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 === 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w;
    if (endian === 'big')
      w = (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3];
    else
      w = (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos];
  var bl = buf[pos + 1];

  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  var lo = (al + bl) >>> 0;
  var hi = (lo < al ? 1 : 0) + ah + bh;
  return hi >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  var lo = al + bl;
  return lo >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;

  var hi = ah + bh + ch + dh + carry;
  return hi >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  var lo = al + bl + cl + dl;
  return lo >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0;
  var lo = al;
  lo = (lo + bl) >>> 0;
  carry += lo < al ? 1 : 0;
  lo = (lo + cl) >>> 0;
  carry += lo < cl ? 1 : 0;
  lo = (lo + dl) >>> 0;
  carry += lo < dl ? 1 : 0;
  lo = (lo + el) >>> 0;
  carry += lo < el ? 1 : 0;

  var hi = ah + bh + ch + dh + eh + carry;
  return hi >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var lo = al + bl + cl + dl + el;

  return lo >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  var r = (al << (32 - num)) | (ah >>> num);
  return r >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  var r = (ah << (32 - num)) | (al >>> num);
  return r >>> 0;
}
exports.shr64_lo = shr64_lo;

},{"inherits":58,"minimalistic-assert":62}],50:[function(require,module,exports){
const createTestableErrorClass = require('testable-error')
module.exports = createTestableErrorClass('BytesLengthError')

},{"testable-error":111}],51:[function(require,module,exports){
const Template = require('./Template')
const Split = require('./Split')

module.exports = class Dictionary extends Template {
  constructor(keys, templates) {
    super()
    this.keys = keys
    this.templates = templates
  }

  encode(values) {
    const templateEncodings = this.templates.map((template, index) => {
      const key = this.keys[index]
      return template.encode(values[key])
    })
    const templateEncodingsLength = templateEncodings.reduce((total, templateEncoding) => {
      return total += templateEncoding.length
    }, 0)
    const encoding = new Uint8Array(templateEncodingsLength)

    let offset = 0
    templateEncodings.forEach((templateEncoding) => {
      encoding.set(templateEncoding, offset)
      offset += templateEncoding.length
    })
    return encoding
  }

  decodeWithRemainder(_encoding) {
    let encoding = _encoding
    const values = {}

    this.keys.forEach((key, index) => {
      const template = this.templates[index]
      const result = template.decodeWithRemainder(encoding)
      values[key] = result.value
      encoding = result.remainder
    })

    return {
      value: values,
      remainder: encoding
    }
  }
}

},{"./Split":54,"./Template":55}],52:[function(require,module,exports){
const arguguard = require('arguguard')
const intcoder = require('intcoder')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')
const Template = require('./Template')

module.exports = class Dynamic extends Template {
  constructor(lengthEncodingLength) {
    super()
    this.lengthEncodingLength = lengthEncodingLength
  }

  encode(bytes) {
    const encoding = new Uint8Array(this.lengthEncodingLength + bytes.length)
    const unpaddedLengthEncoding = intcoder.encode(bytes.length)

    if (unpaddedLengthEncoding.length > this.lengthEncodingLength) {
      throw new BytesLengthError(`Byte length of ${bytes.length} cannot be expressed within ${this.lengthEncodingLength} bytes`)
    }

    const padding = this.lengthEncodingLength - unpaddedLengthEncoding.length

    encoding.set(unpaddedLengthEncoding, padding)
    encoding.set(bytes, this.lengthEncodingLength)

    return encoding
  }

  decodeWithRemainder(encoding) {
    const lengthEncoding = encoding.slice(0, this.lengthEncodingLength)
    const length = intcoder.decode(lengthEncoding)
    const end = this.lengthEncodingLength + length
    return {
      value: encoding.slice(this.lengthEncodingLength, end),
      remainder: encoding.slice(end)
    }
  }
}

},{"./BytesLengthError":50,"./Template":55,"./integerValidator":56,"arguguard":27,"intcoder":60}],53:[function(require,module,exports){
const arguguard = require('arguguard')
const BytesLengthError = require('./BytesLengthError')
const integerValidator = require('./integerValidator')
const Template = require('./Template')

module.exports = class Fixed extends Template {
  constructor(length) {
    super()
    this.length = length
  }

  encode(bytes) {
    if (bytes.length !== this.length) {
      throw new BytesLengthError(`Expected ${this.length}, received ${bytes.length}`)
    }
    return bytes
  }

  decodeWithRemainder(encoding) {
    return {
      value: encoding.slice(0, this.length),
      remainder: encoding.slice(this.length)
    }
  }
}

},{"./BytesLengthError":50,"./Template":55,"./integerValidator":56,"arguguard":27}],54:[function(require,module,exports){
const arguguard = require('arguguard')
const integerValidator = require('./integerValidator')
const intcoder = require('intcoder')
const Template = require('./Template')

module.exports = class Split extends Template {
  constructor(branchKeys, branchTemplates) {
    super()
    this.branchKeys = branchKeys
    this.branchTemplates = branchTemplates
  }

  getBranchIndex(branchKey) {
    const index = this.branchKeys.indexOf(branchKey)
    if (index === -1) {
      throw new Error(`Invalid Branch Key "${branchKey}"`)
    }
    return index
  }

  encode(value) {
    const branchKey = value.key
    const branchValue = value.value
    const branchIndex = this.getBranchIndex(branchKey)
    const valueEncoded = this.branchTemplates[branchIndex].encode(branchValue)
    const encoded = new Uint8Array(1 + valueEncoded.length)
    encoded[0] = branchIndex
    encoded.set(valueEncoded, 1)
    return encoded
  }

  decodeWithRemainder(encoded) {
    const branchIndex = encoded[0]
    const branchKey = this.branchKeys[branchIndex]
    const branchTemplate = this.branchTemplates[branchIndex]
    const decodedWithRemainder = branchTemplate.decodeWithRemainder(encoded.slice(1))
    return {
      value: {
        key: branchKey,
        value: decodedWithRemainder.value
      },
      remainder: decodedWithRemainder.remainder
    }
  }
}

},{"./Template":55,"./integerValidator":56,"arguguard":27,"intcoder":60}],55:[function(require,module,exports){
module.exports = class Template {
  decode(encoding) {
    const decodedWithRemainder = this.decodeWithRemainder(encoding)
    if (decodedWithRemainder.remainder.length > 0) {
      //TODO: test
      throw new Error('Remainder where there should be none')
    }
    return decodedWithRemainder.value
  }
}

},{}],56:[function(require,module,exports){
const Validator = require('arguguard/lib/Validator')

module.exports = new Validator('Integer', (int) => {
  if (typeof int !== 'number' || !Number.isInteger(int) || int < 0) {
    throw new Error(`Expects a non-negative integer, received ${int}`)
  }
})

},{"arguguard/lib/Validator":28}],57:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],58:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],59:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],60:[function(require,module,exports){
const arguguard = require('arguguard')
const Validator = require('arguguard/lib/Validator')

const integerValidator = new Validator('Integer', (int) => {
  if (isNaN(int)) {
    throw new Error('Should be a number')
  }
  if (!Number.isInteger(int)) {
    throw new Error('Should be an integer')
  }
  if (int < 0) {
    throw new Error('Should be non-negative')
  }
})

function nextByte(integer, encodingArray) {
  encodingArray.unshift(integer % 256)
  if (integer >= 256) {
    nextByte(Math.floor(integer / 256), encodingArray)
  }
  return encodingArray
}

module.exports.encode = function encode(integer) {
  arguguard('intcoder.encode', [integerValidator], arguments)
  return new Uint8Array(nextByte(integer, []))
}

module.exports.decode = function decode(uint8Array) {
  arguguard('intcoder.decode', ['Uint8Array'], arguments)
  const uint8ArrayLength = uint8Array.length
  let integer = 0
  uint8Array.forEach((uint8, index) => {
    if (uint8 === 0) {
      return
    }
    const exp = uint8ArrayLength - index - 1
    const multiplier = Math.pow(256, exp)
    integer += (uint8 * multiplier)
  })
  return integer
}

},{"arguguard":27,"arguguard/lib/Validator":28}],61:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],62:[function(require,module,exports){
module.exports = assert;

function assert(val, msg) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

assert.equal = function assertEqual(l, r, msg) {
  if (l != r)
    throw new Error(msg || ('Assertion failed: ' + l + ' != ' + r));
};

},{}],63:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],64:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Buttercup = /** @class */ (function () {
    function Buttercup(uish) {
        this.uu = pollenium_uvaursi_1.Uu.wrap(uish);
        this.u = this.uu.u;
    }
    Buttercup.prototype.genCasted = function (ExternalClass) {
        return new ExternalClass(this.uu.u.slice());
    };
    return Buttercup;
}());
exports.Buttercup = Buttercup;

},{"pollenium-uvaursi":77}],65:[function(require,module,exports){
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
exports.__esModule = true;
var Buttercup_1 = require("./Buttercup");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var InvalidLengthError = /** @class */ (function (_super) {
    __extends(InvalidLengthError, _super);
    function InvalidLengthError(length, uLength) {
        return _super.call(this, "Invalid length; Expected " + length + " received " + uLength) || this;
    }
    return InvalidLengthError;
}(Error));
exports.InvalidLengthError = InvalidLengthError;
var FixButtercup = /** @class */ (function (_super) {
    __extends(FixButtercup, _super);
    function FixButtercup(length, uish) {
        var _this = _super.call(this, uish) || this;
        if (_this.uu.u.length !== length) {
            throw new InvalidLengthError(length, _this.uu.u.length);
        }
        return _this;
    }
    return FixButtercup;
}(Buttercup_1.Buttercup));
exports.FixButtercup = FixButtercup;
var FixLeftButtercup = /** @class */ (function (_super) {
    __extends(FixLeftButtercup, _super);
    function FixLeftButtercup(length, uish) {
        return _super.call(this, length, pollenium_uvaursi_1.Uu.wrap(uish).genPaddedLeft(length)) || this;
    }
    return FixLeftButtercup;
}(FixButtercup));
exports.FixLeftButtercup = FixLeftButtercup;
var FixRightButtercup = /** @class */ (function (_super) {
    __extends(FixRightButtercup, _super);
    function FixRightButtercup(length, uish) {
        return _super.call(this, length, pollenium_uvaursi_1.Uu.wrap(uish).genPaddedRight(length)) || this;
    }
    return FixRightButtercup;
}(FixButtercup));
exports.FixRightButtercup = FixRightButtercup;

},{"./Buttercup":64,"pollenium-uvaursi":77}],66:[function(require,module,exports){
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
exports.__esModule = true;
var fixButtercups_1 = require("../buttercups/fixButtercups");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var Address = /** @class */ (function (_super) {
    __extends(Address, _super);
    function Address(uish) {
        var _this = _super.call(this, 20, uish) || this;
        _this.isNull = null;
        return _this;
    }
    Address.prototype.getIsNull = function () {
        if (this.isNull !== null) {
            return this.isNull;
        }
        this.isNull = this.uu.u.every(function (byte) {
            return byte === 0;
        });
        return this.isNull;
    };
    Address.genNull = function () {
        return new Address(pollenium_uvaursi_1.Uu.genZeros(20));
    };
    return Address;
}(fixButtercups_1.FixButtercup));
exports.Address = Address;

},{"../buttercups/fixButtercups":65,"pollenium-uvaursi":77}],67:[function(require,module,exports){
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
exports.__esModule = true;
var Buttercup_1 = require("../buttercups/Buttercup");
var Bytes = /** @class */ (function (_super) {
    __extends(Bytes, _super);
    function Bytes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bytes;
}(Buttercup_1.Buttercup));
exports.Bytes = Bytes;

},{"../buttercups/Buttercup":64}],68:[function(require,module,exports){
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
exports.__esModule = true;
var BytesX_1 = require("../internals/BytesX");
var Bytes1 = /** @class */ (function (_super) {
    __extends(Bytes1, _super);
    function Bytes1(uish) {
        return _super.call(this, Bytes1.LENGTH, uish) || this;
    }
    Bytes1.LENGTH = 1;
    return Bytes1;
}(BytesX_1.BytesX));
exports.Bytes1 = Bytes1;
var Bytes2 = /** @class */ (function (_super) {
    __extends(Bytes2, _super);
    function Bytes2(uish) {
        return _super.call(this, Bytes2.LENGTH, uish) || this;
    }
    Bytes2.LENGTH = 2;
    return Bytes2;
}(BytesX_1.BytesX));
exports.Bytes2 = Bytes2;
var Bytes3 = /** @class */ (function (_super) {
    __extends(Bytes3, _super);
    function Bytes3(uish) {
        return _super.call(this, Bytes3.LENGTH, uish) || this;
    }
    Bytes3.LENGTH = 3;
    return Bytes3;
}(BytesX_1.BytesX));
exports.Bytes3 = Bytes3;
var Bytes4 = /** @class */ (function (_super) {
    __extends(Bytes4, _super);
    function Bytes4(uish) {
        return _super.call(this, Bytes4.LENGTH, uish) || this;
    }
    Bytes4.LENGTH = 4;
    return Bytes4;
}(BytesX_1.BytesX));
exports.Bytes4 = Bytes4;
var Bytes5 = /** @class */ (function (_super) {
    __extends(Bytes5, _super);
    function Bytes5(uish) {
        return _super.call(this, Bytes5.LENGTH, uish) || this;
    }
    Bytes5.LENGTH = 5;
    return Bytes5;
}(BytesX_1.BytesX));
exports.Bytes5 = Bytes5;
var Bytes6 = /** @class */ (function (_super) {
    __extends(Bytes6, _super);
    function Bytes6(uish) {
        return _super.call(this, Bytes6.LENGTH, uish) || this;
    }
    Bytes6.LENGTH = 6;
    return Bytes6;
}(BytesX_1.BytesX));
exports.Bytes6 = Bytes6;
var Bytes7 = /** @class */ (function (_super) {
    __extends(Bytes7, _super);
    function Bytes7(uish) {
        return _super.call(this, Bytes7.LENGTH, uish) || this;
    }
    Bytes7.LENGTH = 7;
    return Bytes7;
}(BytesX_1.BytesX));
exports.Bytes7 = Bytes7;
var Bytes8 = /** @class */ (function (_super) {
    __extends(Bytes8, _super);
    function Bytes8(uish) {
        return _super.call(this, Bytes8.LENGTH, uish) || this;
    }
    Bytes8.LENGTH = 8;
    return Bytes8;
}(BytesX_1.BytesX));
exports.Bytes8 = Bytes8;
var Bytes9 = /** @class */ (function (_super) {
    __extends(Bytes9, _super);
    function Bytes9(uish) {
        return _super.call(this, Bytes9.LENGTH, uish) || this;
    }
    Bytes9.LENGTH = 9;
    return Bytes9;
}(BytesX_1.BytesX));
exports.Bytes9 = Bytes9;
var Bytes10 = /** @class */ (function (_super) {
    __extends(Bytes10, _super);
    function Bytes10(uish) {
        return _super.call(this, Bytes10.LENGTH, uish) || this;
    }
    Bytes10.LENGTH = 10;
    return Bytes10;
}(BytesX_1.BytesX));
exports.Bytes10 = Bytes10;
var Bytes11 = /** @class */ (function (_super) {
    __extends(Bytes11, _super);
    function Bytes11(uish) {
        return _super.call(this, Bytes11.LENGTH, uish) || this;
    }
    Bytes11.LENGTH = 11;
    return Bytes11;
}(BytesX_1.BytesX));
exports.Bytes11 = Bytes11;
var Bytes12 = /** @class */ (function (_super) {
    __extends(Bytes12, _super);
    function Bytes12(uish) {
        return _super.call(this, Bytes12.LENGTH, uish) || this;
    }
    Bytes12.LENGTH = 12;
    return Bytes12;
}(BytesX_1.BytesX));
exports.Bytes12 = Bytes12;
var Bytes13 = /** @class */ (function (_super) {
    __extends(Bytes13, _super);
    function Bytes13(uish) {
        return _super.call(this, Bytes13.LENGTH, uish) || this;
    }
    Bytes13.LENGTH = 13;
    return Bytes13;
}(BytesX_1.BytesX));
exports.Bytes13 = Bytes13;
var Bytes14 = /** @class */ (function (_super) {
    __extends(Bytes14, _super);
    function Bytes14(uish) {
        return _super.call(this, Bytes14.LENGTH, uish) || this;
    }
    Bytes14.LENGTH = 14;
    return Bytes14;
}(BytesX_1.BytesX));
exports.Bytes14 = Bytes14;
var Bytes15 = /** @class */ (function (_super) {
    __extends(Bytes15, _super);
    function Bytes15(uish) {
        return _super.call(this, Bytes15.LENGTH, uish) || this;
    }
    Bytes15.LENGTH = 15;
    return Bytes15;
}(BytesX_1.BytesX));
exports.Bytes15 = Bytes15;
var Bytes16 = /** @class */ (function (_super) {
    __extends(Bytes16, _super);
    function Bytes16(uish) {
        return _super.call(this, Bytes16.LENGTH, uish) || this;
    }
    Bytes16.LENGTH = 16;
    return Bytes16;
}(BytesX_1.BytesX));
exports.Bytes16 = Bytes16;
var Bytes17 = /** @class */ (function (_super) {
    __extends(Bytes17, _super);
    function Bytes17(uish) {
        return _super.call(this, Bytes17.LENGTH, uish) || this;
    }
    Bytes17.LENGTH = 17;
    return Bytes17;
}(BytesX_1.BytesX));
exports.Bytes17 = Bytes17;
var Bytes18 = /** @class */ (function (_super) {
    __extends(Bytes18, _super);
    function Bytes18(uish) {
        return _super.call(this, Bytes18.LENGTH, uish) || this;
    }
    Bytes18.LENGTH = 18;
    return Bytes18;
}(BytesX_1.BytesX));
exports.Bytes18 = Bytes18;
var Bytes19 = /** @class */ (function (_super) {
    __extends(Bytes19, _super);
    function Bytes19(uish) {
        return _super.call(this, Bytes19.LENGTH, uish) || this;
    }
    Bytes19.LENGTH = 19;
    return Bytes19;
}(BytesX_1.BytesX));
exports.Bytes19 = Bytes19;
var Bytes20 = /** @class */ (function (_super) {
    __extends(Bytes20, _super);
    function Bytes20(uish) {
        return _super.call(this, Bytes20.LENGTH, uish) || this;
    }
    Bytes20.LENGTH = 20;
    return Bytes20;
}(BytesX_1.BytesX));
exports.Bytes20 = Bytes20;
var Bytes21 = /** @class */ (function (_super) {
    __extends(Bytes21, _super);
    function Bytes21(uish) {
        return _super.call(this, Bytes21.LENGTH, uish) || this;
    }
    Bytes21.LENGTH = 21;
    return Bytes21;
}(BytesX_1.BytesX));
exports.Bytes21 = Bytes21;
var Bytes22 = /** @class */ (function (_super) {
    __extends(Bytes22, _super);
    function Bytes22(uish) {
        return _super.call(this, Bytes22.LENGTH, uish) || this;
    }
    Bytes22.LENGTH = 22;
    return Bytes22;
}(BytesX_1.BytesX));
exports.Bytes22 = Bytes22;
var Bytes23 = /** @class */ (function (_super) {
    __extends(Bytes23, _super);
    function Bytes23(uish) {
        return _super.call(this, Bytes23.LENGTH, uish) || this;
    }
    Bytes23.LENGTH = 23;
    return Bytes23;
}(BytesX_1.BytesX));
exports.Bytes23 = Bytes23;
var Bytes24 = /** @class */ (function (_super) {
    __extends(Bytes24, _super);
    function Bytes24(uish) {
        return _super.call(this, Bytes24.LENGTH, uish) || this;
    }
    Bytes24.LENGTH = 24;
    return Bytes24;
}(BytesX_1.BytesX));
exports.Bytes24 = Bytes24;
var Bytes25 = /** @class */ (function (_super) {
    __extends(Bytes25, _super);
    function Bytes25(uish) {
        return _super.call(this, Bytes25.LENGTH, uish) || this;
    }
    Bytes25.LENGTH = 25;
    return Bytes25;
}(BytesX_1.BytesX));
exports.Bytes25 = Bytes25;
var Bytes26 = /** @class */ (function (_super) {
    __extends(Bytes26, _super);
    function Bytes26(uish) {
        return _super.call(this, Bytes26.LENGTH, uish) || this;
    }
    Bytes26.LENGTH = 26;
    return Bytes26;
}(BytesX_1.BytesX));
exports.Bytes26 = Bytes26;
var Bytes27 = /** @class */ (function (_super) {
    __extends(Bytes27, _super);
    function Bytes27(uish) {
        return _super.call(this, Bytes27.LENGTH, uish) || this;
    }
    Bytes27.LENGTH = 27;
    return Bytes27;
}(BytesX_1.BytesX));
exports.Bytes27 = Bytes27;
var Bytes28 = /** @class */ (function (_super) {
    __extends(Bytes28, _super);
    function Bytes28(uish) {
        return _super.call(this, Bytes28.LENGTH, uish) || this;
    }
    Bytes28.LENGTH = 28;
    return Bytes28;
}(BytesX_1.BytesX));
exports.Bytes28 = Bytes28;
var Bytes29 = /** @class */ (function (_super) {
    __extends(Bytes29, _super);
    function Bytes29(uish) {
        return _super.call(this, Bytes29.LENGTH, uish) || this;
    }
    Bytes29.LENGTH = 29;
    return Bytes29;
}(BytesX_1.BytesX));
exports.Bytes29 = Bytes29;
var Bytes30 = /** @class */ (function (_super) {
    __extends(Bytes30, _super);
    function Bytes30(uish) {
        return _super.call(this, Bytes30.LENGTH, uish) || this;
    }
    Bytes30.LENGTH = 30;
    return Bytes30;
}(BytesX_1.BytesX));
exports.Bytes30 = Bytes30;
var Bytes31 = /** @class */ (function (_super) {
    __extends(Bytes31, _super);
    function Bytes31(uish) {
        return _super.call(this, Bytes31.LENGTH, uish) || this;
    }
    Bytes31.LENGTH = 31;
    return Bytes31;
}(BytesX_1.BytesX));
exports.Bytes31 = Bytes31;
var Bytes32 = /** @class */ (function (_super) {
    __extends(Bytes32, _super);
    function Bytes32(uish) {
        return _super.call(this, Bytes32.LENGTH, uish) || this;
    }
    Bytes32.LENGTH = 32;
    return Bytes32;
}(BytesX_1.BytesX));
exports.Bytes32 = Bytes32;

},{"../internals/BytesX":71}],69:[function(require,module,exports){
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var UintX_1 = require("../internals/UintX");
var bn_js_1 = __importDefault(require("bn.js"));
var utils_1 = require("../utils");
var zeroBn = new bn_js_1["default"](0);
var oneBn = new bn_js_1["default"](1);
var Uint8 = /** @class */ (function (_super) {
    __extends(Uint8, _super);
    function Uint8(uish) {
        return _super.call(this, Uint8.LENGTH, uish) || this;
    }
    Uint8.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint8(uint8Array);
    };
    Uint8.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint8(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint8.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint8(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint8.fromNumber(uintable);
        }
    };
    Uint8.LENGTH = 1;
    return Uint8;
}(UintX_1.UintX));
exports.Uint8 = Uint8;
var Uint16 = /** @class */ (function (_super) {
    __extends(Uint16, _super);
    function Uint16(uish) {
        return _super.call(this, Uint16.LENGTH, uish) || this;
    }
    Uint16.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint16(uint8Array);
    };
    Uint16.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint16(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint16.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint16(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint16.fromNumber(uintable);
        }
    };
    Uint16.LENGTH = 2;
    return Uint16;
}(UintX_1.UintX));
exports.Uint16 = Uint16;
var Uint24 = /** @class */ (function (_super) {
    __extends(Uint24, _super);
    function Uint24(uish) {
        return _super.call(this, Uint24.LENGTH, uish) || this;
    }
    Uint24.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint24(uint8Array);
    };
    Uint24.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint24(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint24.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint24(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint24.fromNumber(uintable);
        }
    };
    Uint24.LENGTH = 3;
    return Uint24;
}(UintX_1.UintX));
exports.Uint24 = Uint24;
var Uint32 = /** @class */ (function (_super) {
    __extends(Uint32, _super);
    function Uint32(uish) {
        return _super.call(this, Uint32.LENGTH, uish) || this;
    }
    Uint32.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint32(uint8Array);
    };
    Uint32.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint32(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint32.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint32(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint32.fromNumber(uintable);
        }
    };
    Uint32.LENGTH = 4;
    return Uint32;
}(UintX_1.UintX));
exports.Uint32 = Uint32;
var Uint40 = /** @class */ (function (_super) {
    __extends(Uint40, _super);
    function Uint40(uish) {
        return _super.call(this, Uint40.LENGTH, uish) || this;
    }
    Uint40.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint40(uint8Array);
    };
    Uint40.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint40(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint40.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint40(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint40.fromNumber(uintable);
        }
    };
    Uint40.LENGTH = 5;
    return Uint40;
}(UintX_1.UintX));
exports.Uint40 = Uint40;
var Uint48 = /** @class */ (function (_super) {
    __extends(Uint48, _super);
    function Uint48(uish) {
        return _super.call(this, Uint48.LENGTH, uish) || this;
    }
    Uint48.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint48(uint8Array);
    };
    Uint48.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint48(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint48.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint48(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint48.fromNumber(uintable);
        }
    };
    Uint48.LENGTH = 6;
    return Uint48;
}(UintX_1.UintX));
exports.Uint48 = Uint48;
var Uint56 = /** @class */ (function (_super) {
    __extends(Uint56, _super);
    function Uint56(uish) {
        return _super.call(this, Uint56.LENGTH, uish) || this;
    }
    Uint56.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint56(uint8Array);
    };
    Uint56.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint56(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint56.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint56(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint56.fromNumber(uintable);
        }
    };
    Uint56.LENGTH = 7;
    return Uint56;
}(UintX_1.UintX));
exports.Uint56 = Uint56;
var Uint64 = /** @class */ (function (_super) {
    __extends(Uint64, _super);
    function Uint64(uish) {
        return _super.call(this, Uint64.LENGTH, uish) || this;
    }
    Uint64.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint64(uint8Array);
    };
    Uint64.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint64(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint64.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint64(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint64.fromNumber(uintable);
        }
    };
    Uint64.LENGTH = 8;
    return Uint64;
}(UintX_1.UintX));
exports.Uint64 = Uint64;
var Uint72 = /** @class */ (function (_super) {
    __extends(Uint72, _super);
    function Uint72(uish) {
        return _super.call(this, Uint72.LENGTH, uish) || this;
    }
    Uint72.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint72(uint8Array);
    };
    Uint72.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint72(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint72.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint72(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint72.fromNumber(uintable);
        }
    };
    Uint72.LENGTH = 9;
    return Uint72;
}(UintX_1.UintX));
exports.Uint72 = Uint72;
var Uint80 = /** @class */ (function (_super) {
    __extends(Uint80, _super);
    function Uint80(uish) {
        return _super.call(this, Uint80.LENGTH, uish) || this;
    }
    Uint80.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint80(uint8Array);
    };
    Uint80.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint80(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint80.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint80(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint80.fromNumber(uintable);
        }
    };
    Uint80.LENGTH = 10;
    return Uint80;
}(UintX_1.UintX));
exports.Uint80 = Uint80;
var Uint88 = /** @class */ (function (_super) {
    __extends(Uint88, _super);
    function Uint88(uish) {
        return _super.call(this, Uint88.LENGTH, uish) || this;
    }
    Uint88.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint88(uint8Array);
    };
    Uint88.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint88(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint88.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint88(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint88.fromNumber(uintable);
        }
    };
    Uint88.LENGTH = 11;
    return Uint88;
}(UintX_1.UintX));
exports.Uint88 = Uint88;
var Uint96 = /** @class */ (function (_super) {
    __extends(Uint96, _super);
    function Uint96(uish) {
        return _super.call(this, Uint96.LENGTH, uish) || this;
    }
    Uint96.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint96(uint8Array);
    };
    Uint96.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint96(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint96.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint96(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint96.fromNumber(uintable);
        }
    };
    Uint96.LENGTH = 12;
    return Uint96;
}(UintX_1.UintX));
exports.Uint96 = Uint96;
var Uint104 = /** @class */ (function (_super) {
    __extends(Uint104, _super);
    function Uint104(uish) {
        return _super.call(this, Uint104.LENGTH, uish) || this;
    }
    Uint104.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint104(uint8Array);
    };
    Uint104.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint104(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint104.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint104(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint104.fromNumber(uintable);
        }
    };
    Uint104.LENGTH = 13;
    return Uint104;
}(UintX_1.UintX));
exports.Uint104 = Uint104;
var Uint112 = /** @class */ (function (_super) {
    __extends(Uint112, _super);
    function Uint112(uish) {
        return _super.call(this, Uint112.LENGTH, uish) || this;
    }
    Uint112.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint112(uint8Array);
    };
    Uint112.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint112(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint112.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint112(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint112.fromNumber(uintable);
        }
    };
    Uint112.LENGTH = 14;
    return Uint112;
}(UintX_1.UintX));
exports.Uint112 = Uint112;
var Uint120 = /** @class */ (function (_super) {
    __extends(Uint120, _super);
    function Uint120(uish) {
        return _super.call(this, Uint120.LENGTH, uish) || this;
    }
    Uint120.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint120(uint8Array);
    };
    Uint120.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint120(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint120.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint120(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint120.fromNumber(uintable);
        }
    };
    Uint120.LENGTH = 15;
    return Uint120;
}(UintX_1.UintX));
exports.Uint120 = Uint120;
var Uint128 = /** @class */ (function (_super) {
    __extends(Uint128, _super);
    function Uint128(uish) {
        return _super.call(this, Uint128.LENGTH, uish) || this;
    }
    Uint128.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint128(uint8Array);
    };
    Uint128.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint128(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint128.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint128(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint128.fromNumber(uintable);
        }
    };
    Uint128.LENGTH = 16;
    return Uint128;
}(UintX_1.UintX));
exports.Uint128 = Uint128;
var Uint136 = /** @class */ (function (_super) {
    __extends(Uint136, _super);
    function Uint136(uish) {
        return _super.call(this, Uint136.LENGTH, uish) || this;
    }
    Uint136.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint136(uint8Array);
    };
    Uint136.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint136(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint136.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint136(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint136.fromNumber(uintable);
        }
    };
    Uint136.LENGTH = 17;
    return Uint136;
}(UintX_1.UintX));
exports.Uint136 = Uint136;
var Uint144 = /** @class */ (function (_super) {
    __extends(Uint144, _super);
    function Uint144(uish) {
        return _super.call(this, Uint144.LENGTH, uish) || this;
    }
    Uint144.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint144(uint8Array);
    };
    Uint144.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint144(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint144.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint144(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint144.fromNumber(uintable);
        }
    };
    Uint144.LENGTH = 18;
    return Uint144;
}(UintX_1.UintX));
exports.Uint144 = Uint144;
var Uint152 = /** @class */ (function (_super) {
    __extends(Uint152, _super);
    function Uint152(uish) {
        return _super.call(this, Uint152.LENGTH, uish) || this;
    }
    Uint152.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint152(uint8Array);
    };
    Uint152.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint152(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint152.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint152(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint152.fromNumber(uintable);
        }
    };
    Uint152.LENGTH = 19;
    return Uint152;
}(UintX_1.UintX));
exports.Uint152 = Uint152;
var Uint160 = /** @class */ (function (_super) {
    __extends(Uint160, _super);
    function Uint160(uish) {
        return _super.call(this, Uint160.LENGTH, uish) || this;
    }
    Uint160.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint160(uint8Array);
    };
    Uint160.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint160(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint160.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint160(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint160.fromNumber(uintable);
        }
    };
    Uint160.LENGTH = 20;
    return Uint160;
}(UintX_1.UintX));
exports.Uint160 = Uint160;
var Uint168 = /** @class */ (function (_super) {
    __extends(Uint168, _super);
    function Uint168(uish) {
        return _super.call(this, Uint168.LENGTH, uish) || this;
    }
    Uint168.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint168(uint8Array);
    };
    Uint168.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint168(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint168.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint168(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint168.fromNumber(uintable);
        }
    };
    Uint168.LENGTH = 21;
    return Uint168;
}(UintX_1.UintX));
exports.Uint168 = Uint168;
var Uint176 = /** @class */ (function (_super) {
    __extends(Uint176, _super);
    function Uint176(uish) {
        return _super.call(this, Uint176.LENGTH, uish) || this;
    }
    Uint176.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint176(uint8Array);
    };
    Uint176.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint176(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint176.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint176(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint176.fromNumber(uintable);
        }
    };
    Uint176.LENGTH = 22;
    return Uint176;
}(UintX_1.UintX));
exports.Uint176 = Uint176;
var Uint184 = /** @class */ (function (_super) {
    __extends(Uint184, _super);
    function Uint184(uish) {
        return _super.call(this, Uint184.LENGTH, uish) || this;
    }
    Uint184.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint184(uint8Array);
    };
    Uint184.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint184(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint184.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint184(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint184.fromNumber(uintable);
        }
    };
    Uint184.LENGTH = 23;
    return Uint184;
}(UintX_1.UintX));
exports.Uint184 = Uint184;
var Uint192 = /** @class */ (function (_super) {
    __extends(Uint192, _super);
    function Uint192(uish) {
        return _super.call(this, Uint192.LENGTH, uish) || this;
    }
    Uint192.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint192(uint8Array);
    };
    Uint192.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint192(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint192.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint192(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint192.fromNumber(uintable);
        }
    };
    Uint192.LENGTH = 24;
    return Uint192;
}(UintX_1.UintX));
exports.Uint192 = Uint192;
var Uint200 = /** @class */ (function (_super) {
    __extends(Uint200, _super);
    function Uint200(uish) {
        return _super.call(this, Uint200.LENGTH, uish) || this;
    }
    Uint200.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint200(uint8Array);
    };
    Uint200.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint200(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint200.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint200(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint200.fromNumber(uintable);
        }
    };
    Uint200.LENGTH = 25;
    return Uint200;
}(UintX_1.UintX));
exports.Uint200 = Uint200;
var Uint208 = /** @class */ (function (_super) {
    __extends(Uint208, _super);
    function Uint208(uish) {
        return _super.call(this, Uint208.LENGTH, uish) || this;
    }
    Uint208.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint208(uint8Array);
    };
    Uint208.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint208(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint208.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint208(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint208.fromNumber(uintable);
        }
    };
    Uint208.LENGTH = 26;
    return Uint208;
}(UintX_1.UintX));
exports.Uint208 = Uint208;
var Uint216 = /** @class */ (function (_super) {
    __extends(Uint216, _super);
    function Uint216(uish) {
        return _super.call(this, Uint216.LENGTH, uish) || this;
    }
    Uint216.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint216(uint8Array);
    };
    Uint216.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint216(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint216.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint216(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint216.fromNumber(uintable);
        }
    };
    Uint216.LENGTH = 27;
    return Uint216;
}(UintX_1.UintX));
exports.Uint216 = Uint216;
var Uint224 = /** @class */ (function (_super) {
    __extends(Uint224, _super);
    function Uint224(uish) {
        return _super.call(this, Uint224.LENGTH, uish) || this;
    }
    Uint224.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint224(uint8Array);
    };
    Uint224.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint224(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint224.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint224(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint224.fromNumber(uintable);
        }
    };
    Uint224.LENGTH = 28;
    return Uint224;
}(UintX_1.UintX));
exports.Uint224 = Uint224;
var Uint232 = /** @class */ (function (_super) {
    __extends(Uint232, _super);
    function Uint232(uish) {
        return _super.call(this, Uint232.LENGTH, uish) || this;
    }
    Uint232.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint232(uint8Array);
    };
    Uint232.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint232(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint232.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint232(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint232.fromNumber(uintable);
        }
    };
    Uint232.LENGTH = 29;
    return Uint232;
}(UintX_1.UintX));
exports.Uint232 = Uint232;
var Uint240 = /** @class */ (function (_super) {
    __extends(Uint240, _super);
    function Uint240(uish) {
        return _super.call(this, Uint240.LENGTH, uish) || this;
    }
    Uint240.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint240(uint8Array);
    };
    Uint240.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint240(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint240.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint240(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint240.fromNumber(uintable);
        }
    };
    Uint240.LENGTH = 30;
    return Uint240;
}(UintX_1.UintX));
exports.Uint240 = Uint240;
var Uint248 = /** @class */ (function (_super) {
    __extends(Uint248, _super);
    function Uint248(uish) {
        return _super.call(this, Uint248.LENGTH, uish) || this;
    }
    Uint248.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint248(uint8Array);
    };
    Uint248.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint248(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint248.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint248(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint248.fromNumber(uintable);
        }
    };
    Uint248.LENGTH = 31;
    return Uint248;
}(UintX_1.UintX));
exports.Uint248 = Uint248;
var Uint256 = /** @class */ (function (_super) {
    __extends(Uint256, _super);
    function Uint256(uish) {
        return _super.call(this, Uint256.LENGTH, uish) || this;
    }
    Uint256.prototype.opAdd = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.add(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.prototype.opSub = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.sub(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.prototype.opMul = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mul(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.prototype.opDiv = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.div(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.prototype.opMod = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.mod(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.prototype.opPow = function (uintable) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(uintable);
        var uint8Array = thisBn.pow(valueBn).toArrayLike(Uint8Array, 'be');
        return new Uint256(uint8Array);
    };
    Uint256.fromNumber = function (number) {
        var bn = new bn_js_1["default"](number);
        return new Uint256(bn.toArrayLike(Uint8Array, 'be'));
    };
    Uint256.fromUintable = function (uintable) {
        if (uintable instanceof UintX_1.UintX) {
            return new Uint256(uintable.uu.genClone());
        }
        if (!Number.isNaN(uintable)) {
            return Uint256.fromNumber(uintable);
        }
    };
    Uint256.LENGTH = 32;
    return Uint256;
}(UintX_1.UintX));
exports.Uint256 = Uint256;

},{"../internals/UintX":72,"../utils":73,"bn.js":31}],70:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Buttercup_1 = require("./buttercups/Buttercup");
exports.Buttercup = Buttercup_1.Buttercup;
var fixButtercups_1 = require("./buttercups/fixButtercups");
exports.FixLeftButtercup = fixButtercups_1.FixLeftButtercup;
exports.FixRightButtercup = fixButtercups_1.FixRightButtercup;
var Bytes_1 = require("./externals/Bytes");
exports.Bytes = Bytes_1.Bytes;
var Address_1 = require("./externals/Address");
exports.Address = Address_1.Address;
var uintXs_1 = require("./externals/uintXs");
exports.Uint8 = uintXs_1.Uint8;
exports.Uint16 = uintXs_1.Uint16;
exports.Uint24 = uintXs_1.Uint24;
exports.Uint32 = uintXs_1.Uint32;
exports.Uint40 = uintXs_1.Uint40;
exports.Uint48 = uintXs_1.Uint48;
exports.Uint56 = uintXs_1.Uint56;
exports.Uint64 = uintXs_1.Uint64;
exports.Uint72 = uintXs_1.Uint72;
exports.Uint80 = uintXs_1.Uint80;
exports.Uint88 = uintXs_1.Uint88;
exports.Uint96 = uintXs_1.Uint96;
exports.Uint104 = uintXs_1.Uint104;
exports.Uint112 = uintXs_1.Uint112;
exports.Uint120 = uintXs_1.Uint120;
exports.Uint128 = uintXs_1.Uint128;
exports.Uint136 = uintXs_1.Uint136;
exports.Uint144 = uintXs_1.Uint144;
exports.Uint152 = uintXs_1.Uint152;
exports.Uint160 = uintXs_1.Uint160;
exports.Uint168 = uintXs_1.Uint168;
exports.Uint176 = uintXs_1.Uint176;
exports.Uint184 = uintXs_1.Uint184;
exports.Uint192 = uintXs_1.Uint192;
exports.Uint200 = uintXs_1.Uint200;
exports.Uint208 = uintXs_1.Uint208;
exports.Uint216 = uintXs_1.Uint216;
exports.Uint224 = uintXs_1.Uint224;
exports.Uint232 = uintXs_1.Uint232;
exports.Uint240 = uintXs_1.Uint240;
exports.Uint248 = uintXs_1.Uint248;
exports.Uint256 = uintXs_1.Uint256;
var bytesXs_1 = require("./externals/bytesXs");
exports.Bytes1 = bytesXs_1.Bytes1;
exports.Bytes2 = bytesXs_1.Bytes2;
exports.Bytes3 = bytesXs_1.Bytes3;
exports.Bytes4 = bytesXs_1.Bytes4;
exports.Bytes5 = bytesXs_1.Bytes5;
exports.Bytes6 = bytesXs_1.Bytes6;
exports.Bytes7 = bytesXs_1.Bytes7;
exports.Bytes8 = bytesXs_1.Bytes8;
exports.Bytes9 = bytesXs_1.Bytes9;
exports.Bytes10 = bytesXs_1.Bytes10;
exports.Bytes11 = bytesXs_1.Bytes11;
exports.Bytes12 = bytesXs_1.Bytes12;
exports.Bytes13 = bytesXs_1.Bytes13;
exports.Bytes14 = bytesXs_1.Bytes14;
exports.Bytes15 = bytesXs_1.Bytes15;
exports.Bytes16 = bytesXs_1.Bytes16;
exports.Bytes17 = bytesXs_1.Bytes17;
exports.Bytes18 = bytesXs_1.Bytes18;
exports.Bytes19 = bytesXs_1.Bytes19;
exports.Bytes20 = bytesXs_1.Bytes20;
exports.Bytes21 = bytesXs_1.Bytes21;
exports.Bytes22 = bytesXs_1.Bytes22;
exports.Bytes23 = bytesXs_1.Bytes23;
exports.Bytes24 = bytesXs_1.Bytes24;
exports.Bytes25 = bytesXs_1.Bytes25;
exports.Bytes26 = bytesXs_1.Bytes26;
exports.Bytes27 = bytesXs_1.Bytes27;
exports.Bytes28 = bytesXs_1.Bytes28;
exports.Bytes29 = bytesXs_1.Bytes29;
exports.Bytes30 = bytesXs_1.Bytes30;
exports.Bytes31 = bytesXs_1.Bytes31;
exports.Bytes32 = bytesXs_1.Bytes32;

},{"./buttercups/Buttercup":64,"./buttercups/fixButtercups":65,"./externals/Address":66,"./externals/Bytes":67,"./externals/bytesXs":68,"./externals/uintXs":69}],71:[function(require,module,exports){
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
exports.__esModule = true;
var fixButtercups_1 = require("../buttercups/fixButtercups");
var BytesX = /** @class */ (function (_super) {
    __extends(BytesX, _super);
    function BytesX(length, uish) {
        return _super.call(this, length, uish) || this;
    }
    return BytesX;
}(fixButtercups_1.FixRightButtercup));
exports.BytesX = BytesX;

},{"../buttercups/fixButtercups":65}],72:[function(require,module,exports){
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fixButtercups_1 = require("../buttercups/fixButtercups");
var bn_js_1 = __importDefault(require("bn.js"));
var utils_1 = require("../utils");
var UintX = /** @class */ (function (_super) {
    __extends(UintX, _super);
    function UintX(length, uish) {
        return _super.call(this, length, uish) || this;
    }
    UintX.prototype.toNumber = function () {
        this.number = new bn_js_1["default"](this.uu.u).toNumber();
        return this.number;
    };
    UintX.prototype.getIsZero = function () {
        return this.uu.u.every(function (byte) {
            return byte === 0;
        });
    };
    UintX.prototype.compEq = function (value) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(value);
        return thisBn.eq(valueBn);
    };
    UintX.prototype.compGt = function (value) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(value);
        return thisBn.gt(valueBn);
    };
    UintX.prototype.compGte = function (value) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(value);
        return thisBn.gte(valueBn);
    };
    UintX.prototype.compLt = function (value) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(value);
        return thisBn.lt(valueBn);
    };
    UintX.prototype.compLte = function (value) {
        var thisBn = utils_1.genBnFromUintable(this);
        var valueBn = utils_1.genBnFromUintable(value);
        return thisBn.lte(valueBn);
    };
    return UintX;
}(fixButtercups_1.FixLeftButtercup));
exports.UintX = UintX;

},{"../buttercups/fixButtercups":65,"../utils":73,"bn.js":31}],73:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var UintX_1 = require("./internals/UintX");
var bn_js_1 = __importDefault(require("bn.js"));
function genBnFromUintable(uintable) {
    if (uintable instanceof UintX_1.UintX) {
        return new bn_js_1["default"](uintable.u);
    }
    if (!Number.isNaN(uintable)) {
        return genBnFromNumber(uintable);
    }
}
exports.genBnFromUintable = genBnFromUintable;
function genBnFromNumber(number) {
    return new bn_js_1["default"](number);
}
exports.genBnFromNumber = genBnFromNumber;

},{"./internals/UintX":72,"bn.js":31}],74:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var hash_js_1 = __importDefault(require("hash.js"));
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
function genSha256(prehashUish) {
    var prehash = pollenium_uvaursi_1.Uu.wrap(prehashUish);
    return pollenium_uvaursi_1.Uu.fromArray(hash_js_1["default"].sha256().update(prehash.unwrap()).digest());
}
exports.genSha256 = genSha256;

},{"hash.js":38,"pollenium-uvaursi":77}],75:[function(require,module,exports){
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
exports.__esModule = true;
var SnowdropError = /** @class */ (function (_super) {
    __extends(SnowdropError, _super);
    function SnowdropError(message) {
        return _super.call(this, "Snowdrop: " + message) || this;
    }
    return SnowdropError;
}(Error));
exports.SnowdropError = SnowdropError;
var EmitWithoutHandlesError = /** @class */ (function (_super) {
    __extends(EmitWithoutHandlesError, _super);
    function EmitWithoutHandlesError() {
        return _super.call(this, 'Emitted without any handles') || this;
    }
    return EmitWithoutHandlesError;
}(SnowdropError));
exports.EmitWithoutHandlesError = EmitWithoutHandlesError;
var RemovingNonExistantHandleError = /** @class */ (function (_super) {
    __extends(RemovingNonExistantHandleError, _super);
    function RemovingNonExistantHandleError(handleId) {
        return _super.call(this, "Trying to remove a handle that doesn't exist: " + handleId.value) || this;
    }
    return RemovingNonExistantHandleError;
}(SnowdropError));
exports.RemovingNonExistantHandleError = RemovingNonExistantHandleError;
var HandleId = /** @class */ (function () {
    function HandleId(value) {
        this.value = value;
    }
    HandleId.prototype.genNext = function () {
        return new HandleId(this.value + 1);
    };
    return HandleId;
}());
exports.HandleId = HandleId;
var Snowdrop = /** @class */ (function () {
    function Snowdrop() {
        this.nextHandleId = new HandleId(0);
        this.handlesById = {};
        this.handlesCount = 0;
    }
    Snowdrop.prototype.addHandle = function (handle) {
        var handleId = this.nextHandleId;
        this.handlesById[handleId.value] = handle;
        this.nextHandleId = this.nextHandleId.genNext();
        this.handlesCount += 1;
        return handleId;
    };
    Snowdrop.prototype.removeHandleById = function (id) {
        var handle = this.handlesById[id.value];
        if (!handle) {
            throw new RemovingNonExistantHandleError(id);
        }
        delete this.handlesById[id.value];
        this.handlesCount -= 1;
    };
    Snowdrop.prototype.removeAllHandles = function () {
        for (var value = 0; value < this.nextHandleId.value; value++) {
            if (this.handlesById[value]) {
                this.removeHandleById(new HandleId(value));
            }
        }
    };
    Snowdrop.prototype.emit = function (data) {
        if (this.handlesCount === 0) {
            throw new EmitWithoutHandlesError();
        }
        for (var i = 0; i < this.nextHandleId.value; i++) {
            var handle = this.handlesById[i];
            if (handle) {
                handle(data);
            }
        }
    };
    Snowdrop.prototype.emitIfHandle = function (data) {
        if (this.nextHandleId.value > 0) {
            this.emit(data);
        }
    };
    return Snowdrop;
}());
exports.Snowdrop = Snowdrop;

},{}],76:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var utils = __importStar(require("./utils"));
var Uu = /** @class */ (function () {
    function Uu(u) {
        this.u = u;
    }
    Uu.prototype.toArray = function () {
        return utils.toArray(this.u);
    };
    Uu.prototype.toHex = function () {
        if (this.hex) {
            return this.hex;
        }
        this.hex = utils.toHex(this.u);
        return this.hex;
    };
    Uu.prototype.toPhex = function () {
        if (this.phex) {
            return this.phex;
        }
        this.phex = utils.toPhex(this.u);
        return this.phex;
    };
    Uu.prototype.toUtf8 = function () {
        if (this.utf8) {
            return this.utf8;
        }
        this.utf8 = utils.toUtf8(this.u);
        return this.utf8;
    };
    Uu.prototype.genClone = function () {
        return new Uu(this.u.slice());
    };
    Uu.prototype.genPaddedLeft = function (length) {
        return new Uu(utils.genPaddedLeft(length, this.u));
    };
    Uu.prototype.genPaddedRight = function (length) {
        return new Uu(utils.genPaddedRight(length, this.u));
    };
    Uu.prototype.genXor = function (uish) {
        return new Uu(utils.genXor(this.u, utils.unwrap(uish)));
    };
    Uu.prototype.getIsEqual = function (uish) {
        return utils.getIsEqual(this.u, utils.unwrap(uish));
    };
    Uu.prototype.unwrap = function () {
        return utils.unwrap(this);
    };
    Uu.fromArray = function (array) {
        return new Uu(utils.fromArray(array));
    };
    Uu.fromHexish = function (hexish) {
        return new Uu(utils.fromHexish(hexish));
    };
    Uu.fromUtf8 = function (utf8) {
        return new Uu(utils.fromUtf8(utf8));
    };
    Uu.genRandom = function (length) {
        return new Uu(utils.genRandom(length));
    };
    Uu.genConcat = function (uvaursis) {
        var us = uvaursis.map(function (uvaursi) {
            return utils.unwrap(us);
        });
        return new Uu(utils.genConcat(us));
    };
    Uu.genZeros = function (length) {
        return new Uu(new Uint8Array(length));
    };
    Uu.wrap = function (uish) {
        if (uish instanceof Uint8Array) {
            return new Uu(uish);
        }
        if (uish.u) {
            return new Uu(uish.u);
        }
        throw new Error('Unable to wrap');
    };
    return Uu;
}());
exports.Uu = Uu;

},{"./utils":78}],77:[function(require,module,exports){
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Uu_1 = require("./Uu");
exports.Uu = Uu_1.Uu;
var utils = __importStar(require("./utils"));
exports.uUtils = utils;

},{"./Uu":76,"./utils":78}],78:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var genConcat_1 = require("./utils/genConcat");
exports.genConcat = genConcat_1.genConcat;
var genRandom_1 = require("./utils/genRandom");
exports.genRandom = genRandom_1.genRandom;
var fromArray_1 = require("./utils/fromArray");
exports.fromArray = fromArray_1.fromArray;
var fromHexish_1 = require("./utils/fromHexish");
exports.fromHexish = fromHexish_1.fromHexish;
var fromUtf8_1 = require("./utils/fromUtf8");
exports.fromUtf8 = fromUtf8_1.fromUtf8;
var toArray_1 = require("./utils/toArray");
exports.toArray = toArray_1.toArray;
var toHex_1 = require("./utils/toHex");
exports.toHex = toHex_1.toHex;
var toPhex_1 = require("./utils/toPhex");
exports.toPhex = toPhex_1.toPhex;
var toUtf8_1 = require("./utils/toUtf8");
exports.toUtf8 = toUtf8_1.toUtf8;
var genPadded_1 = require("./utils/genPadded");
exports.genPaddedLeft = genPadded_1.genPaddedLeft;
exports.genPaddedRight = genPadded_1.genPaddedRight;
var genXor_1 = require("./utils/genXor");
exports.genXor = genXor_1.genXor;
var getIsEqual_1 = require("./utils/getIsEqual");
exports.getIsEqual = getIsEqual_1.getIsEqual;
var unwrap_1 = require("./utils/unwrap");
exports.unwrap = unwrap_1.unwrap;

},{"./utils/fromArray":79,"./utils/fromHexish":80,"./utils/fromUtf8":81,"./utils/genConcat":82,"./utils/genPadded":83,"./utils/genRandom":84,"./utils/genXor":85,"./utils/getIsEqual":86,"./utils/toArray":87,"./utils/toHex":88,"./utils/toPhex":89,"./utils/toUtf8":90,"./utils/unwrap":91}],79:[function(require,module,exports){
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
exports.__esModule = true;
var NegativeNumberError = /** @class */ (function (_super) {
    __extends(NegativeNumberError, _super);
    function NegativeNumberError(number) {
        var _this = _super.call(this, "Negative number: " + number) || this;
        Object.setPrototypeOf(_this, NegativeNumberError.prototype);
        return _this;
    }
    return NegativeNumberError;
}(Error));
exports.NegativeNumberError = NegativeNumberError;
var DecimalNumberError = /** @class */ (function (_super) {
    __extends(DecimalNumberError, _super);
    function DecimalNumberError(number) {
        var _this = _super.call(this, "Decimal number: " + number) || this;
        Object.setPrototypeOf(_this, DecimalNumberError.prototype);
        return _this;
    }
    return DecimalNumberError;
}(Error));
exports.DecimalNumberError = DecimalNumberError;
var TooLargeNumberError = /** @class */ (function (_super) {
    __extends(TooLargeNumberError, _super);
    function TooLargeNumberError(number) {
        var _this = _super.call(this, "Too large number: " + number + " is greater than 255") || this;
        Object.setPrototypeOf(_this, TooLargeNumberError.prototype);
        return _this;
    }
    return TooLargeNumberError;
}(Error));
exports.TooLargeNumberError = TooLargeNumberError;
function fromArray(array) {
    array.forEach(function (number) {
        if (number < 0) {
            throw new NegativeNumberError(number);
        }
        if (number % 1 > 0) {
            throw new DecimalNumberError(number);
        }
        if (number > 255) {
            throw new TooLargeNumberError(number);
        }
    });
    return new Uint8Array(array);
}
exports.fromArray = fromArray;

},{}],80:[function(require,module,exports){
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
exports.__esModule = true;
function fromHexish(hexish) {
    if (hexish.length === 0) {
        return new Uint8Array([]);
    }
    if (hexish.indexOf('0x') === 0) {
        return fromHexish(hexish.substr(2));
    }
    assertIsValidHexish(hexish);
    var array = hexish.match(/.{1,2}/g).map(function (byteHex) {
        return parseInt(byteHex, 16);
    });
    return new Uint8Array(array);
}
exports.fromHexish = fromHexish;
var InvalidHexishCharError = /** @class */ (function (_super) {
    __extends(InvalidHexishCharError, _super);
    function InvalidHexishCharError(hexishChar) {
        var _this = _super.call(this, "Invalid hexish char: " + hexishChar) || this;
        Object.setPrototypeOf(_this, InvalidHexishCharError.prototype);
        return _this;
    }
    return InvalidHexishCharError;
}(Error));
exports.InvalidHexishCharError = InvalidHexishCharError;
var InvalidHexishParityError = /** @class */ (function (_super) {
    __extends(InvalidHexishParityError, _super);
    function InvalidHexishParityError(hexish) {
        var _this = _super.call(this, "Hexish should be even length, not odd: " + hexish) || this;
        Object.setPrototypeOf(_this, InvalidHexishParityError.prototype);
        return _this;
    }
    return InvalidHexishParityError;
}(Error));
exports.InvalidHexishParityError = InvalidHexishParityError;
var hexishCharCodesRanges = [
    [48, 57],
    [97, 102],
    [65, 70] // A-F
];
function getIsValidHexishChar(hexishChar) {
    var hexishCharCode = hexishChar.charCodeAt(0);
    for (var i = 0; i < hexishCharCodesRanges.length; i++) {
        var start = hexishCharCodesRanges[i][0];
        var end = hexishCharCodesRanges[i][1];
        if (hexishCharCode >= start && hexishCharCode <= end) {
            return true;
        }
    }
    return false;
}
function assertIsValidHexish(hexish) {
    if (hexish.length % 2 === 1) {
        throw new InvalidHexishParityError(hexish);
    }
    for (var i = 0; i < hexish.length; i++) {
        var hexishChar = hexish[i];
        if (!getIsValidHexishChar(hexishChar)) {
            throw new InvalidHexishCharError(hexishChar);
        }
    }
}

},{}],81:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utf8_1 = __importDefault(require("@protobufjs/utf8"));
function fromUtf8(utf8) {
    var length = utf8_1["default"].length(utf8);
    var uint8Array = new Uint8Array(length);
    utf8_1["default"].write(utf8, uint8Array, 0);
    return uint8Array;
}
exports.fromUtf8 = fromUtf8;

},{"@protobufjs/utf8":17}],82:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function genConcat(us) {
    var length = us.reduce(function (length, u) {
        return length + u.length;
    }, 0);
    var u = new Uint8Array(length);
    us.reduce(function (offset, _u) {
        u.set(_u, offset);
        return offset + _u.length;
    }, 0);
    return u;
}
exports.genConcat = genConcat;

},{}],83:[function(require,module,exports){
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
exports.__esModule = true;
var OverflowError = /** @class */ (function (_super) {
    __extends(OverflowError, _super);
    function OverflowError(length, uLength) {
        var _this = _super.call(this, "Overflow: Trying to put " + uLength + " length Uint8Array into " + length + " length Uint8Array") || this;
        Object.setPrototypeOf(_this, OverflowError.prototype);
        return _this;
    }
    return OverflowError;
}(Error));
exports.OverflowError = OverflowError;
function genPaddedLeft(length, unpadded) {
    if (length < unpadded.length) {
        throw new OverflowError(length, unpadded.length);
    }
    var padded = (new Uint8Array(length)).fill(0);
    padded.set(unpadded, length - unpadded.length);
    return padded;
}
exports.genPaddedLeft = genPaddedLeft;
function genPaddedRight(length, unpadded) {
    if (length < unpadded.length) {
        throw new OverflowError(length, unpadded.length);
    }
    var padded = (new Uint8Array(length)).fill(0);
    padded.set(unpadded);
    return padded;
}
exports.genPaddedRight = genPaddedRight;

},{}],84:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function genRandom(length) {
    /*TODO: assert int */
    var u = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        u[i] = Math.floor(Math.random() * 256);
    }
    return u;
}
exports.genRandom = genRandom;

},{}],85:[function(require,module,exports){
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
exports.__esModule = true;
var LengthMismatchError = /** @class */ (function (_super) {
    __extends(LengthMismatchError, _super);
    function LengthMismatchError(a, b) {
        return _super.call(this, "Cannot XOR: a.length !== b.length: " + a.length + " vs " + b.length) || this;
    }
    return LengthMismatchError;
}(Error));
exports.LengthMismatchError = LengthMismatchError;
function genXor(a, b) {
    if (a.length !== b.length) {
        throw new LengthMismatchError(a, b);
    }
    var xor = new Uint8Array(a.length);
    for (var i = 0; i < a.length; i++) {
        xor[i] = a[i] ^ b[i];
    }
    return xor;
}
exports.genXor = genXor;

},{}],86:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function getIsEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.getIsEqual = getIsEqual;

},{}],87:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function toArray(u) {
    var array = [];
    u.forEach(function (element) {
        array.push(element);
    });
    return array;
}
exports.toArray = toArray;

},{}],88:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function toHex(u) {
    return Array.from(u, function (number) {
        return ('0' + (number & 0xFF).toString(16)).slice(-2);
    }).join('');
}
exports.toHex = toHex;

},{}],89:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var toHex_1 = require("./toHex");
function toPhex(u) {
    return "0x" + toHex_1.toHex(u);
}
exports.toPhex = toPhex;

},{"./toHex":88}],90:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utf8_1 = __importDefault(require("@protobufjs/utf8"));
function toUtf8(u) {
    return utf8_1["default"].read(u, 0, u.length);
}
exports.toUtf8 = toUtf8;

},{"@protobufjs/utf8":17}],91:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function unwrap(uish) {
    if (uish instanceof Uint8Array) {
        return uish;
    }
    if (uish.u) {
        return uish.u;
    }
    throw new Error('Unable to unwrap');
}
exports.unwrap = unwrap;

},{}],92:[function(require,module,exports){
(function (process){
'use strict';

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


}).call(this,require('_process'))
},{"_process":93}],93:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],94:[function(require,module,exports){
(function (process,global){
'use strict'

// limit of Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
var MAX_BYTES = 65536

// Node supports requesting up to this number of bytes
// https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
var MAX_UINT32 = 4294967295

function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}

var Buffer = require('safe-buffer').Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

  var bytes = Buffer.allocUnsafe(size)

  if (size > 0) {  // getRandomValues fails on IE if size == 0
    if (size > MAX_BYTES) { // this is the max bytes crypto.getRandomValues
      // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice automatically checks if the end is past the end of
        // the buffer so we don't have to here
        crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
      }
    } else {
      crypto.getRandomValues(bytes)
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":93,"safe-buffer":105}],95:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};
},{"./_stream_readable":97,"./_stream_writable":99,"core-util-is":34,"inherits":58,"process-nextick-args":92}],96:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":98,"core-util-is":34,"inherits":58}],97:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var destroyImpl = require('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":95,"./internal/streams/BufferList":100,"./internal/streams/destroy":101,"./internal/streams/stream":102,"_process":93,"core-util-is":34,"events":36,"inherits":58,"isarray":61,"process-nextick-args":92,"safe-buffer":103,"string_decoder/":109,"util":32}],98:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":95,"core-util-is":34,"inherits":58}],99:[function(require,module,exports){
(function (process,global,setImmediate){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = require('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"./_stream_duplex":95,"./internal/streams/destroy":101,"./internal/streams/stream":102,"_process":93,"core-util-is":34,"inherits":58,"process-nextick-args":92,"safe-buffer":103,"timers":112,"util-deprecate":113}],100:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require('safe-buffer').Buffer;
var util = require('util');

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
},{"safe-buffer":103,"util":32}],101:[function(require,module,exports){
'use strict';

/*<replacement>*/

var pna = require('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":92}],102:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":36}],103:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":33}],104:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":95,"./lib/_stream_passthrough.js":96,"./lib/_stream_readable.js":97,"./lib/_stream_transform.js":98,"./lib/_stream_writable.js":99}],105:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":33}],106:[function(require,module,exports){
(function (Buffer){
module.exports = Peer

var debug = require('debug')('simple-peer')
var getBrowserRTC = require('get-browser-rtc')
var inherits = require('inherits')
var randombytes = require('randombytes')
var stream = require('readable-stream')

var MAX_BUFFERED_AMOUNT = 64 * 1024
var ICECOMPLETE_TIMEOUT = 5 * 1000
var CHANNEL_CLOSING_TIMEOUT = 5 * 1000

inherits(Peer, stream.Duplex)

/**
 * WebRTC peer connection. Same API as node core `net.Socket`, plus a few extra methods.
 * Duplex stream.
 * @param {Object} opts
 */
function Peer (opts) {
  var self = this
  if (!(self instanceof Peer)) return new Peer(opts)

  self._id = randombytes(4).toString('hex').slice(0, 7)
  self._debug('new peer %o', opts)

  opts = Object.assign({
    allowHalfOpen: false
  }, opts)

  stream.Duplex.call(self, opts)

  self.channelName = opts.initiator
    ? opts.channelName || randombytes(20).toString('hex')
    : null

  self.initiator = opts.initiator || false
  self.channelConfig = opts.channelConfig || Peer.channelConfig
  self.config = Object.assign({}, Peer.config, opts.config)
  self.offerOptions = opts.offerOptions || {}
  self.answerOptions = opts.answerOptions || {}
  self.sdpTransform = opts.sdpTransform || function (sdp) { return sdp }
  self.streams = opts.streams || (opts.stream ? [opts.stream] : []) // support old "stream" option
  self.trickle = opts.trickle !== undefined ? opts.trickle : true
  self.allowHalfTrickle = opts.allowHalfTrickle !== undefined ? opts.allowHalfTrickle : false
  self.iceCompleteTimeout = opts.iceCompleteTimeout || ICECOMPLETE_TIMEOUT

  self.destroyed = false
  self.connected = false

  self.remoteAddress = undefined
  self.remoteFamily = undefined
  self.remotePort = undefined
  self.localAddress = undefined
  self.localFamily = undefined
  self.localPort = undefined

  self._wrtc = (opts.wrtc && typeof opts.wrtc === 'object')
    ? opts.wrtc
    : getBrowserRTC()

  if (!self._wrtc) {
    if (typeof window === 'undefined') {
      throw makeError('No WebRTC support: Specify `opts.wrtc` option in this environment', 'ERR_WEBRTC_SUPPORT')
    } else {
      throw makeError('No WebRTC support: Not a supported browser', 'ERR_WEBRTC_SUPPORT')
    }
  }

  self._pcReady = false
  self._channelReady = false
  self._iceComplete = false // ice candidate trickle done (got null candidate)
  self._iceCompleteTimer = null // send an offer/answer anyway after some timeout
  self._channel = null
  self._pendingCandidates = []

  self._isNegotiating = !self.initiator // is this peer waiting for negotiation to complete?
  self._batchedNegotiation = false // batch synchronous negotiations
  self._queuedNegotiation = false // is there a queued negotiation request?
  self._sendersAwaitingStable = []
  self._senderMap = new Map()
  self._firstStable = true
  self._closingInterval = null

  self._remoteTracks = []
  self._remoteStreams = []

  self._chunk = null
  self._cb = null
  self._interval = null

  try {
    self._pc = new (self._wrtc.RTCPeerConnection)(self.config)
  } catch (err) {
    self.destroy(err)
  }

  // We prefer feature detection whenever possible, but sometimes that's not
  // possible for certain implementations.
  self._isReactNativeWebrtc = typeof self._pc._peerConnectionId === 'number'

  self._pc.oniceconnectionstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onicegatheringstatechange = function () {
    self._onIceStateChange()
  }
  self._pc.onsignalingstatechange = function () {
    self._onSignalingStateChange()
  }
  self._pc.onicecandidate = function (event) {
    self._onIceCandidate(event)
  }

  // Other spec events, unused by this implementation:
  // - onconnectionstatechange
  // - onicecandidateerror
  // - onfingerprintfailure
  // - onnegotiationneeded

  if (self.initiator) {
    self._setupData({
      channel: self._pc.createDataChannel(self.channelName, self.channelConfig)
    })
  } else {
    self._pc.ondatachannel = function (event) {
      self._setupData(event)
    }
  }

  if (self.streams) {
    self.streams.forEach(function (stream) {
      self.addStream(stream)
    })
  }
  self._pc.ontrack = function (event) {
    self._onTrack(event)
  }

  if (self.initiator) {
    self._needsNegotiation()
  }

  self._onFinishBound = function () {
    self._onFinish()
  }
  self.once('finish', self._onFinishBound)
}

Peer.WEBRTC_SUPPORT = !!getBrowserRTC()

/**
 * Expose peer and data channel config for overriding all Peer
 * instances. Otherwise, just set opts.config or opts.channelConfig
 * when constructing a Peer.
 */
Peer.config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }
  ],
  sdpSemantics: 'unified-plan'
}
Peer.channelConfig = {}

Object.defineProperty(Peer.prototype, 'bufferSize', {
  get: function () {
    var self = this
    return (self._channel && self._channel.bufferedAmount) || 0
  }
})

Peer.prototype.address = function () {
  var self = this
  return { port: self.localPort, family: self.localFamily, address: self.localAddress }
}

Peer.prototype.signal = function (data) {
  var self = this
  if (self.destroyed) throw makeError('cannot signal after peer is destroyed', 'ERR_SIGNALING')
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      data = {}
    }
  }
  self._debug('signal()')

  if (data.renegotiate && self.initiator) {
    self._debug('got request to renegotiate')
    self._needsNegotiation()
  }
  if (data.transceiverRequest && self.initiator) {
    self._debug('got request for transceiver')
    self.addTransceiver(data.transceiverRequest.kind, data.transceiverRequest.init)
  }
  if (data.candidate) {
    if (self._pc.localDescription && self._pc.localDescription.type && self._pc.remoteDescription && self._pc.remoteDescription.type) {
      self._addIceCandidate(data.candidate)
    } else {
      self._pendingCandidates.push(data.candidate)
    }
  }
  if (data.sdp) {
    self._pc.setRemoteDescription(new (self._wrtc.RTCSessionDescription)(data)).then(function () {
      if (self.destroyed) return

      self._pendingCandidates.forEach(function (candidate) {
        self._addIceCandidate(candidate)
      })
      self._pendingCandidates = []

      if (self._pc.remoteDescription.type === 'offer') self._createAnswer()
    }).catch(function (err) { self.destroy(makeError(err, 'ERR_SET_REMOTE_DESCRIPTION')) })
  }
  if (!data.sdp && !data.candidate && !data.renegotiate && !data.transceiverRequest) {
    self.destroy(makeError('signal() called with invalid signal data', 'ERR_SIGNALING'))
  }
}

Peer.prototype._addIceCandidate = function (candidate) {
  var self = this
  self._pc.addIceCandidate(new self._wrtc.RTCIceCandidate(candidate)).catch(function (err) {
    self.destroy(makeError(err, 'ERR_ADD_ICE_CANDIDATE'))
  })
}

/**
 * Send text/binary data to the remote peer.
 * @param {ArrayBufferView|ArrayBuffer|Buffer|string|Blob} chunk
 */
Peer.prototype.send = function (chunk) {
  var self = this
  self._channel.send(chunk)
}

/**
 * Add a Transceiver to the connection.
 * @param {String} kind
 * @param {Object} init
 */
Peer.prototype.addTransceiver = function (kind, init) {
  var self = this

  self._debug('addTransceiver()')

  if (self.initiator) {
    try {
      self._pc.addTransceiver(kind, init)
      self._needsNegotiation()
    } catch (err) {
      self.destroy(err)
    }
  } else {
    self.emit('signal', { // request initiator to renegotiate
      transceiverRequest: { kind, init }
    })
  }
}

/**
 * Add a MediaStream to the connection.
 * @param {MediaStream} stream
 */
Peer.prototype.addStream = function (stream) {
  var self = this

  self._debug('addStream()')

  stream.getTracks().forEach(function (track) {
    self.addTrack(track, stream)
  })
}

/**
 * Add a MediaStreamTrack to the connection.
 * @param {MediaStreamTrack} track
 * @param {MediaStream} stream
 */
Peer.prototype.addTrack = function (track, stream) {
  var self = this

  self._debug('addTrack()')

  var submap = self._senderMap.get(track) || new Map() // nested Maps map [track, stream] to sender
  var sender = submap.get(stream)
  if (!sender) {
    sender = self._pc.addTrack(track, stream)
    submap.set(stream, sender)
    self._senderMap.set(track, submap)
    self._needsNegotiation()
  } else if (sender.removed) {
    self.destroy(makeError('Track has been removed. You should enable/disable tracks that you want to re-add.'), 'ERR_SENDER_REMOVED')
  } else {
    self.destroy(makeError('Track has already been added to that stream.'), 'ERR_SENDER_ALREADY_ADDED')
  }
}

/**
 * Replace a MediaStreamTrack by another in the connection.
 * @param {MediaStreamTrack} oldTrack
 * @param {MediaStreamTrack} newTrack
 * @param {MediaStream} stream
 */
Peer.prototype.replaceTrack = function (oldTrack, newTrack, stream) {
  var self = this

  self._debug('replaceTrack()')

  var submap = self._senderMap.get(oldTrack)
  var sender = submap ? submap.get(stream) : null
  if (!sender) {
    self.destroy(makeError('Cannot replace track that was never added.'), 'ERR_TRACK_NOT_ADDED')
  }
  if (newTrack) self._senderMap.set(newTrack, submap)

  if (sender.replaceTrack != null) {
    sender.replaceTrack(newTrack)
  } else {
    self.destroy(makeError('replaceTrack is not supported in this browser', 'ERR_UNSUPPORTED_REPLACETRACK'))
  }
}

/**
 * Remove a MediaStreamTrack from the connection.
 * @param {MediaStreamTrack} track
 * @param {MediaStream} stream
 */
Peer.prototype.removeTrack = function (track, stream) {
  var self = this

  self._debug('removeSender()')

  var submap = self._senderMap.get(track)
  var sender = submap ? submap.get(stream) : null
  if (!sender) {
    self.destroy(makeError('Cannot remove track that was never added.', 'ERR_TRACK_NOT_ADDED'))
  }
  try {
    sender.removed = true
    self._pc.removeTrack(sender)
  } catch (err) {
    if (err.name === 'NS_ERROR_UNEXPECTED') {
      self._sendersAwaitingStable.push(sender) // HACK: Firefox must wait until (signalingState === stable) https://bugzilla.mozilla.org/show_bug.cgi?id=1133874
    } else {
      self.destroy(err)
    }
  }
  self._needsNegotiation()
}

/**
 * Remove a MediaStream from the connection.
 * @param {MediaStream} stream
 */
Peer.prototype.removeStream = function (stream) {
  var self = this

  self._debug('removeSenders()')

  stream.getTracks().forEach(function (track) {
    self.removeTrack(track, stream)
  })
}

Peer.prototype._needsNegotiation = function () {
  var self = this

  self._debug('_needsNegotiation')
  if (self._batchedNegotiation) return // batch synchronous renegotiations
  self._batchedNegotiation = true
  setTimeout(function () {
    self._batchedNegotiation = false
    self._debug('starting batched negotiation')
    self.negotiate()
  }, 0)
}

Peer.prototype.negotiate = function () {
  var self = this

  if (self.initiator) {
    if (self._isNegotiating) {
      self._queuedNegotiation = true
      self._debug('already negotiating, queueing')
    } else {
      self._debug('start negotiation')
      setTimeout(() => { // HACK: Chrome crashes if we immediately call createOffer
        self._createOffer()
      }, 0)
    }
  } else {
    if (!self._isNegotiating) {
      self._debug('requesting negotiation from initiator')
      self.emit('signal', { // request initiator to renegotiate
        renegotiate: true
      })
    }
  }
  self._isNegotiating = true
}

// TODO: Delete this method once readable-stream is updated to contain a default
// implementation of destroy() that automatically calls _destroy()
// See: https://github.com/nodejs/readable-stream/issues/283
Peer.prototype.destroy = function (err) {
  var self = this
  self._destroy(err, function () {})
}

Peer.prototype._destroy = function (err, cb) {
  var self = this
  if (self.destroyed) return

  self._debug('destroy (error: %s)', err && (err.message || err))

  self.readable = self.writable = false

  if (!self._readableState.ended) self.push(null)
  if (!self._writableState.finished) self.end()

  self.destroyed = true
  self.connected = false
  self._pcReady = false
  self._channelReady = false
  self._remoteTracks = null
  self._remoteStreams = null
  self._senderMap = null

  clearInterval(self._closingInterval)
  self._closingInterval = null

  clearInterval(self._interval)
  self._interval = null
  self._chunk = null
  self._cb = null

  if (self._onFinishBound) self.removeListener('finish', self._onFinishBound)
  self._onFinishBound = null

  if (self._channel) {
    try {
      self._channel.close()
    } catch (err) {}

    self._channel.onmessage = null
    self._channel.onopen = null
    self._channel.onclose = null
    self._channel.onerror = null
  }
  if (self._pc) {
    try {
      self._pc.close()
    } catch (err) {}

    self._pc.oniceconnectionstatechange = null
    self._pc.onicegatheringstatechange = null
    self._pc.onsignalingstatechange = null
    self._pc.onicecandidate = null
    self._pc.ontrack = null
    self._pc.ondatachannel = null
  }
  self._pc = null
  self._channel = null

  if (err) self.emit('error', err)
  self.emit('close')
  cb()
}

Peer.prototype._setupData = function (event) {
  var self = this
  if (!event.channel) {
    // In some situations `pc.createDataChannel()` returns `undefined` (in wrtc),
    // which is invalid behavior. Handle it gracefully.
    // See: https://github.com/feross/simple-peer/issues/163
    return self.destroy(makeError('Data channel event is missing `channel` property', 'ERR_DATA_CHANNEL'))
  }

  self._channel = event.channel
  self._channel.binaryType = 'arraybuffer'

  if (typeof self._channel.bufferedAmountLowThreshold === 'number') {
    self._channel.bufferedAmountLowThreshold = MAX_BUFFERED_AMOUNT
  }

  self.channelName = self._channel.label

  self._channel.onmessage = function (event) {
    self._onChannelMessage(event)
  }
  self._channel.onbufferedamountlow = function () {
    self._onChannelBufferedAmountLow()
  }
  self._channel.onopen = function () {
    self._onChannelOpen()
  }
  self._channel.onclose = function () {
    self._onChannelClose()
  }
  self._channel.onerror = function (err) {
    self.destroy(makeError(err, 'ERR_DATA_CHANNEL'))
  }

  // HACK: Chrome will sometimes get stuck in readyState "closing", let's check for this condition
  // https://bugs.chromium.org/p/chromium/issues/detail?id=882743
  var isClosing = false
  self._closingInterval = setInterval(function () { // No "onclosing" event
    if (self._channel && self._channel.readyState === 'closing') {
      if (isClosing) self._onChannelClose() // closing timed out: equivalent to onclose firing
      isClosing = true
    } else {
      isClosing = false
    }
  }, CHANNEL_CLOSING_TIMEOUT)
}

Peer.prototype._read = function () {}

Peer.prototype._write = function (chunk, encoding, cb) {
  var self = this
  if (self.destroyed) return cb(makeError('cannot write after peer is destroyed', 'ERR_DATA_CHANNEL'))

  if (self.connected) {
    try {
      self.send(chunk)
    } catch (err) {
      return self.destroy(makeError(err, 'ERR_DATA_CHANNEL'))
    }
    if (self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      self._debug('start backpressure: bufferedAmount %d', self._channel.bufferedAmount)
      self._cb = cb
    } else {
      cb(null)
    }
  } else {
    self._debug('write before connect')
    self._chunk = chunk
    self._cb = cb
  }
}

// When stream finishes writing, close socket. Half open connections are not
// supported.
Peer.prototype._onFinish = function () {
  var self = this
  if (self.destroyed) return

  if (self.connected) {
    destroySoon()
  } else {
    self.once('connect', destroySoon)
  }

  // Wait a bit before destroying so the socket flushes.
  // TODO: is there a more reliable way to accomplish this?
  function destroySoon () {
    setTimeout(function () {
      self.destroy()
    }, 1000)
  }
}

Peer.prototype._startIceCompleteTimeout = function () {
  var self = this
  if (self.destroyed) return
  if (self._iceCompleteTimer) return
  self._debug('started iceComplete timeout')
  self._iceCompleteTimer = setTimeout(function () {
    if (!self._iceComplete) {
      self._iceComplete = true
      self._debug('iceComplete timeout completed')
      self.emit('iceTimeout')
      self.emit('_iceComplete')
    }
  }, self.iceCompleteTimeout)
}

Peer.prototype._createOffer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createOffer(self.offerOptions).then(function (offer) {
    if (self.destroyed) return
    if (!self.trickle && !self.allowHalfTrickle) offer.sdp = filterTrickle(offer.sdp)
    offer.sdp = self.sdpTransform(offer.sdp)
    self._pc.setLocalDescription(offer).then(onSuccess).catch(onError)

    function onSuccess () {
      self._debug('createOffer success')
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendOffer()
      else self.once('_iceComplete', sendOffer) // wait for candidates
    }

    function onError (err) {
      self.destroy(makeError(err, 'ERR_SET_LOCAL_DESCRIPTION'))
    }

    function sendOffer () {
      if (self.destroyed) return
      var signal = self._pc.localDescription || offer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
    }
  }).catch(function (err) { self.destroy(makeError(err, 'ERR_CREATE_OFFER')) })
}

Peer.prototype._requestMissingTransceivers = function () {
  var self = this

  if (self._pc.getTransceivers) {
    self._pc.getTransceivers().forEach(transceiver => {
      if (!transceiver.mid && transceiver.sender.track && !transceiver.requested) {
        transceiver.requested = true // HACK: Safari returns negotiated transceivers with a null mid
        self.addTransceiver(transceiver.sender.track.kind)
      }
    })
  }
}

Peer.prototype._createAnswer = function () {
  var self = this
  if (self.destroyed) return

  self._pc.createAnswer(self.answerOptions).then(function (answer) {
    if (self.destroyed) return
    if (!self.trickle && !self.allowHalfTrickle) answer.sdp = filterTrickle(answer.sdp)
    answer.sdp = self.sdpTransform(answer.sdp)
    self._pc.setLocalDescription(answer).then(onSuccess).catch(onError)

    function onSuccess () {
      if (self.destroyed) return
      if (self.trickle || self._iceComplete) sendAnswer()
      else self.once('_iceComplete', sendAnswer)
    }

    function onError (err) {
      self.destroy(makeError(err, 'ERR_SET_LOCAL_DESCRIPTION'))
    }

    function sendAnswer () {
      if (self.destroyed) return
      var signal = self._pc.localDescription || answer
      self._debug('signal')
      self.emit('signal', {
        type: signal.type,
        sdp: signal.sdp
      })
      if (!self.initiator) self._requestMissingTransceivers()
    }
  }).catch(function (err) { self.destroy(makeError(err, 'ERR_CREATE_ANSWER')) })
}

Peer.prototype._onIceStateChange = function () {
  var self = this
  if (self.destroyed) return
  var iceConnectionState = self._pc.iceConnectionState
  var iceGatheringState = self._pc.iceGatheringState

  self._debug(
    'iceStateChange (connection: %s) (gathering: %s)',
    iceConnectionState,
    iceGatheringState
  )
  self.emit('iceStateChange', iceConnectionState, iceGatheringState)

  if (iceConnectionState === 'connected' || iceConnectionState === 'completed') {
    self._pcReady = true
    self._maybeReady()
  }
  if (iceConnectionState === 'failed') {
    self.destroy(makeError('Ice connection failed.', 'ERR_ICE_CONNECTION_FAILURE'))
  }
  if (iceConnectionState === 'closed') {
    self.destroy(makeError('Ice connection closed.', 'ERR_ICE_CONNECTION_CLOSED'))
  }
}

Peer.prototype.getStats = function (cb) {
  var self = this

  // Promise-based getStats() (standard)
  if (self._pc.getStats.length === 0) {
    self._pc.getStats().then(function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(flattenValues(report))
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Two-parameter callback-based getStats() (deprecated, former standard)
  } else if (self._isReactNativeWebrtc) {
    self._pc.getStats(null, function (res) {
      var reports = []
      res.forEach(function (report) {
        reports.push(flattenValues(report))
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Single-parameter callback-based getStats() (non-standard)
  } else if (self._pc.getStats.length > 0) {
    self._pc.getStats(function (res) {
      // If we destroy connection in `connect` callback this code might happen to run when actual connection is already closed
      if (self.destroyed) return

      var reports = []
      res.result().forEach(function (result) {
        var report = {}
        result.names().forEach(function (name) {
          report[name] = result.stat(name)
        })
        report.id = result.id
        report.type = result.type
        report.timestamp = result.timestamp
        reports.push(flattenValues(report))
      })
      cb(null, reports)
    }, function (err) { cb(err) })

  // Unknown browser, skip getStats() since it's anyone's guess which style of
  // getStats() they implement.
  } else {
    cb(null, [])
  }

  // statreports can come with a value array instead of properties
  function flattenValues (report) {
    if (Object.prototype.toString.call(report.values) === '[object Array]') {
      report.values.forEach(function (value) {
        Object.assign(report, value)
      })
    }
    return report
  }
}

Peer.prototype._maybeReady = function () {
  var self = this
  self._debug('maybeReady pc %s channel %s', self._pcReady, self._channelReady)
  if (self.connected || self._connecting || !self._pcReady || !self._channelReady) return

  self._connecting = true

  // HACK: We can't rely on order here, for details see https://github.com/js-platform/node-webrtc/issues/339
  function findCandidatePair () {
    if (self.destroyed) return

    self.getStats(function (err, items) {
      if (self.destroyed) return

      // Treat getStats error as non-fatal. It's not essential.
      if (err) items = []

      var remoteCandidates = {}
      var localCandidates = {}
      var candidatePairs = {}
      var foundSelectedCandidatePair = false

      items.forEach(function (item) {
        // TODO: Once all browsers support the hyphenated stats report types, remove
        // the non-hypenated ones
        if (item.type === 'remotecandidate' || item.type === 'remote-candidate') {
          remoteCandidates[item.id] = item
        }
        if (item.type === 'localcandidate' || item.type === 'local-candidate') {
          localCandidates[item.id] = item
        }
        if (item.type === 'candidatepair' || item.type === 'candidate-pair') {
          candidatePairs[item.id] = item
        }
      })

      items.forEach(function (item) {
        // Spec-compliant
        if (item.type === 'transport' && item.selectedCandidatePairId) {
          setSelectedCandidatePair(candidatePairs[item.selectedCandidatePairId])
        }

        // Old implementations
        if (
          (item.type === 'googCandidatePair' && item.googActiveConnection === 'true') ||
          ((item.type === 'candidatepair' || item.type === 'candidate-pair') && item.selected)
        ) {
          setSelectedCandidatePair(item)
        }
      })

      function setSelectedCandidatePair (selectedCandidatePair) {
        foundSelectedCandidatePair = true

        var local = localCandidates[selectedCandidatePair.localCandidateId]

        if (local && (local.ip || local.address)) {
          // Spec
          self.localAddress = local.ip || local.address
          self.localPort = Number(local.port)
        } else if (local && local.ipAddress) {
          // Firefox
          self.localAddress = local.ipAddress
          self.localPort = Number(local.portNumber)
        } else if (typeof selectedCandidatePair.googLocalAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          local = selectedCandidatePair.googLocalAddress.split(':')
          self.localAddress = local[0]
          self.localPort = Number(local[1])
        }
        if (self.localAddress) {
          self.localFamily = self.localAddress.includes(':') ? 'IPv6' : 'IPv4'
        }

        var remote = remoteCandidates[selectedCandidatePair.remoteCandidateId]

        if (remote && (remote.ip || remote.address)) {
          // Spec
          self.remoteAddress = remote.ip || remote.address
          self.remotePort = Number(remote.port)
        } else if (remote && remote.ipAddress) {
          // Firefox
          self.remoteAddress = remote.ipAddress
          self.remotePort = Number(remote.portNumber)
        } else if (typeof selectedCandidatePair.googRemoteAddress === 'string') {
          // TODO: remove this once Chrome 58 is released
          remote = selectedCandidatePair.googRemoteAddress.split(':')
          self.remoteAddress = remote[0]
          self.remotePort = Number(remote[1])
        }
        if (self.remoteAddress) {
          self.remoteFamily = self.remoteAddress.includes(':') ? 'IPv6' : 'IPv4'
        }

        self._debug(
          'connect local: %s:%s remote: %s:%s',
          self.localAddress, self.localPort, self.remoteAddress, self.remotePort
        )
      }

      // Ignore candidate pair selection in browsers like Safari 11 that do not have any local or remote candidates
      // But wait until at least 1 candidate pair is available
      if (!foundSelectedCandidatePair && (!Object.keys(candidatePairs).length || Object.keys(localCandidates).length)) {
        setTimeout(findCandidatePair, 100)
        return
      } else {
        self._connecting = false
        self.connected = true
      }

      if (self._chunk) {
        try {
          self.send(self._chunk)
        } catch (err) {
          return self.destroy(makeError(err, 'ERR_DATA_CHANNEL'))
        }
        self._chunk = null
        self._debug('sent chunk from "write before connect"')

        var cb = self._cb
        self._cb = null
        cb(null)
      }

      // If `bufferedAmountLowThreshold` and 'onbufferedamountlow' are unsupported,
      // fallback to using setInterval to implement backpressure.
      if (typeof self._channel.bufferedAmountLowThreshold !== 'number') {
        self._interval = setInterval(function () { self._onInterval() }, 150)
        if (self._interval.unref) self._interval.unref()
      }

      self._debug('connect')
      self.emit('connect')
    })
  }
  findCandidatePair()
}

Peer.prototype._onInterval = function () {
  var self = this
  if (!self._cb || !self._channel || self._channel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
    return
  }
  self._onChannelBufferedAmountLow()
}

Peer.prototype._onSignalingStateChange = function () {
  var self = this
  if (self.destroyed) return

  if (self._pc.signalingState === 'stable' && !self._firstStable) {
    self._isNegotiating = false

    // HACK: Firefox doesn't yet support removing tracks when signalingState !== 'stable'
    self._debug('flushing sender queue', self._sendersAwaitingStable)
    self._sendersAwaitingStable.forEach(function (sender) {
      self._pc.removeTrack(sender)
      self._queuedNegotiation = true
    })
    self._sendersAwaitingStable = []

    if (self._queuedNegotiation) {
      self._debug('flushing negotiation queue')
      self._queuedNegotiation = false
      self._needsNegotiation() // negotiate again
    }

    self._debug('negotiate')
    self.emit('negotiate')
  }
  self._firstStable = false

  self._debug('signalingStateChange %s', self._pc.signalingState)
  self.emit('signalingStateChange', self._pc.signalingState)
}

Peer.prototype._onIceCandidate = function (event) {
  var self = this
  if (self.destroyed) return
  if (event.candidate && self.trickle) {
    self.emit('signal', {
      candidate: {
        candidate: event.candidate.candidate,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        sdpMid: event.candidate.sdpMid
      }
    })
  } else if (!event.candidate && !self._iceComplete) {
    self._iceComplete = true
    self.emit('_iceComplete')
  }
  // as soon as we've received one valid candidate start timeout
  if (event.candidate) {
    self._startIceCompleteTimeout()
  }
}

Peer.prototype._onChannelMessage = function (event) {
  var self = this
  if (self.destroyed) return
  var data = event.data
  if (data instanceof ArrayBuffer) data = Buffer.from(data)
  self.push(data)
}

Peer.prototype._onChannelBufferedAmountLow = function () {
  var self = this
  if (self.destroyed || !self._cb) return
  self._debug('ending backpressure: bufferedAmount %d', self._channel.bufferedAmount)
  var cb = self._cb
  self._cb = null
  cb(null)
}

Peer.prototype._onChannelOpen = function () {
  var self = this
  if (self.connected || self.destroyed) return
  self._debug('on channel open')
  self._channelReady = true
  self._maybeReady()
}

Peer.prototype._onChannelClose = function () {
  var self = this
  if (self.destroyed) return
  self._debug('on channel close')
  self.destroy()
}

Peer.prototype._onTrack = function (event) {
  var self = this
  if (self.destroyed) return

  event.streams.forEach(function (eventStream) {
    self._debug('on track')
    self.emit('track', event.track, eventStream)

    self._remoteTracks.push({
      track: event.track,
      stream: eventStream
    })

    if (self._remoteStreams.some(function (remoteStream) {
      return remoteStream.id === eventStream.id
    })) return // Only fire one 'stream' event, even though there may be multiple tracks per stream

    self._remoteStreams.push(eventStream)
    setTimeout(function () {
      self.emit('stream', eventStream) // ensure all tracks have been added
    }, 0)
  })
}

Peer.prototype._debug = function () {
  var self = this
  var args = [].slice.call(arguments)
  args[0] = '[' + self._id + '] ' + args[0]
  debug.apply(null, args)
}

// HACK: Filter trickle lines when trickle is disabled #354
function filterTrickle (sdp) {
  return sdp.replace(/a=ice-options:trickle\s\n/g, '')
}

function makeError (message, code) {
  var err = new Error(message)
  err.code = code
  return err
}

}).call(this,require("buffer").Buffer)
},{"buffer":33,"debug":107,"get-browser-rtc":37,"inherits":58,"randombytes":94,"readable-stream":104}],107:[function(require,module,exports){
(function (process){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this,require('_process'))
},{"./common":108,"_process":93}],108:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":63}],109:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = require('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":110}],110:[function(require,module,exports){
arguments[4][103][0].apply(exports,arguments)
},{"buffer":33,"dup":103}],111:[function(require,module,exports){
module.exports = function createTestableErrorClass(name) {
  function TestableError(message){
    this.message = `${this.name}: ${message}`
    this.error = new Error()
    this.stack = this.error.stack
  }
  TestableError.prototype  = Object.create(Error.prototype)
  TestableError.prototype.name = name
  TestableError.prototype.constructor = TestableError
  Object.defineProperty(TestableError, 'name', { value: name })
  return TestableError
}

},{}],112:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":93,"timers":112}],113:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[12])(12)
});
