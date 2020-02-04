"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var genMaxHash_1 = require("./genMaxHash");
var _loop_1 = function (difficulty) {
    test("genMaxHash: difficulty: " + difficulty, function () {
        var maxHash = genMaxHash_1.genMaxHash({
            difficulty: difficulty,
            applicationDataLength: 69,
            cover: 32,
        });
        expect(maxHash).toBeInstanceOf(pollenium_buttercup_1.Uint256);
    });
};
for (var difficulty = 0; difficulty <= 8; difficulty += 1) {
    _loop_1(difficulty);
}
//# sourceMappingURL=genMaxHash.test.js.map