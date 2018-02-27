"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
exports.__esModule = true;
var accounts_1 = require("../_helpers/accounts");
var config = require("../../republic-config");
var steps_1 = require("./steps");
var utils = require("../_helpers/test_utils");
var darkNodeRegistrar, ren;
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, artifacts.require("RepublicToken").deployed()];
            case 1:
                ren = _a.sent();
                return [4, artifacts.require("DarkNodeRegistrar").deployed()];
            case 2:
                darkNodeRegistrar = _a.sent();
                return [2];
        }
    });
}); })();
module.exports = {
    WaitForEpoch: function () { return __awaiter(_this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3, 3];
                    return [4, utils.logTx("Checking epoch", darkNodeRegistrar.epoch())];
                case 1:
                    tx = _a.sent();
                    if (tx.logs.length > 0 && tx.logs[tx.logs.length - 1].event === "NextEpoch") {
                        return [2];
                    }
                    return [4, utils.sleep(config.epochInterval * 0.1)];
                case 2:
                    _a.sent();
                    return [3, 0];
                case 3: return [2];
            }
        });
    }); },
    GetEpochBlockhash: function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getCurrentEpoch.call()];
                case 1: return [2, (_a.sent()).blockhash];
            }
        });
    }); },
    GetCurrentDarkNodeCount: function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getNumberOfDarkNodes.call()];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetRegisteredDarkNodes: function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var count, split, indexes, starts, ends, darkNodes, l1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, steps_1["default"].GetCurrentDarkNodeCount()];
                case 1:
                    count = _a.sent();
                    split = 50;
                    indexes = utils.range(Math.floor(count / split) + 1);
                    starts = indexes.map(function (index) { return index * split; });
                    ends = indexes.map(function (index) { return Math.min((index + 1) * split, count); });
                    darkNodes = [];
                    return [4, indexes
                            .map(function (i) { return darkNodeRegistrar.getCurrentDarkNodes(starts[i], ends[i]); })
                            .reduce(function (acc, curr) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4, acc];
                                    case 1:
                                        _b = (_a = (_c.sent())).concat;
                                        return [4, curr];
                                    case 2: return [2, _b.apply(_a, [_c.sent()])];
                                }
                            });
                        }); }, Array(0))];
                case 2:
                    l1 = _a.sent();
                    return [2, l1];
            }
        });
    }); },
    GetRegisteredAccountIndexes: function () { return __awaiter(_this, void 0, void 0, function () {
        var darkNodes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, steps_1["default"].GetRegisteredDarkNodes()];
                case 1:
                    darkNodes = _a.sent();
                    return [2, darkNodes.map(function (darkNode) { return accounts_1.indexMap[darkNode]; })];
            }
        });
    }); },
    RegisterDarkNode: function (account, bond) { return __awaiter(_this, void 0, void 0, function () {
        var difference, _a, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    assert(bond > 0, "Registration bond must be positive");
                    _a = bond;
                    return [4, darkNodeRegistrar.getBondPendingWithdrawal(account.republic)];
                case 1:
                    difference = _a - (_b.sent());
                    if (!difference) return [3, 3];
                    return [4, ren.approve(darkNodeRegistrar.address, difference, { from: account.address })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4, utils.logTx("Registering", darkNodeRegistrar.register(account.public, account.public, { from: account.address }))];
                case 4:
                    tx = _b.sent();
                    return [2];
            }
        });
    }); },
    DeregisterDarkNode: function (account) { return __awaiter(_this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, utils.logTx("Deregistering", darkNodeRegistrar.deregister(account.republic, { from: account.address }))];
                case 1:
                    tx = _a.sent();
                    return [2];
            }
        });
    }); },
    GetDarkNodeBond: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getBond.call(account.republic)];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetDarkNodeID: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getDarkNodeID.call(account.address)];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetDarkNodeSeed: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getSeed.call(account.republic)];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetAllDarkNodes: function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, darkNodeList, deregisteredCount, toDeregisterCount, stayingRegisteredCount, toRegisterCount, deregisteredOffset, toDeregisterOffset, registeredOffset, toRegisterOffset, end;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, darkNodeRegistrar.getAllDarkNodes.call()];
                case 1:
                    _a = _b.sent(), darkNodeList = _a[0], deregisteredCount = _a[1], toDeregisterCount = _a[2], stayingRegisteredCount = _a[3], toRegisterCount = _a[4];
                    deregisteredOffset = 1;
                    toDeregisterOffset = deregisteredOffset + deregisteredCount.toNumber();
                    registeredOffset = toDeregisterOffset + toDeregisterCount.toNumber();
                    toRegisterOffset = registeredOffset + stayingRegisteredCount.toNumber();
                    end = toRegisterOffset + toRegisterCount.toNumber();
                    console.log("slice(" + deregisteredOffset + ", " + toDeregisterOffset);
                    return [2, {
                            deregistered: darkNodeList.slice(deregisteredOffset, toDeregisterOffset),
                            toDeregister: darkNodeList.slice(toDeregisterOffset, registeredOffset),
                            registered: darkNodeList.slice(registeredOffset, toRegisterOffset),
                            toRegister: darkNodeList.slice(toRegisterOffset, end)
                        }];
            }
        });
    }); },
    GetMNetworkSize: function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getMNetworkSize.call()];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetRenBalance: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ren.balanceOf(account.address, { from: account.address })];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    ApproveRenToDarkNodeRegistrar: function (account, amount) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ren.approve(darkNodeRegistrar.address, amount, { from: account.address })];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    UpdateDarkNodeBond: function (account, newBond) { return __awaiter(_this, void 0, void 0, function () {
        var tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, utils.logTx("Updating bond", darkNodeRegistrar.updateBond(account.republic, newBond, { from: account.address }))];
                case 1:
                    tx = _a.sent();
                    return [2];
            }
        });
    }); },
    WithdrawDarkNodeBond: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, utils.logTx("Releasing bond", darkNodeRegistrar.withdrawBond(account.republic, { from: account.address }))];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    GetDarkNodePublicKey: function (account) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, darkNodeRegistrar.getPublicKey(account.republic)];
                case 1: return [2, _a.sent()];
            }
        });
    }); },
    WithdrawDarkNodeBonds: function (_accounts) { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < _accounts.length)) return [3, 4];
                    return [4, steps_1["default"].WithdrawDarkNodeBond(_accounts[i])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); },
    RegisterDarkNodes: function (_accounts, bond) { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < _accounts.length)) return [3, 4];
                    return [4, steps_1["default"].RegisterDarkNode(_accounts[i], bond)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); },
    DeregisterDarkNodes: function (_accounts) { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < _accounts.length)) return [3, 4];
                    return [4, steps_1["default"].DeregisterDarkNode(_accounts[i])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); },
    GetMNetworks: function () { return __awaiter(_this, void 0, void 0, function () {
        var darkNodes, epochHash, norms, i, darkNode, seed, a, N, p, mNetworks, i, i, mIndex, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, steps_1["default"].GetRegisteredDarkNodes()];
                case 1:
                    darkNodes = _a.sent();
                    return [4, steps_1["default"].GetEpochBlockhash()];
                case 2:
                    epochHash = _a.sent();
                    norms = {};
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < darkNodes.length)) return [3, 6];
                    darkNode = darkNodes[i];
                    return [4, steps_1["default"].GetDarkNodeSeed({ republic: darkNode })];
                case 4:
                    seed = _a.sent();
                    norms[darkNode] = web3.sha3(seed + epochHash);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3, 3];
                case 6:
                    darkNodes.sort(function (m_a, m_b) { return norms[m_a] - norms[m_b]; });
                    return [4, steps_1["default"].GetCurrentDarkNodeCount()];
                case 7:
                    a = _a.sent();
                    return [4, darkNodeRegistrar.getMNetworkSize()];
                case 8:
                    N = _a.sent();
                    p = Math.ceil(a / N);
                    mNetworks = [];
                    for (i = 0; i < p; i++) {
                        mNetworks.push([]);
                    }
                    for (i = 0; i < a; i++) {
                        mIndex = i % p;
                        account = accounts_1.accounts[accounts_1.indexMap[darkNodes[i]]];
                        mNetworks[mIndex].push(account);
                    }
                    return [2, mNetworks];
            }
        });
    }); }
};
//# sourceMappingURL=darkNodeRegistrar.js.map