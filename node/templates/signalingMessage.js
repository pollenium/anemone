"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Split_1 = __importDefault(require("hendricks/lib/Split"));
var Dictionary_1 = __importDefault(require("hendricks/lib/Dictionary"));
var Fixed_1 = __importDefault(require("hendricks/lib/Fixed"));
var Dynamic_1 = __importDefault(require("hendricks/lib/Dynamic"));
var fixed32 = new Fixed_1.default(32);
var dynamic2 = new Dynamic_1.default(2);
var SIGNALING_MESSAGE_KEY;
(function (SIGNALING_MESSAGE_KEY) {
    SIGNALING_MESSAGE_KEY["OFFER"] = "OFFER";
    SIGNALING_MESSAGE_KEY["ANSWER"] = "ANSWER";
    SIGNALING_MESSAGE_KEY["FLUSH"] = "FLUSH";
})(SIGNALING_MESSAGE_KEY = exports.SIGNALING_MESSAGE_KEY || (exports.SIGNALING_MESSAGE_KEY = {}));
exports.signalingMessageTemplate = new Split_1.default([
    SIGNALING_MESSAGE_KEY.OFFER,
    SIGNALING_MESSAGE_KEY.ANSWER,
    SIGNALING_MESSAGE_KEY.FLUSH,
], [
    new Dictionary_1.default(['id', 'clientId', 'sdpb'], [fixed32, fixed32, dynamic2]),
    new Dictionary_1.default(['clientId', 'offerId', 'sdpb'], [fixed32, fixed32, dynamic2]),
    new Dictionary_1.default(['offerId'], [fixed32]),
]);
//# sourceMappingURL=signalingMessage.js.map