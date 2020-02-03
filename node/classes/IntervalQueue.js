"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var delay_1 = __importDefault(require("delay"));
function genTimeMs() {
    return new Date().getTime();
}
var IntervalQueue = /** @class */ (function () {
    function IntervalQueue(intervalMs) {
        this.intervalMs = intervalMs;
        this.nextTurnAtMs = 0;
    }
    IntervalQueue.prototype.awaitTurn = function () {
        var _this = this;
        return new Promise(function (resolve) {
            delay_1["default"](_this.genTimeTillNextTurnMs()).then(function () {
                resolve();
            });
            _this.incrementNextTurnAtMs();
        });
    };
    IntervalQueue.prototype.genTimeTillNextTurnMs = function () {
        var timeMs = genTimeMs();
        if (timeMs > this.nextTurnAtMs) {
            return 0;
        }
        else {
            return this.nextTurnAtMs - timeMs;
        }
    };
    IntervalQueue.prototype.incrementNextTurnAtMs = function () {
        var timeMs = genTimeMs();
        if (timeMs > this.nextTurnAtMs) {
            this.nextTurnAtMs = timeMs + this.intervalMs;
        }
        else {
            this.nextTurnAtMs = this.nextTurnAtMs + this.intervalMs;
        }
    };
    return IntervalQueue;
}());
exports.IntervalQueue = IntervalQueue;
