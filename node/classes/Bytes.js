"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("crypto"));
var bn_js_1 = __importDefault(require("bn.js"));
var Bytes = (function () {
    function Bytes(uint8Array) {
        this.uint8Array = uint8Array;
    }
    Bytes.prototype.getLength = function () {
        return this.uint8Array.length;
    };
    Bytes.prototype.equals = function (bytes) {
        if (this.uint8Array.length !== bytes.uint8Array.length) {
            return false;
        }
        for (var i = 0; i < this.uint8Array.length; i++) {
            if (this.uint8Array[i] !== bytes.uint8Array[i]) {
                return false;
            }
        }
        return true;
    };
    Bytes.prototype.slice = function (start, end) {
        return new Bytes(this.uint8Array.slice(start, end));
    };
    Bytes.prototype.getHash = function () {
        return Bytes.fromBuffer(crypto.createHash('sha256').update(this.uint8Array).digest());
    };
    Bytes.prototype.getHex = function () {
        return this.getBuffer().toString('hex');
    };
    Bytes.prototype.getPhex = function () {
        return "0x" + this.getHex();
    };
    Bytes.prototype.getUtf8 = function () {
        return this.getBuffer().toString('utf8');
    };
    Bytes.prototype.getBuffer = function () {
        return Buffer.from(this.uint8Array);
    };
    Bytes.prototype.getPaddedLeft = function (length) {
        if (this.getLength() > length) {
            throw new Error("Cannot pad, bytes.length (" + this.getLength() + ") > length (" + length + ")");
        }
        var uint8Array = (new Uint8Array(length)).fill(0);
        uint8Array.set(this.uint8Array, length - this.getLength());
        return new Bytes(uint8Array);
    };
    Bytes.prototype.prependByte = function (byte) {
        var uint8Array = new Uint8Array(this.uint8Array.length + 1);
        uint8Array[0] = byte;
        uint8Array.set(this.uint8Array, 1);
        return new Bytes(uint8Array);
    };
    Bytes.prototype.append = function (bytes) {
        var uint8Array = new Uint8Array(this.getLength() + bytes.getLength());
        uint8Array.set(this.uint8Array);
        uint8Array.set(bytes.uint8Array, this.getLength());
        return new Bytes(uint8Array);
    };
    Bytes.prototype.getBn = function () {
        return new bn_js_1.default(this.getHex(), 16);
    };
    Bytes.prototype.getNumber = function () {
        return this.getBn().toNumber();
    };
    Bytes.prototype.compare = function (bytes) {
        return this.getBuffer().compare(bytes.getBuffer());
    };
    Bytes.fromUtf8 = function (utf8) {
        return Bytes.fromBuffer(Buffer.from(utf8, 'utf8'));
    };
    Bytes.fromBuffer = function (buffer) {
        return new Bytes(new Uint8Array(buffer));
    };
    Bytes.fromHex = function (hex) {
        return Bytes.fromBuffer(Buffer.from(hex, 'hex'));
    };
    Bytes.fromBn = function (bn) {
        return Bytes.fromHex(bn.toString(16));
    };
    Bytes.fromNumber = function (number) {
        return Bytes.fromBn(new bn_js_1.default(number));
    };
    Bytes.random = function (length) {
        return Bytes.fromBuffer(crypto.randomBytes(length));
    };
    return Bytes;
}());
exports.Bytes = Bytes;
//# sourceMappingURL=Bytes.js.map