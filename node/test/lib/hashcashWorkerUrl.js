"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isBrowser_1 = require("./isBrowser");
exports.hashcashWorkerUrl = isBrowser_1.isBrowser
    ? './browser/hashcash-worker.js'
    : __dirname + "/../../../node/hashcash-worker.js";
//# sourceMappingURL=hashcashWorkerUrl.js.map