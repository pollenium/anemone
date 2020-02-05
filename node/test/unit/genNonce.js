"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var genTime_1 = require("../../src/utils/genTime");
var genNonce_1 = require("../../src/utils/genNonce");
var noncelessPrehash = pollenium_uvaursi_1.Uu.genRandom(64);
mocha_1.describe('genNonce', function () {
    var _loop_1 = function (difficulty) {
        mocha_1.describe("difficulty: " + difficulty, function () {
            mocha_1.it('should generate nonce', function () {
                var nonce = genNonce_1.genNonce({
                    noncelessPrehash: noncelessPrehash,
                    difficulty: difficulty,
                    applicationDataLength: 69,
                    cover: 32,
                    timeoutAt: genTime_1.genTime() + 60,
                });
                chai_1.expect(nonce).to.be.instanceof(pollenium_buttercup_1.Uint256);
            });
        });
    };
    for (var difficulty = 0; difficulty <= 8; difficulty++) {
        _loop_1(difficulty);
    }
});
//# sourceMappingURL=genNonce.js.map