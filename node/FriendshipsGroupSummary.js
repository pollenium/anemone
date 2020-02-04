"use strict";
exports.__esModule = true;
var ts_enum_util_1 = require("ts-enum-util");
var Friendship_1 = require("./Friendship");
var FriendshipsGroupSummary = /** @class */ (function () {
    function FriendshipsGroupSummary(friendships) {
        var _a;
        this.friendships = friendships;
        this.statuses = [];
        (_a = this.statuses).push.apply(_a, friendships.map(function (friendship) {
            return friendship.getStatus();
        }));
    }
    FriendshipsGroupSummary.prototype.getFriendshipsCount = function () {
        return this.friendships.length;
    };
    FriendshipsGroupSummary.prototype.getFriendshipsCountByStatus = function (status) {
        return this.statuses.filter(function (_status) {
            return status === _status;
        }).length;
    };
    FriendshipsGroupSummary.prototype.getFriendshipsCountsByStatus = function () {
        var _this = this;
        var friendshipsCountsByStatus = {};
        ts_enum_util_1.$enum(Friendship_1.FRIENDSHIP_STATUS).forEach(function (status) {
            friendshipsCountsByStatus[status] = _this.getFriendshipsCountByStatus(status);
        });
        return friendshipsCountsByStatus;
    };
    FriendshipsGroupSummary.prototype.toJsonable = function () {
        return {
            friendshipsCount: this.getFriendshipsCount(),
            friendshipsCountsByStatus: this.getFriendshipsCountsByStatus()
        };
    };
    FriendshipsGroupSummary.prototype.toJson = function () {
        return JSON.stringify(this.toJsonable(), null, 2);
    };
    return FriendshipsGroupSummary;
}());
exports.FriendshipsGroupSummary = FriendshipsGroupSummary;
