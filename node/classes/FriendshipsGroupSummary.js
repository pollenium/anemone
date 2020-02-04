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
var Friendship_1 = require("./Friendship");
var Summary_1 = require("./Summary");
var FriendshipsGroupSummary = (function (_super) {
    __extends(FriendshipsGroupSummary, _super);
    function FriendshipsGroupSummary(friendships) {
        var _a;
        var _this = _super.call(this) || this;
        _this.friendships = friendships;
        _this.statuses = [];
        (_a = _this.statuses).push.apply(_a, friendships.map(function (friendship) {
            return friendship.getStatus();
        }));
        return _this;
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
            friendshipsCountsByStatus: this.getFriendshipsCountsByStatus(),
        };
    };
    FriendshipsGroupSummary.prototype.toJson = function () {
        return JSON.stringify(this.toJsonable(), null, 2);
    };
    return FriendshipsGroupSummary;
}(Summary_1.Summary));
exports.FriendshipsGroupSummary = FriendshipsGroupSummary;
//# sourceMappingURL=FriendshipsGroupSummary.js.map