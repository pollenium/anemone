"use strict";
exports.__esModule = true;
var Friendship_1 = require("./Friendship");
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var ts_enum_util_1 = require("ts-enum-util");
var FriendshipsGroup = /** @class */ (function () {
    function FriendshipsGroup(options) {
        this.options = options;
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.destroyedSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.banSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.friendships = [];
    }
    FriendshipsGroup.prototype.addFriendship = function (friendship) {
        var _this = this;
        friendship.statusSnowdrop.addHandle(function (status) {
            _this.emitSummary();
        });
        friendship.banSnowdrop.addHandle(function (clientId) {
            _this.banSnowdrop.emit(clientId);
        });
        friendship.destroyedSnowdrop.addHandle(function () {
            _this.removeFriendship(friendship);
            _this.destroyedSnowdrop.emit();
            _this.emitSummary();
        });
        this.friendships.push(friendship);
        this.emitSummary();
    };
    FriendshipsGroup.prototype.getFriendshipsCount = function () {
        return this.friendships.length;
    };
    FriendshipsGroup.prototype.getHasAnUnconnectedFriendship = function () {
        for (var i = 0; i < this.friendships.length; i++) {
            if (this.friendships[i].getStatus() !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                return true;
            }
        }
        return false;
    };
    FriendshipsGroup.prototype.destroyAnUnconnectedFriendship = function (reason) {
        var friendship = this.friendships.find(function (friendship) {
            return friendship.getStatus() !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED;
        });
        if (!friendship) {
            throw new Error('No unconnected friendships');
        }
        friendship.destroy(reason);
    };
    FriendshipsGroup.prototype.getPeerClientIds = function () {
        return this.friendships.map(function (friendship) {
            return friendship.getPeerClientId();
        }).filter(function (peerClientId) {
            return peerClientId !== null;
        });
    };
    FriendshipsGroup.prototype.getFriendshipWithPeerClientId = function (peerClientId) {
        var friendship = this.friendships.find(function (friendship) {
            var _peerClientId = friendship.getPeerClientId();
            if (_peerClientId === null) {
                return false;
            }
            if (_peerClientId.uu.getIsEqual(peerClientId.uu)) {
                return true;
            }
            else {
                return false;
            }
        });
        if (friendship) {
            return friendship;
        }
        else {
            return null;
        }
    };
    FriendshipsGroup.prototype.getHasFriendshipWithPeerClientId = function (peerClientId) {
        return this.getFriendshipWithPeerClientId(peerClientId) ? true : false;
    };
    FriendshipsGroup.prototype.destroyFriendshipWithPeerClientId = function (peerClientId, destroyReason) {
        var friendship = this.getFriendshipWithPeerClientId(peerClientId);
        if (friendship) {
            friendship.destroy(destroyReason);
        }
        else {
            throw new Error('No friendship with that peer client id');
        }
    };
    FriendshipsGroup.prototype.removeFriendship = function (friendship) {
        var index = this.friendships.indexOf(friendship);
        if (index === -1) {
            throw new Error('Friendship is not in friendships array');
        }
        this.friendships.splice(index, 1);
    };
    FriendshipsGroup.prototype.emitSummary = function () {
        this.summarySnowdrop.emit(this.getSummary());
    };
    FriendshipsGroup.prototype.getSummary = function () {
        return new FriendshipsGroupSummary(this.friendships);
    };
    FriendshipsGroup.prototype.broadcastMissive = function (missive) {
        this.friendships.forEach(function (friendship) {
            if (friendship.getStatus() !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED) {
                return;
            }
            friendship.sendMissive(missive);
        });
    };
    return FriendshipsGroup;
}());
exports.FriendshipsGroup = FriendshipsGroup;
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
