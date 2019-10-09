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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var websocket_1 = require("websocket");
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var Menteeship_1 = require("./Menteeship");
var events_1 = __importDefault(require("events"));
var server_destroy_1 = __importDefault(require("server-destroy"));
var SignalingServer = (function (_super) {
    __extends(SignalingServer, _super);
    function SignalingServer(port, isTls) {
        if (isTls === void 0) { isTls = false; }
        var _this = _super.call(this) || this;
        _this.port = port;
        _this.isTls = isTls;
        _this.menteeships = [];
        _this.menteeshipsByOfferIdHex = {};
        _this.bootstrap();
        return _this;
    }
    SignalingServer.prototype.bootstrap = function () {
        var _this = this;
        var httpx = this.isTls ? http : https;
        this.httpxServer = httpx.createServer(function (_request, response) {
            response.writeHead(404);
            response.end();
        });
        server_destroy_1.default(this.httpxServer);
        this.httpxServer.listen(this.port, function () { });
        this.wsServer = new websocket_1.server({
            httpServer: this.httpxServer,
            autoAcceptConnections: true
        });
        this.wsServer.on('connect', function (wsConnection) {
            var menteeship = new Menteeship_1.Menteeship(_this, wsConnection);
            _this.menteeships.push(menteeship);
            menteeship.on('offer', function (offer) {
                var offerIdHex = offer.getId().getHex();
                _this.menteeshipsByOfferIdHex[offerIdHex] = menteeship;
                _this.menteeships.sort(function () {
                    return Math.random() - .5;
                }).forEach(function (_menteeship) {
                    if (menteeship === _menteeship) {
                        return;
                    }
                    _menteeship.sendOffer(offer);
                });
                _this.emit('offer', offer);
            });
            menteeship.on('answer', function (answer) {
                _this.menteeshipsByOfferIdHex[answer.offerId.getHex()].sendAnswer(answer);
            });
            menteeship.on('flushOffer', function (flushOffer) {
                _this.menteeships.sort(function () {
                    return Math.random() - .5;
                }).forEach(function (_menteeship) {
                    _menteeship.sendFlushOffer(flushOffer);
                });
            });
        });
    };
    SignalingServer.prototype.destroy = function () {
        this.wsServer.shutDown();
        this.httpxServer.destroy();
    };
    return SignalingServer;
}(events_1.default));
exports.SignalingServer = SignalingServer;
//# sourceMappingURL=SignalingServer.js.map