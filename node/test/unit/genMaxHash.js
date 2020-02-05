"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var mocha_1 = require("mocha");
var chai_1 = require("chai");
var genMaxHash_1 = require("../../utils/genMaxHash");
mocha_1.describe('genMaxHash', function () {
    var _loop_1 = function (difficulty) {
        mocha_1.describe("difficulty: " + difficulty, function () {
            var maxHash = genMaxHash_1.genMaxHash({
                difficulty: difficulty,
                applicationDataLength: 69,
                cover: 32,
            });
            mocha_1.it('should be instance of Uint256', function () {
                chai_1.expect(maxHash).to.be.instanceof(pollenium_buttercup_1.Uint256);
            });
        });
    };
    for (var difficulty = 0; difficulty <= 8; difficulty++) {
        _loop_1(difficulty);
    }
});
//# sourceMappingURL=genMaxHash.js.map