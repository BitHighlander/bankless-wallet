"use strict";
/*

    Bankless Wallet

    Send/Receive crypto

    Defaults to LUSD

*/
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
exports.__esModule = true;
var TAG = " | Bankless-Backend | ";
var queue = require('@pioneer-platform/redis-queue');
var uuid = require('short-uuid');
var log = require('@pioneer-platform/loggerdog')();
var wallet = require('../wallet');
var wait = require('wait-promise');
var sleep = wait.sleep;
//hdwallet-core
var core = require("@shapeshiftoss/hdwallet-core");
var SDK = require('@pioneer-sdk/sdk');
var hdwallet_native_1 = require("@shapeshiftoss/hdwallet-native");
//constants
var BLOCKCHAIN = 'cosmos';
var ASSET = 'ATOM';
var blockchains = [
    'ethereum'
];
var spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json';
var wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev';
var WALLET;
var APP;
module.exports = {
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, init()];
            });
        });
    },
    status: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_status()];
            });
        });
    },
    getBalance: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_balance()];
            });
        });
    },
    getAddress: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_address()];
            });
        });
    },
    sendToAddress: function (address, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, send_to_address(address, amount)];
            });
        });
    }
};
var start_software_wallet = function () {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic, keyring, nativeAdapter, wallet_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    mnemonic = process.env['WALLET_MAIN'];
                    if (!mnemonic)
                        throw Error("Unable to load wallet! missing env WALLET_MAIN");
                    keyring = new core.Keyring();
                    nativeAdapter = hdwallet_native_1.NativeAdapter.useKeyring(keyring);
                    return [4 /*yield*/, nativeAdapter.pairDevice("testid")];
                case 1:
                    wallet_1 = _a.sent();
                    //@ts-ignore
                    return [4 /*yield*/, nativeAdapter.initialize()];
                case 2:
                    //@ts-ignore
                    _a.sent();
                    // @ts-ignore
                    wallet_1.loadDevice({ mnemonic: mnemonic });
                    if (!wallet_1)
                        throw Error("failed to init wallet!");
                    return [2 /*return*/, wallet_1];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var init = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, queryKey, username, config, wallet_2, result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | init | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    queryKey = "sdk:pair-keepkey:test-123455513123";
                    username = "sdk:test-user-123455123123";
                    config = {
                        blockchains: blockchains,
                        username: username,
                        queryKey: queryKey,
                        spec: spec,
                        wss: wss,
                        paths: []
                    };
                    APP = new SDK.SDK(spec, config);
                    log.debug(tag, "APP: ", APP);
                    return [4 /*yield*/, start_software_wallet()];
                case 2:
                    wallet_2 = _a.sent();
                    log.debug(tag, "wallet: ", wallet_2);
                    return [4 /*yield*/, APP.init(wallet_2)];
                case 3:
                    result = _a.sent();
                    log.info(tag, "result: ", result);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error(tag, "e: ", e_2);
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_balance | ";
            try {
                //get_balance
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_status = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_status | ";
            try {
                //get_status
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_address = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_address | ";
            try {
                //
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var send_to_address = function (address, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, send, tx, invocationId, resultSign, payload, resultBroadcast, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | send_to_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    send = {
                        blockchain: BLOCKCHAIN,
                        asset: ASSET,
                        address: address,
                        amount: amount,
                        noBroadcast: true
                    };
                    tx = {
                        type: 'sendToAddress',
                        payload: send
                    };
                    console.log("tx: ", tx);
                    return [4 /*yield*/, APP.build(tx)];
                case 2:
                    invocationId = _a.sent();
                    log.info(tag, "invocationId: ", invocationId);
                    return [4 /*yield*/, APP.sign(invocationId)];
                case 3:
                    resultSign = _a.sent();
                    log.info(tag, "resultSign: ", resultSign);
                    payload = {
                        noBroadcast: false,
                        sync: true,
                        invocationId: invocationId
                    };
                    return [4 /*yield*/, APP.broadcast(payload)];
                case 4:
                    resultBroadcast = _a.sent();
                    log.info(tag, "resultBroadcast: ", resultBroadcast);
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    console.error(tag, "e: ", e_3);
                    throw e_3;
                case 6: return [2 /*return*/];
            }
        });
    });
};
