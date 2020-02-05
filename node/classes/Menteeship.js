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
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var Offer_1 = require("./Signal/Offer");
var Answer_1 = require("./Signal/Answer");
var Flush_1 = require("./Signal/Flush");
var signalingMessage_1 = require("../templates/signalingMessage");
var Menteeship = (function () {
    function Menteeship(signalingServer, wsConnection) {
        this.signalingServer = signalingServer;
        this.wsConnection = wsConnection;
        this.offerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.answerSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.flushOfferSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.bootstrapPromise = this.bootstrap();
    }
    Menteeship.prototype.bootstrap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.wsConnection.on('message', function (message) {
                    if (message.type !== 'binary') {
                        return;
                    }
                    var signalingMessageHenpojo = signalingMessage_1.signalingMessageTemplate.decode(new Uint8Array(message.binaryData));
                    switch (signalingMessageHenpojo.key) {
                        case signalingMessage_1.SIGNALING_MESSAGE_KEY.OFFER:
                            var offer = new Offer_1.Offer(signalingMessageHenpojo.value);
                            _this.offerSnowdrop.emit(offer);
                            break;
                        case signalingMessage_1.SIGNALING_MESSAGE_KEY.ANSWER:
                            _this.answerSnowdrop.emit(new Answer_1.Answer(signalingMessageHenpojo.value));
                            break;
                        case signalingMessage_1.SIGNALING_MESSAGE_KEY.FLUSH:
                            _this.flushOfferSnowdrop.emit(new Flush_1.Flush(signalingMessageHenpojo.value));
                            break;
                        default:
                            throw new Error('Unhandled SIGNALING_MESSAGE_KEY');
                    }
                });
                return [2];
            });
        });
    };
    Menteeship.prototype.send = function (uish) {
        var buffer = Buffer.from(pollenium_uvaursi_1.Uu.wrap(uish).u);
        this.wsConnection.sendBytes(buffer);
    };
    Menteeship.prototype.sendOffer = function (offer) {
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
    Menteeship.prototype.sendAnswer = function (answer) {
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
    Menteeship.prototype.sendFlush = function (flushOffer) {
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
    Menteeship.prototype.destroy = function () {
        this.wsConnection.destroy();
    };
    return Menteeship;
}());
exports.Menteeship = Menteeship;
//# sourceMappingURL=Menteeship.js.map