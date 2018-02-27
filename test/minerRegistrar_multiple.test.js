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
contract("Miner Registar (multiple miners)", function () {
    afterEach("ensure miners are all deregistered", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].WaitForEpoch()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can retrieve a list of all miners", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 3:
                        (_a.sent())
                            .should.deep.equal([0]);
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[1], 1000)];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 5:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 6:
                        (_a.sent())
                            .should.deep.equal([0, 1]);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 7:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 8:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 9:
                        (_a.sent())
                            .should.deep.equal([1]);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[1])];
                    case 10:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 11:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 12:
                        (_a.sent())
                            .should.deep.equal([]);
                        return [4, steps_1["default"].WithdrawMinerBonds(accounts_1.accounts.slice(0, 2))];
                    case 13:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can manage several miners registering and deregistering", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[3], 1000)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 3:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 4:
                        (_a.sent())
                            .should.deep.equal([0, 3]);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[3])];
                    case 5:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 6:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 7:
                        (_a.sent())
                            .should.deep.equal([0]);
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[1], 1000)];
                    case 8:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[2], 1000)];
                    case 9:
                        _a.sent();
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[1])];
                    case 10:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 11:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 12:
                        (_a.sent())
                            .should.deep.equal([0, 2]);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[2])];
                    case 13:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 14:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 15:
                        (_a.sent())
                            .should.deep.equal([0]);
                        return [4, steps_1["default"].DeregisterMiner(accounts_1.accounts[0])];
                    case 16:
                        _a.sent();
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 17:
                        _a.sent();
                        return [4, steps_1["default"].GetRegisteredAccountIndexes()];
                    case 18:
                        (_a.sent())
                            .should.deep.equal([]);
                        return [4, steps_1["default"].WithdrawMinerBonds(accounts_1.accounts.slice(0, 4))];
                    case 19:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it("can get next miner count", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[0], 1000)];
                    case 1:
                        _a.sent();
                        return [4, steps_1["default"].RegisterMiner(accounts_1.accounts[1], 1000)];
                    case 2:
                        _a.sent();
                        return [4, steps_1["default"].GetCurrentMinerCount()];
                    case 3:
                        (_a.sent())
                            .should.be.bignumber.equal(0);
                        return [4, steps_1["default"].WaitForEpoch()];
                    case 4:
                        _a.sent();
                        return [4, steps_1["default"].GetCurrentMinerCount()];
                    case 5:
                        (_a.sent())
                            .should.be.bignumber.equal(2);
                        return [4, steps_1["default"].DeregisterMiners(accounts_1.accounts.slice(0, 2))];
                    case 6:
                        _a.sent();
                        return [4, steps_1["default"].WithdrawMinerBonds(accounts_1.accounts.slice(0, 2))];
                    case 7:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    after("log costs", function () {
        utils.printCosts();
    });
});
//# sourceMappingURL=minerRegistrar_multiple.test.js.map