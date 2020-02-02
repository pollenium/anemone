var OffersManager = /** @class */ (function () {
    function OffersManager() {
        this.offers = [];
    }
    OffersManager.prototype.pop = function () {
    };
    OffersManager.prototype.push = function (offer) {
        this.offers.push(offer);
    };
    return OffersManager;
}());
