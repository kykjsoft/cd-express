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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var promises_1 = require("fs/promises");
var json5_1 = __importDefault(require("json5"));
function importModel(p) {
    return Promise.resolve().then(function () { return __importStar(require(p)); }).then(function (m) {
        if (typeof m == "object" && m.hasOwnProperty("default")) {
            return m.default;
        }
        return m;
    });
}
/**
 * 从文件中获取JSON
 * @param filename 文件名
 * @returns
 */
function getJSONFile(filename) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promises_1.readFile(filename, "utf-8").then(function (d) { return json5_1.default.parse(d); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getJSONFile = getJSONFile;
/**
 * 根据工作目录中获取或生成配置
 * @param cwd
 * @returns
 */
function getConfig(cwd, filename) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (filename) {
                return [2 /*return*/, getJSONFile(path_1.join(cwd, filename))];
            }
            return [2 /*return*/, getJSONFile(path_1.join(cwd, "cd-express.json"))
                    .catch(function () {
                    return importModel(path_1.join(cwd, "cd-express.js"))
                        .then(function (fn) {
                        return fn();
                    });
                })
                    .catch(function (ex) {
                    return getDefaultOption();
                })
                    .then(function (config) { return mergetConfig(getDefaultOption(), config); })];
        });
    });
}
exports.getConfig = getConfig;
function getConfigFileNameFromDir(cwd) {
    return promises_1.access(path_1.join(cwd, "cd-express.js"))
        .then(function () { return "cd-express.js"; })
        .catch(function () {
        return promises_1.access(path_1.join(cwd, "cd-express.json"))
            .then(function () { return "cd-express.json"; })
            .catch(function () { return null; });
    });
}
exports.getConfigFileNameFromDir = getConfigFileNameFromDir;
function mergetConfig(config1, config2) {
    if (config1 === void 0) { config1 = { static: { "/": ["/"] } }; }
    if (config2 === void 0) { config2 = { static: { "/": ["/"] } }; }
    if (typeof config2.port === "string" || typeof config2.port === "number") {
        config1.port = config2.port;
    }
    if (config2.socket) {
        config1.socket = config2.socket;
    }
    if (config2.static) {
        config1.static = config1.static || {};
        for (var a in config2.static) {
            if (config2.static[a]) {
                config1.static[a] = config1.static[a] || [];
                for (var i in config2.static[a]) {
                    if (config1.static[a].includes(config2.static[a][i])) {
                        continue;
                    }
                    config1.static[a].push(config2.static[a][i]);
                }
            }
        }
    }
    if (config2.router) {
        config1.router = config1.router || {};
        for (var a in config2.router) {
            if (config2.router[a]) {
                config1.router[a] = config1.router[a] || [];
                for (var i in config2.router[a]) {
                    if (config1.router[a].includes(config2.router[a][i])) {
                        continue;
                    }
                    config1.router[a].push(config2.router[a][i]);
                }
            }
        }
    }
    if (config2.socket) {
        config1.socket = config2.socket;
    }
    if (config2.proxy) {
        config1.proxy = config2.proxy;
    }
    return config1;
}
exports.mergetConfig = mergetConfig;
/**
 * 获取默认配置
 * @returns 默认配置
 */
function getDefaultOption() {
    return {
        "port": 3000,
        "static": {
            "/": ["./"]
        },
        "socket": ""
    };
}
exports.getDefaultOption = getDefaultOption;
function init(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var has, config, defaultconfig, configfile, text, filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getConfigFileNameFromDir(cwd)];
                case 1:
                    has = _a.sent();
                    if (has) {
                        return [2 /*return*/, "已存在配置文件 " + path_1.join(cwd, has)];
                    }
                    return [4 /*yield*/, createConfigByDir(cwd)];
                case 2:
                    config = _a.sent();
                    defaultconfig = getDefaultOption();
                    config = mergetConfig(defaultconfig, config);
                    configfile = config;
                    configfile["$schema"] = "https://configure-driver.github.io/cd-express/schemas/cd-express.json";
                    text = JSON.stringify(configfile, null, 4);
                    text = "//doc: https://configure-driver.github.io/cd-express/\n" + text;
                    filename = path_1.join(cwd, "cd-express.json");
                    return [4 /*yield*/, promises_1.writeFile(filename, text)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, "\u5DF2\u751F\u6210\u914D\u7F6E\u6587\u4EF6 " + filename];
            }
        });
    });
}
exports.init = init;
/**
 * 根据工作目录生成配置
 * @param cwd 工作目录
 * @returns
 */
function createConfigByDir(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var rev;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!cwd) {
                        throw new Error("必须传入目录地址");
                    }
                    rev = {
                        static: {
                            "/": []
                        }
                    };
                    return [4 /*yield*/, Promise.all([
                            promises_1.access(path_1.join(cwd, "public"))
                                .then(function () { return rev.static["/"].push("./public"); })
                                .catch(function (ex) { return null; }),
                            promises_1.access(path_1.join(cwd, "docs"))
                                .then(function () { return rev.static["/"].push("./docs"); })
                                .catch(function (ex) { return null; }),
                            promises_1.access(path_1.join(cwd, "router")).then(function () {
                                var router = path_1.join(cwd, "router");
                                return promises_1.readdir(router).then(function (list) {
                                    rev.router = rev.router || {};
                                    rev.router["/"] = rev.router["/"] || [];
                                    for (var a in list) {
                                        if (path_1.extname(list[a]) === ".js") {
                                            rev.router["/"].push("./router/" + list[a]);
                                        }
                                    }
                                    return rev;
                                });
                            })
                                .catch(function (ex) { return null; })
                        ])];
                case 1:
                    _a.sent();
                    if (!rev.static || Object.keys(rev.static).length == 0) {
                        rev.static = rev.static || {};
                        rev.static["/"] = ["./"];
                    }
                    return [2 /*return*/, rev];
            }
        });
    });
}
