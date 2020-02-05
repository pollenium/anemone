"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var recursive_readdir_1 = __importDefault(require("recursive-readdir"));
var fs_1 = __importDefault(require("fs"));
var md5_1 = __importDefault(require("md5"));
var tsPath = __dirname + "/../../ts";
var mainTsPath = tsPath + "/main.ts";
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var exportables, tsParts, newMainTs, newMd5, oldMainTs, oldMd5s, oldMd5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetchExportables()];
                case 1:
                    exportables = _a.sent();
                    tsParts = exportables.map(function (exportable) {
                        return exportable.getTs();
                    }).filter(function (tsPart) {
                        return tsPart !== null;
                    });
                    newMainTs = tsParts.join('\n\n') + "\n";
                    newMd5 = md5_1.default(newMainTs);
                    oldMainTs = fs_1.default.readFileSync(mainTsPath, 'utf8');
                    oldMd5s = getWords({ needle: '/* create-main-md5: ', haystack: oldMainTs });
                    oldMd5 = oldMd5s.length === 0 ? null : oldMd5s[0];
                    if (newMd5 !== oldMd5) {
                        console.log('main.ts updated');
                        fs_1.default.writeFileSync(mainTsPath, "/* create-main-md5: " + newMd5 + " */ \n\n" + newMainTs);
                    }
                    else {
                        console.log('main.ts unchanged');
                    }
                    return [2];
            }
        });
    });
}
function fetchAbsolutePaths() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    recursive_readdir_1.default(tsPath + "/src", function (error, filePaths) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(filePaths);
                    });
                })];
        });
    });
}
function fetchExportables() {
    return __awaiter(this, void 0, void 0, function () {
        var absolutePaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetchAbsolutePaths()];
                case 1:
                    absolutePaths = _a.sent();
                    return [2, absolutePaths.sort().map(function (absolutePath) {
                            return new Exportable(absolutePath);
                        })];
            }
        });
    });
}
var needleMeats = [
    'class',
    'const',
    'function',
    'interface',
    'abstract class',
    'enum',
];
var needles = needleMeats.map(function (meat) {
    return "export " + meat + " ";
});
var Exportable = (function () {
    function Exportable(absolutePath) {
        this.absolutePath = absolutePath;
    }
    Exportable.prototype.getRelativePath = function () {
        return "./" + this.absolutePath.split('/ts/')[1].replace('.ts', '');
    };
    Exportable.prototype.getTs = function () {
        var names = this.getNames();
        if (names.length === 0) {
            return null;
        }
        return "export { \n  " + names.join(',\n  ') + ",\n} from '" + this.getRelativePath() + "'";
    };
    Exportable.prototype.getFile = function () {
        return fs_1.default.readFileSync(this.absolutePath, 'utf8');
    };
    Exportable.prototype.getNames = function () {
        var file = this.getFile();
        var names = [];
        needles.forEach(function (needle) {
            var words = getWords({ needle: needle, haystack: file });
            names.push.apply(names, words);
        });
        return names;
    };
    return Exportable;
}());
function getWords(struct) {
    var needle = struct.needle, haystack = struct.haystack;
    var remaining = haystack;
    var words = [];
    while (true) {
        var index = remaining.indexOf(needle);
        if (index === -1) {
            break;
        }
        var indexPlusNeedle = index + needle.length;
        var word = getWordAtIndex({ haystack: remaining, index: indexPlusNeedle });
        remaining = remaining.substr(indexPlusNeedle);
        words.push(word);
    }
    return words;
}
var alphabet = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function getWordAtIndex(struct) {
    var haystack = struct.haystack, index = struct.index;
    var remaining = haystack.substr(index);
    var word = '';
    for (var i = 0; i < remaining.length; i++) {
        var char = remaining[i];
        if (alphabet.indexOf(char) === -1) {
            break;
        }
        word += char;
    }
    return word;
}
run();
//# sourceMappingURL=create-main.js.map