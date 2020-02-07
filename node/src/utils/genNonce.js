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
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var shasta = __importStar(require("pollenium-shasta"));
var genTime_1 = require("./genTime");
var genMaxScore_1 = require("./genMaxScore");
var TimeoutError = (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError() {
        return _super.call(this, 'genNonce Timeout') || this;
    }
    return TimeoutError;
}(Error));
exports.TimeoutError = TimeoutError;
function genNonce(struct) {
    var maxScore = genMaxScore_1.genMaxScore(struct);
    while (true) {
        if (genTime_1.genTime() > struct.timeoutAt) {
            throw new TimeoutError();
        }
        var nonce = pollenium_uvaursi_1.Uu.genRandom(32);
        var prehash = pollenium_uvaursi_1.Uu.genConcat([struct.noncelessPrehash, nonce]);
        var hash = new pollenium_buttercup_1.Uint256(shasta.genSha256(prehash));
        if (hash.compLte(maxScore)) {
            return new pollenium_buttercup_1.Uint256(nonce);
        }
    }
}
exports.genNonce = genNonce;
//# sourceMappingURL=genNonce.js.map