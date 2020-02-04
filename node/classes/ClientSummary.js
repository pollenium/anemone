"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Summary_1 = require("./Summary");
var ClientSummary = (function (_super) {
    __extends(ClientSummary, _super);
    function ClientSummary(struct) {
        var _this = _super.call(this) || this;
        _this.struct = struct;
        return _this;
    }
    ClientSummary.prototype.toJsonable = function () {
        return {
            idHex: this.struct.id.uu.toHex(),
            partySummary: this.struct.partySummary.toJsonable(),
        };
    };
    return ClientSummary;
}(Summary_1.Summary));
exports.ClientSummary = ClientSummary;
//# sourceMappingURL=ClientSummary.js.map