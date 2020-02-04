"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_buttercup_1 = require("pollenium-buttercup");
var genTime_1 = require("../utils/genTime");
var OfferInfo = (function () {
    function OfferInfo(struct) {
        this.attemptsCount = 0;
        this.firstReceivedAt = genTime_1.genTime();
        this.lastReceivedAt = genTime_1.genTime();
        this.offer = struct.offer;
        this.clientId = struct.clientId;
    }
    OfferInfo.prototype.getAttemptsCount = function () {
        return this.attemptsCount;
    };
    OfferInfo.prototype.getFirstReceivedAgo = function () {
        return genTime_1.genTime() - this.firstReceivedAt;
    };
    OfferInfo.prototype.getLastReceivedAgo = function () {
        return genTime_1.genTime() - this.lastReceivedAt;
    };
    OfferInfo.prototype.incrementAttemptsCount = function () {
        this.attemptsCount += 1;
    };
    OfferInfo.prototype.updateLastReceivedAt = function () {
        this.lastReceivedAt = genTime_1.genTime();
    };
    OfferInfo.prototype.getDistance = function () {
        if (this.distance) {
            return this.distance;
        }
        var xor = this.offer.clientId.uu.genXor(this.clientId.uu);
        return new pollenium_buttercup_1.Uint256(xor);
    };
    return OfferInfo;
}());
exports.OfferInfo = OfferInfo;
//# sourceMappingURL=OfferInfo.js.map