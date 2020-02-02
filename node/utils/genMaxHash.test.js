"use strict";
exports.__esModule = true;
var pollenium_uvaursi_1 = require("pollenium-uvaursi");
var genMaxHash_1 = require("./genMaxHash");
var pollenium_buttercup_1 = require("pollenium-buttercup");
var noncelessPrehash = pollenium_uvaursi_1.Uu.genRandom(64);
var _loop_1 = function (difficulty) {
    test("genMaxHash: difficulty: " + difficulty, function () {
        expect(genMaxHash_1.genMaxHash({
            difficulty: difficulty,
            applicationDataLength: 69,
            cover: 32
        })).toBeInstanceOf(pollenium_buttercup_1.Uint256);
    });
};
for (var difficulty = 0; difficulty <= 8; difficulty++) {
    _loop_1(difficulty);
}
