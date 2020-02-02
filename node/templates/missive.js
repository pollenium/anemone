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
var fixed1 = new Fixed(1);
var fixed5 = new Fixed(5);
var fixed32 = new Fixed(32);
var dynamic2 = new Dynamic(2);
var MISSIVE_KEY;
(function (MISSIVE_KEY) {
    MISSIVE_KEY["V0"] = "V0";
})(MISSIVE_KEY = exports.MISSIVE_KEY || (exports.MISSIVE_KEY = {}));
exports.missiveTemplate = new Split(['V0'], [
    new Dictionary([
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
