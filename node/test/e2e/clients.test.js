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
var isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var delay_1 = __importDefault(require("delay"));
var fs_1 = __importDefault(require("fs"));
var wrtc_1 = __importDefault(require("wrtc"));
var tiny_worker_1 = __importDefault(require("tiny-worker"));
var Client_1 = require("../../classes/Client");
var MissiveGenerator_1 = require("../../classes/MissiveGenerator");
var params_1 = require("./lib/params");
var Friendship_1 = require("../../classes/Friendship");
var missives = [];
var clients = [];
var intervalId = setInterval(function () {
    var clientSummaryJsonables = clients.map(function (client) {
        var clientSummary = client.getSummary();
        if (clientSummary.struct.partySummary.getFriendshipsCountByStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTED)
            === params_1.maxFriendshipsCount) {
            return 'Fully Connected';
        }
        return clientSummary.toJsonable();
    });
    var clientSummariesJson = JSON.stringify(clientSummaryJsonables, null, 2);
    fs_1.default.writeFileSync(__dirname + "/../../../clients.test.json", clientSummariesJson);
}, 1000);
test('create clients', function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < params_1.clientsCount)) return [3, 4];
                client = new Client_1.Client({
                    signalingServerUrls: params_1.signalingServerUrls,
                    maxFriendshipsCount: params_1.maxFriendshipsCount,
                    bootstrapOffersTimeout: i % 2 ? 0 : 5,
                    maxOfferAttemptsCount: 2,
                    wrtc: wrtc_1.default,
                    WebSocket: isomorphic_ws_1.default,
                    missiveLatencyTolerance: 10,
                    sdpTimeout: 10,
                    connectionTimeout: 10,
                    maxOfferLastReceivedAgo: 10,
                    offerReuploadInterval: 5,
                });
                clients.push(client);
                return [4, delay_1.default(1000)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3, 1];
            case 4: return [2];
        }
    });
}); }, params_1.clientsCount * 1000 + 5000);
test('await fullyConnected', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, Promise.all(clients.map(function (client) {
                    return new Promise(function (resolve) {
                        var handleId = client.summarySnowdrop.addHandle(function (summary) {
                            var connectedFriendshipsCount = summary.struct.partySummary.getFriendshipsCountByStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTED);
                            console.log('connectedFriendshipsCount', connectedFriendshipsCount);
                            if (connectedFriendshipsCount === params_1.maxFriendshipsCount) {
                                console.log('resolve');
                                client.summarySnowdrop.removeHandleById(handleId);
                                resolve();
                            }
                        });
                    });
                }))];
            case 1:
                _a.sent();
                clearInterval(intervalId);
                return [2];
        }
    });
}); }, 600000);
test('create missives', function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, missiveGenerator, missive;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < params_1.missivesCount)) return [3, 4];
                missiveGenerator = new MissiveGenerator_1.MissiveGenerator({
                    applicationId: pollenium_uvaursi_1.Uu.genRandom(32),
                    applicationData: pollenium_uvaursi_1.Uu.genRandom(32),
                    difficulty: 1,
                    ttl: 30,
                    hashcashWorker: new tiny_worker_1.default(__dirname + "/../../../node/hashcash-worker.js", [], {
                        esm: true,
                    }),
                });
                return [4, missiveGenerator.fetchMissive()];
            case 2:
                missive = _a.sent();
                missives.push(missive);
                _a.label = 3;
            case 3:
                i++;
                return [3, 1];
            case 4: return [2];
        }
    });
}); });
test('missive', function () { return __awaiter(void 0, void 0, void 0, function () {
    var receivesCount;
    return __generator(this, function (_a) {
        receivesCount = 0;
        clients.forEach(function (client) {
            client.missiveSnowdrop.addHandle(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            receivesCount += 1;
                            if (!(receivesCount === params_1.expectedMissiveReceivesCount)) return [3, 2];
                            return [4, delay_1.default(2000)];
                        case 1:
                            _a.sent();
                            if (receivesCount !== params_1.expectedMissiveReceivesCount) {
                                throw new Error('Received too many times');
                            }
                            _a.label = 2;
                        case 2: return [2];
                    }
                });
            }); });
        });
        missives.forEach(function (missive) {
            clients[0].broadcastMissive(missive);
        });
        return [2];
    });
}); });
//# sourceMappingURL=clients.test.js.map