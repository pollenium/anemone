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
var pollenium_buttercup_1 = require("pollenium-buttercup");
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_primrose_1 = require("pollenium-primrose");
var tiny_worker_1 = __importDefault(require("tiny-worker"));
var Missive_1 = require("./Missive");
var genTimestamp_1 = require("../utils/genTimestamp");
var genTime_1 = require("../utils/genTime");
var genNonce_1 = require("../utils/genNonce");
var missive_1 = require("../templates/missive");
var HashcashWorker_1 = require("../interfaces/HashcashWorker");
var nullNonce = new Uint8Array(32).fill(0);
var MissiveGenerator = (function () {
    function MissiveGenerator(struct) {
        this.applicationId = pollenium_uvaursi_1.Uu.wrap(struct.applicationId);
        this.applicationData = pollenium_uvaursi_1.Uu.wrap(struct.applicationData);
        this.difficulty = pollenium_buttercup_1.Uint8.fromUintable(struct.difficulty);
        this.ttl = struct.ttl;
        this.hashcashWorkerUrl = struct.hashcashWorkerUrl;
    }
    MissiveGenerator.prototype.getNoncelessPrehash = function () {
        var encoding = missive_1.missiveTemplate.encode({
            key: missive_1.MISSIVE_KEY.V0,
            value: {
                nonce: nullNonce,
                difficulty: this.difficulty.u,
                timestamp: genTimestamp_1.genTimestamp().u,
                applicationId: this.applicationId.u,
                applicationData: this.applicationData.u,
            },
        });
        return new pollenium_uvaursi_1.Uu(encoding.slice(0, encoding.length - 32));
    };
    MissiveGenerator.prototype.fetchNonce = function () {
        var _this = this;
        var noncePrimrose = new pollenium_primrose_1.Primrose();
        var hashcashWorker = new tiny_worker_1.default(this.hashcashWorkerUrl, [], { esm: true });
        var onMessage = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var hashcashResolution;
            return __generator(this, function (_a) {
                hashcashWorker.terminate();
                hashcashResolution = event.data;
                switch (hashcashResolution.key) {
                    case HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.SUCCESS:
                        noncePrimrose.resolve(new pollenium_buttercup_1.Bytes32(pollenium_uvaursi_1.Uu.fromHexish(hashcashResolution.value)));
                        break;
                    case HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.TIMEOUT_ERROR:
                        noncePrimrose.reject(new genNonce_1.TimeoutError());
                        break;
                    case HashcashWorker_1.HASHCASH_WORKER_RESOLUTION_KEY.GENERIC_ERROR:
                        noncePrimrose.reject(new Error('Generic Errror '));
                        break;
                    default:
                        noncePrimrose.reject(Error('Unhandled HASHCASH_WORKER_RESOLUTION_KEY'));
                }
                return [2];
            });
        }); };
        hashcashWorker.addEventListener('message', onMessage);
        hashcashWorker.onerror = function (error) {
            noncePrimrose.reject(error);
        };
        var timeoutAt = genTime_1.genTime() + this.ttl;
        var request = {
            noncelessPrehashHex: this.getNoncelessPrehash().toHex(),
            difficulty: this.difficulty.toNumber(),
            cover: Missive_1.MISSIVE_COVER.V0,
            applicationDataLength: this.applicationData.u.length,
            timeoutAt: timeoutAt,
        };
        hashcashWorker.postMessage(request);
        return noncePrimrose.promise;
    };
    MissiveGenerator.prototype.fetchMissive = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = genTimestamp_1.genTimestamp();
                        return [4, this.fetchNonce()];
                    case 1:
                        nonce = _a.sent();
                        return [2, new Missive_1.Missive({
                                version: missive_1.MISSIVE_KEY.V0,
                                timestamp: timestamp,
                                difficulty: this.difficulty,
                                nonce: nonce,
                                applicationId: this.applicationId,
                                applicationData: this.applicationData,
                            })];
                }
            });
        });
    };
    return MissiveGenerator;
}());
exports.MissiveGenerator = MissiveGenerator;
//# sourceMappingURL=MissiveGenerator.js.map