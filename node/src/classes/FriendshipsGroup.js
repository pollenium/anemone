"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pollenium_snowdrop_1 = require("pollenium-snowdrop");
var Friendship_1 = require("./Friendship");
var FriendshipsGroupSummary_1 = require("./FriendshipsGroupSummary");
var FriendshipsGroup = (function () {
    function FriendshipsGroup(struct) {
        this.struct = struct;
        this.summarySnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.destroyedSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.banSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.missiveSnowdrop = new pollenium_snowdrop_1.Snowdrop();
        this.friendships = [];
    }
    FriendshipsGroup.prototype.addFriendship = function (friendship) {
        var _this = this;
        friendship.statusSnowdrop.addHandle(function () {
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
        friendship.missiveSnowdrop.addHandle(function (missive) {
            _this.missiveSnowdrop.emit(missive);
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
        var friendship = this.friendships.find(function (_friendship) {
            return _friendship.getStatus() !== Friendship_1.FRIENDSHIP_STATUS.CONNECTED;
        });
        if (!friendship) {
            throw new Error('No unconnected friendships');
        }
        friendship.destroy(reason);
    };
    FriendshipsGroup.prototype.getPeerClientIds = function () {
        return this.friendships
            .map(function (friendship) {
            return friendship.getPeerClientId();
        })
            .filter(function (peerClientId) {
            return peerClientId !== null;
        });
    };
    FriendshipsGroup.prototype.getFriendshipWithPeerClientId = function (peerClientId) {
        var friendship = this.friendships.find(function (_friendship) {
            var _peerClientId = _friendship.getPeerClientId();
            if (_peerClientId === null) {
                return false;
            }
            if (_peerClientId.uu.getIsEqual(peerClientId.uu)) {
                return true;
            }
            return false;
        });
        if (friendship) {
            return friendship;
        }
        return null;
    };
    FriendshipsGroup.prototype.getHasFriendshipWithPeerClientId = function (peerClientId) {
        return !!this.getFriendshipWithPeerClientId(peerClientId);
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
        return new FriendshipsGroupSummary_1.FriendshipsGroupSummary(this.friendships);
    };
    FriendshipsGroup.prototype.broadcastMissive = function (missive) {
        this.friendships.forEach(function (friendship) {
            friendship.maybeSendMissive(missive);
        });
    };
    return FriendshipsGroup;
}());
exports.FriendshipsGroup = FriendshipsGroup;
//# sourceMappingURL=FriendshipsGroup.js.map