"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var genTime_1 = require("./genTime");
var genNonce_1 = require("./genNonce");
var noncelessPrehash = pollenium_uvaursi_1.Uu.genRandom(64);
var _loop_1 = function (difficulty) {
    test("genNonce (non-worker): difficulty: " + difficulty, function () {
        var nonce = genNonce_1.genNonce({
            noncelessPrehash: noncelessPrehash,
            difficulty: difficulty,
            applicationDataLength: 69,
            cover: 32,
            timeoutAt: genTime_1.genTime() + 60,
        });
        expect(nonce).toBeInstanceOf(pollenium_buttercup_1.Uint256);
    });
};
for (var difficulty = 0; difficulty <= 8; difficulty++) {
    _loop_1(difficulty);
}
//# sourceMappingURL=genNonce.test.js.map