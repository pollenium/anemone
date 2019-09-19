"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Split_1 = __importDefault(require("hendricks/lib/Split"));
var Dictionary_1 = __importDefault(require("hendricks/lib/Dictionary"));
var Fixed_1 = __importDefault(require("hendricks/lib/Fixed"));
var Dynamic_1 = __importDefault(require("hendricks/lib/Dynamic"));
var fixed1 = new Fixed_1.default(1);
var fixed5 = new Fixed_1.default(5);
var fixed32 = new Fixed_1.default(32);
var dynamic2 = new Dynamic_1.default(2);
var FRIEND_MESSAGE_KEY;
(function (FRIEND_MESSAGE_KEY) {
    FRIEND_MESSAGE_KEY["V0"] = "V0";
})(FRIEND_MESSAGE_KEY = exports.FRIEND_MESSAGE_KEY || (exports.FRIEND_MESSAGE_KEY = {}));
exports.friendMessageTemplate = new Split_1.default(['V0'], [
    new Dictionary_1.default([
        'timestamp',
        'difficulty',
        'applicationId',
        'applicationData',
        'nonce'
    ], [
        fixed5,
        fixed1,
        fixed32,
        dynamic2,
        fixed32
    ])
]);
//# sourceMappingURL=friendMessage.js.map