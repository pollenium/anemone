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
exports.__esModule = true;
var Client_1 = require("../classes/Client");
var params_1 = require("./lib/params");
var delay_1 = __importDefault(require("delay"));
var fs_1 = __importDefault(require("fs"));
var pollenium_primrose_1 = require("pollenium-primrose");
var wrtc_1 = __importDefault(require("wrtc"));
var clients = [];
var clientsPrimrose = new pollenium_primrose_1.Primrose();
function fetchClients() {
    return clientsPrimrose.promise;
}
exports.fetchClients = fetchClients;
var intervalId = setInterval(function () {
    fs_1["default"].writeFileSync(__dirname + "/../../clients.test.json", JSON.stringify(clients.map(function (client) {
        return client.getSummary().toJsonable();
    }).map(function (clientSummaryJsonable) {
        if (clientSummaryJsonable.partySummary.connectedFriendshipsCount === params_1.maxFriendshipsCount) {
            return 'Fully Connected';
        }
        else {
            return clientSummaryJsonable;
        }
    }), null, 2));
}, 1000);
test('create clients', function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, client;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < params_1.clientsCount)) return [3 /*break*/, 4];
                client = new Client_1.Client({
                    signalingServerUrls: params_1.signalingServerUrls,
                    maxFriendshipsCount: params_1.maxFriendshipsCount,
                    bootstrapOffersTimeout: i % 2 ? 0 : 5,
                    maxOfferAttemptsCount: 2,
                    wrtc: wrtc_1["default"],
                    missiveLatencyTolerance: 10,
                    sdpTimeout: 10,
                    connectionTimeout: 10,
                    maxOfferLastReceivedAgo: 10,
                    offerReuploadInterval: 5
                });
                clients.push(client);
                return [4 /*yield*/, delay_1["default"](1000)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); }, params_1.clientsCount * 1000 + 5000);
test('await fullyConnected', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(clients.map(function (client) {
                    return new Promise(function (resolve, reject) {
                        var handleId = client.summarySnowdrop.addHandle(function (summary) {
                            var connectedFriendshipsCount = summary.partySummary.getFriendshipsCountByStatus(2);
                            if (connectedFriendshipsCount !== params_1.maxFriendshipsCount) {
                                return;
                            }
                            else {
                                client.summarySnowdrop.removeHandleById(handleId);
                                resolve();
                            }
                        });
                    });
                }))];
            case 1:
                _a.sent();
                clearInterval(intervalId);
                clientsPrimrose.resolve(clients);
                return [2 /*return*/];
        }
    });
}); }, 600000);
