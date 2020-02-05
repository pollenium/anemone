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
var tiny_worker_1 = __importDefault(require("tiny-worker"));
var wrtc_1 = __importDefault(require("wrtc"));
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_primrose_1 = require("pollenium-primrose");
var mocha_1 = require("mocha");
var Introvert_1 = require("../../classes/Friendship/Introvert");
var Extrovert_1 = require("../../classes/Friendship/Extrovert");
var Offer_1 = require("../../classes/Signal/Offer");
var Answer_1 = require("../../classes/Signal/Answer");
var Friendship_1 = require("../../classes/Friendship");
var MissiveGenerator_1 = require("../../classes/MissiveGenerator");
var clientId = pollenium_uvaursi_1.Uu.genRandom(32);
var struct = {
    wrtc: wrtc_1.default,
    missiveLatencyTolerance: 30,
    sdpTimeout: 30,
    connectionTimeout: 10,
};
var extrovert;
var introvert;
var offer;
var answer;
var missive;
mocha_1.describe('friendshipConnection', function () {
    mocha_1.it(' should create extrovert', function () {
        extrovert = new Extrovert_1.Extrovert(struct);
    });
    mocha_1.it('should create offer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = Offer_1.Offer.bind;
                    _b = {
                        id: pollenium_uvaursi_1.Uu.genRandom(32),
                        clientId: clientId
                    };
                    return [4, extrovert.fetchSdpb()];
                case 1:
                    offer = new (_a.apply(Offer_1.Offer, [void 0, (_b.sdpb = _c.sent(),
                            _b)]))();
                    return [2];
            }
        });
    }); }).timeout(10 * 1000);
    mocha_1.it('should create introvert', function () {
        introvert = new Introvert_1.Introvert(offer, struct);
    });
    mocha_1.it('should create answer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = Answer_1.Answer.bind;
                    _b = {
                        clientId: clientId,
                        offerId: offer.id
                    };
                    return [4, introvert.fetchSdpb()];
                case 1:
                    answer = new (_a.apply(Answer_1.Answer, [void 0, (_b.sdpb = _c.sent(),
                            _b)]))();
                    return [2];
            }
        });
    }); }).timeout(10 * 1000);
    mocha_1.it('should connect', function () {
        var connectionPrimrose = new pollenium_primrose_1.Primrose();
        extrovert.statusSnowdrop.addHandle(function (signal) {
            if (signal === Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                connectionPrimrose.resolve();
            }
        });
        extrovert.handleAnswer(answer);
        return connectionPrimrose.promise;
    }).timeout(30 * 1000);
    mocha_1.it('should create missive', function () { return __awaiter(void 0, void 0, void 0, function () {
        var missiveGenerator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    missiveGenerator = new MissiveGenerator_1.MissiveGenerator({
                        applicationId: pollenium_uvaursi_1.Uu.genRandom(32),
                        applicationData: pollenium_uvaursi_1.Uu.genRandom(32),
                        ttl: 30,
                        difficulty: 4,
                        hashcashWorker: new tiny_worker_1.default(__dirname + "/../../../node/hashcash-worker.js", [], {
                            esm: true,
                        }),
                    });
                    return [4, missiveGenerator.fetchMissive()];
                case 1:
                    missive = _a.sent();
                    return [2];
            }
        });
    }); }).timeout(20 * 1000);
    mocha_1.it('should send and receive missive', function () { return __awaiter(void 0, void 0, void 0, function () {
        var testPrimrose;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testPrimrose = new pollenium_primrose_1.Primrose();
                    introvert.missiveSnowdrop.addHandle(function (_missive) {
                        if (missive.getHash().uu.getIsEqual(_missive.getHash().uu)) {
                            testPrimrose.resolve();
                        }
                        else {
                            testPrimrose.reject('Missive mismatch');
                        }
                    });
                    extrovert.sendMissive(missive);
                    return [4, testPrimrose.promise];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); }).timeout(30 * 1000);
    mocha_1.it('should destroy', function () {
        introvert.destroy(Friendship_1.DESTROY_REASON.GOODBYE);
        extrovert.destroy(Friendship_1.DESTROY_REASON.GOODBYE);
    });
});
//# sourceMappingURL=friendshipConnection.js.map