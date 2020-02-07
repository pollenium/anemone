"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var genMaxScore_1 = require("../../src/utils/genMaxScore");
mocha_1.describe('genMaxScore', function () {
    var _loop_1 = function (difficulty) {
        mocha_1.describe("difficulty: " + difficulty, function () {
            var MaxScore = genMaxScore_1.genMaxScore({
                difficulty: difficulty,
                applicationDataLength: 69,
                cover: 32,
            });
            mocha_1.it('should be instance of Uint256', function () {
                chai_1.expect(MaxScore).to.be.instanceof(pollenium_buttercup_1.Uint256);
            });
        });
    };
    for (var difficulty = 0; difficulty <= 8; difficulty++) {
        _loop_1(difficulty);
    }
});
//# sourceMappingURL=genMaxScore.js.map