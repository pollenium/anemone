"use strict";
exports.__esModule = true;
var MissiveDb = /** @class */ (function () {
    function MissiveDb() {
        this.isReceivedByIdHex = {};
    }
    MissiveDb.prototype.getIsReceived = function (missive) {
        var missiveIdHex = missive.getId().uu.toHex();
        return isReceivedByIdHex[missiveIdHex] === true;
    };
    return MissiveDb;
}());
exports.MissiveDb = MissiveDb;
