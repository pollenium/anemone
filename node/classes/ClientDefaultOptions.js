"use strict";
exports.__esModule = true;
var ClientDefaultOptions = /** @class */ (function () {
    function ClientDefaultOptions() {
        this.signalingServerUrls = [];
        this.signalTimeout = 5;
        this.friendshipsMax = 6;
        this.missiveLatencyTolerance = 30;
        this.bootstrapOffersTimeout = 10;
    }
    return ClientDefaultOptions;
}());
exports.ClientDefaultOptions = ClientDefaultOptions;
