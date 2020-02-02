"use strict";
exports.__esModule = true;
var pollenium_buttercup_1 = require("pollenium-buttercup");
var genTime_1 = require("./genTime");
function genTimestamp() {
    return pollenium_buttercup_1.Uint40.fromNumber(genTime_1.genTime());
}
exports.genTimestamp = genTimestamp;
