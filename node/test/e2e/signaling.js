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
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var mocha_1 = require("mocha");
var delay_1 = __importDefault(require("delay"));
var SignalingClient_1 = require("../../classes/SignalingClient");
var params_1 = require("./lib/params");
var Offer_1 = require("../../classes/Signal/Offer");
var signalingClients = [];
var offer = new Offer_1.Offer({
    id: pollenium_uvaursi_1.Uu.genRandom(32),
    clientId: pollenium_uvaursi_1.Uu.genRandom(32),
    sdpb: pollenium_uvaursi_1.Uu.genRandom(64),
});
mocha_1.describe('signaling', function () {
    mocha_1.it('should create signalingClient', function () {
        for (var i = 0; i < 3; i++) {
            var signalingClient = new SignalingClient_1.SignalingClient({
                url: params_1.signalingServerUrls[0],
            });
            signalingClients.push(signalingClient);
        }
    });
    mocha_1.it('should wait a second', function () {
        return delay_1.default(1000);
    });
    mocha_1.it('should send/receive offers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var receivedPromise1, receivedPromise2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    receivedPromise1 = new Promise(function (resolve, reject) {
                        signalingClients[1].offerSnowdrop.addHandle(function (_offer) {
                            if (offer.id.uu.getIsEqual(_offer.id.uu)) {
                                resolve();
                            }
                            else {
                                reject(new Error('Ids dont match'));
                            }
                        });
                    });
                    receivedPromise2 = new Promise(function (resolve, reject) {
                        signalingClients[2].offerSnowdrop.addHandle(function (_offer) {
                            if (offer.id.uu.getIsEqual(_offer.id.uu)) {
                                resolve();
                            }
                            else {
                                reject(new Error('Ids dont match'));
                            }
                        });
                    });
                    signalingClients[0].sendOffer(offer);
                    return [4, Promise.all([receivedPromise1, receivedPromise2])];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); }).timeout(10 * 1000);
});
//# sourceMappingURL=signaling.js.map