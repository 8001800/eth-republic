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
exports.__esModule = true;
var chai = require("chai");
chai.use(require("chai-as-promised"));
chai.use(require("chai-bignumber")());
chai.should();
var utils = require("./_helpers/test_utils");
var accounts_1 = require("./_helpers/accounts");
var steps_1 = require("./_steps/steps");
contract("A miner", function () {
    afterEach("ensure miner is deregistered", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].WaitForEpoch()];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WithdrawMinerBond(accounts_1.accounts[0])];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can't deregister without first registering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])
                            .should.be.rejectedWith(Error)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can register and deregister", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can register again after deregistering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1100)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can access a bond of a republic ID", function () {
        return __awaiter(this, void 0, void 0, function () {
            var bond;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bond = 1111;
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], bond)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 3:
                        (_a.sent())
                            .should.be.bignumber.equal(bond);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("should only refund bond after epoch", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].WithdrawMinerBond(accounts_1.accounts[0])];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(1000);
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 6:
                        _a.sent();
                        return [4, steps_1["default"].WithdrawMinerBond(accounts_1.accounts[0])];
                    case 7:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 8:
                        (_a.sent())
                            .should.be.bignumber.equal(0);
                        return [2];
                }
            });
        });
    });
    it("can get their bond refunded", function () {
        return __awaiter(this, void 0, void 0, function () {
            var bond, balanceBefore, balanceMiddle, balanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bond = 1000;
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 1:
                        balanceBefore = (_a.sent());
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], bond)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 3:
                        balanceMiddle = (_a.sent());
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 5:
                        _a.sent();
                        return [4, steps_1["default"].WithdrawMinerBond(accounts_1.accounts[0])];
                    case 6:
                        _a.sent();
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 7:
                        balanceAfter = (_a.sent());
                        balanceAfter
                            .should.be.bignumber.equal(balanceBefore);
                        balanceAfter
                            .should.be.bignumber.equal(balanceMiddle.add(bond));
                        return [2];
                }
            });
        });
    });
    it("can't register twice before an epoch without deregistering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)
                                .should.be.rejectedWith(Error)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can register twice before an epoch after deregistering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0], 1000)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can't register twice without deregistering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)
                                .should.be.rejectedWith(Error)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can decrease their bond", function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceBefore, newBond;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 1:
                        balanceBefore = (_a.sent());
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 2:
                        _a.sent();
                        newBond = 100;
                        return [4, steps_1["default"].UpdateMinerBond(accounts_1.accounts[0], newBond)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(newBond);
                        return [4, steps_1["default"].WithdrawMinerBond(accounts_1.accounts[0])];
                    case 6:
                        _a.sent();
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 7:
                        (_a.sent())
                            .should.be.bignumber.equal(balanceBefore.minus(newBond));
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 8:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can increase their bond", function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceBefore, oldBond, newBond;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 1:
                        balanceBefore = (_a.sent());
                        oldBond = 1000;
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], oldBond)];
                    case 2:
                        _a.sent();
                        newBond = 1500;
                        return [4, steps_1["default"].ApproveRenToMinerRegistrar(accounts_1.accounts[0], newBond - oldBond)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].UpdateMinerBond(accounts_1.accounts[0], newBond)];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(newBond);
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 6:
                        (_a.sent())
                            .should.be.bignumber.equal(balanceBefore.minus(newBond));
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 7:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("updating their bond to their previous bond has no effect", function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceBefore, oldBond;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 1:
                        balanceBefore = (_a.sent());
                        oldBond = 1000;
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], oldBond)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].UpdateMinerBond(accounts_1.accounts[0], oldBond)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 4:
                        (_a.sent())
                            .should.be.bignumber.equal(oldBond);
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(balanceBefore.minus(oldBond));
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 6:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can't increase their bond without first approving ren", function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceBefore, oldBond, newBond, balanceAfter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 1:
                        balanceBefore = (_a.sent());
                        oldBond = 1000;
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], oldBond)];
                    case 2:
                        _a.sent();
                        newBond = 1500;
                        return [4, steps_1["default"].ApproveRenToMinerRegistrar(accounts_1.accounts[0], 0)];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].UpdateMinerBond(accounts_1.accounts[0], newBond)
                                .should.be.rejectedWith(Error)];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].GetMinerBond(accounts_1.accounts[0])];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(oldBond);
                        return [4, steps_1["default"].GetRenBalance(accounts_1.accounts[0])];
                    case 6:
                        balanceAfter = _a.sent();
                        balanceAfter.should.be.bignumber.equal(balanceBefore.minus(oldBond));
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 7:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can't deregister twice for the same registration", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])
                                .should.be.rejectedWith(Error)];
                    case 3:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can retrieve a miner's public key from its address", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetMinerPublicKey(accounts_1.accounts[0])];
                    case 1:
                        (_a.sent())
                            .should.equal(accounts_1.accounts[0].public);
                        return [2];
                }
            });
        });
    });
    it("can retrieve a miner's republic ID from its ethereum address", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].GetMinerID(accounts_1.accounts[0])];
                    case 1:
                        (_a.sent())
                            .should.equal(accounts_1.accounts[0].republic);
                        return [2];
                }
            });
        });
    });
    after("log costs", function () {
        utils.printCosts();
    });
});
//# sourceMappingURL=minerRegistrar_single.test.js.map