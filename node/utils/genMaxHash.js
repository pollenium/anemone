"use strict";
exports.__esModule = true;
var pollenium_buttercup_1 = require("pollenium-buttercup");
var two256 = pollenium_buttercup_1.Uint256.fromNumber(2);
var twofiftyfive256 = pollenium_buttercup_1.Uint256.fromNumber(255);
function genMaxHash(struct) {
    var difficulty = pollenium_buttercup_1.Uint8.fromUintable(struct.difficulty);
    var cover = pollenium_buttercup_1.Uint256.fromUintable(struct.cover);
    var applicationDataLength = pollenium_buttercup_1.Uint256.fromUintable(struct.applicationDataLength);
    var pow = twofiftyfive256.opSub(difficulty);
    var divisor = cover.opAdd(applicationDataLength);
    var maxHash = two256.opPow(pow).opDiv(divisor);
    return maxHash;
}
exports.genMaxHash = genMaxHash;
