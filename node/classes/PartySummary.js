"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts_enum_util_1 = require("ts-enum-util");
var Summary_1 = require("./Summary");
var genTime_1 = require("../utils/genTime");
var Friendship_1 = require("./Friendship");
var PartySummary = (function (_super) {
    __extends(PartySummary, _super);
    function PartySummary(struct) {
        var _this = _super.call(this) || this;
        _this.struct = struct;
        _this.createdAt = genTime_1.genTime();
        return _this;
    }
    PartySummary.prototype.getFriendshipsCount = function () {
        return (this.struct.extrovertsGroupSummary.getFriendshipsCount()
            + this.struct.introvertsGroupSummary.getFriendshipsCount());
    };
    PartySummary.prototype.getFriendshipsCountByStatus = function (friendshipStatus) {
        return (this.struct.extrovertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus)
            + this.struct.introvertsGroupSummary.getFriendshipsCountByStatus(friendshipStatus));
    };
    PartySummary.prototype.getFriendshipsCountsByStatus = function () {
        var _this = this;
        var friendshipsCountsByStatus = {};
        ts_enum_util_1.$enum(Friendship_1.FRIENDSHIP_STATUS).forEach(function (status) {
            friendshipsCountsByStatus[status] = _this.getFriendshipsCountByStatus(status);
        });
        return friendshipsCountsByStatus;
    };
    PartySummary.prototype.toJsonable = function () {
        return {
            createdAt: this.createdAt,
            createdAgo: genTime_1.genTime() - this.createdAt,
            friendshipsCount: this.getFriendshipsCount(),
            connectedFriendshipsCount: this.getFriendshipsCountByStatus(Friendship_1.FRIENDSHIP_STATUS.CONNECTED),
            offersCount: this.struct.offerInfos.length,
            offerInfos: this.struct.offerInfos.map(function (offerInfo) {
                return {
                    idHex: offerInfo.offer.id.uu.toHex(),
                    offerClientIdHex: offerInfo.offer.clientId.uu.toHex(),
                    attemptsCount: offerInfo.getAttemptsCount(),
                    firstReceivedAgo: offerInfo.getFirstReceivedAgo(),
                    lastReceivedAgo: offerInfo.getLastReceivedAgo(),
                    distance: offerInfo.getDistance().uu.toHex(),
                };
            }),
            friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
            introvertsGroup: this.struct.introvertsGroupSummary.toJsonable(),
            extrovertsGroup: this.struct.extrovertsGroupSummary.toJsonable(),
        };
    };
    PartySummary.prototype.toJson = function () {
        return JSON.stringify(this.toJsonable(), null, 2);
    };
    return PartySummary;
}(Summary_1.Summary));
exports.PartySummary = PartySummary;
//# sourceMappingURL=PartySummary.js.map