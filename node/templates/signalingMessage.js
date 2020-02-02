"use strict";
// import Split from 'hendricks/lib/Split'
// import Dictionary from 'hendricks/lib/Dictionary'
// import Fixed from 'hendricks/lib/Fixed'
// import Dynamic from 'hendricks/lib/Dynamic'
exports.__esModule = true;
var Split = require('hendricks/lib/Split');
var Dictionary = require('hendricks/lib/Dictionary');
var Fixed = require('hendricks/lib/Fixed');
var Dynamic = require('hendricks/lib/Dynamic');
var fixed32 = new Fixed(32);
var dynamic2 = new Dynamic(2);
var SIGNALING_MESSAGE_KEY;
(function (SIGNALING_MESSAGE_KEY) {
    SIGNALING_MESSAGE_KEY["OFFER"] = "OFFER";
    SIGNALING_MESSAGE_KEY["ANSWER"] = "ANSWER";
    SIGNALING_MESSAGE_KEY["FLUSH"] = "FLUSH";
})(SIGNALING_MESSAGE_KEY = exports.SIGNALING_MESSAGE_KEY || (exports.SIGNALING_MESSAGE_KEY = {}));
exports.signalingMessageTemplate = new Split([
    SIGNALING_MESSAGE_KEY.OFFER,
    SIGNALING_MESSAGE_KEY.ANSWER,
    SIGNALING_MESSAGE_KEY.FLUSH
], [
    new Dictionary([
        'id',
        'clientId',
        'sdpb'
    ], [
        fixed32,
        fixed32,
        dynamic2,
    ]),
    new Dictionary([
        'clientId',
        'offerId',
        'sdpb'
    ], [
        fixed32,
        fixed32,
        dynamic2
    ]),
    new Dictionary([
        'offerId'
    ], [
        fixed32,
    ])
]);
