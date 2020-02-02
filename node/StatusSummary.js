"use strict";
exports.__esModule = true;
var Friendship_1 = require("./Friendship");
var StatiiTracker = /** @class */ (function () {
    function StatiiTracker() {
        var _a;
        this.counts = (_a = {},
            _a[Friendship_1.FRIENDSHIP_STATUS.CONNECTED] = 0,
            _a);
    }
    return StatiiTracker;
}());
exports.StatiiTracker = StatiiTracker;
