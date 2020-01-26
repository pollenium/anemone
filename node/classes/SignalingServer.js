"use strict";
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
var Menteeship_1 = require("./Menteeship");
var server_destroy_1 = __importDefault(require("server-destroy"));
var SignalingServer = (function () {
    function SignalingServer(port) {
        this.port = port;
        this.menteeships = [];
        this.menteeshipsByOfferIdHex = {};
        this.bootstrap();
    }
    SignalingServer.prototype.bootstrap = function () {
        var _this = this;
        this.httpServer = http.createServer(function (_request, response) {
            response.writeHead(404);
            response.end();
        });
        server_destroy_1.default(this.httpServer);
        this.httpServer.listen(this.port, function () { });
        this.wsServer = new websocket_1.server({
            httpServer: this.httpServer,
            autoAcceptConnections: true
        });
        this.wsServer.on('connect', function (wsConnection) {
            var menteeship = new Menteeship_1.Menteeship(_this, wsConnection);
            _this.menteeships.push(menteeship);
            menteeship.offerSnowdrop.addHandle(function (offer) {
                var offerIdHex = offer.getId().toHex();
                _this.menteeshipsByOfferIdHex[offerIdHex] = menteeship;
                _this.menteeships.sort(function () {
                    return Math.random() - .5;
                }).forEach(function (_menteeship) {
                    if (menteeship === _menteeship) {
                        return;
                    }
                    _menteeship.sendOffer(offer);
                });
            });
            menteeship.answerSnowdrop.addHandle(function (answer) {
                _this.menteeshipsByOfferIdHex[answer.offerId.toHex()].sendAnswer(answer);
            });
            menteeship.flushOfferSnowdrop.addHandle(function (flushOffer) {
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
        this.httpServer.destroy();
    };
    return SignalingServer;
}());
exports.SignalingServer = SignalingServer;
//# sourceMappingURL=SignalingServer.js.map