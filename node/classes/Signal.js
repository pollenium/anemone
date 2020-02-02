"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var shasta = __importStar(require("pollenium-shasta"));
var pollenium_buttercup_1 = require("pollenium-buttercup");
var Signal = /** @class */ (function () {
    function Signal() {
    }
    Signal.prototype.getHash = function () {
        if (this.hash) {
            return this.hash;
        }
        this.hash = new pollenium_buttercup_1.Bytes32(shasta.genSha256(this.getEncoding()));
        return this.hash;
    };
    return Signal;
}());
exports.Signal = Signal;
