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
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var Menteeship_1 = require("./Menteeship");
var events_1 = __importDefault(require("events"));
var express = require("express");
var SignalingServer = (function (_super) {
    __extends(SignalingServer, _super);
    function SignalingServer(port) {
        var _this = _super.call(this) || this;
        _this.port = port;
        _this.menteeships = [];
        _this.menteeshipsByOfferIdHex = {};
        _this.bootstrap();
        return _this;
    }
    SignalingServer.prototype.bootstrap = function () {
        var _this = this;
        this.expressServer = express().listen(this.port);
        this.wsServer = new ws_1.Server({
            server: this.expressServer
        });
        this.wsServer.on('connection', function (wsConnection) {
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
        this.expressServer.destroy();
    };
    return SignalingServer;
}(events_1.default));
exports.SignalingServer = SignalingServer;
//# sourceMappingURL=SignalingServer.js.map