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
var ethPriceEstimate = 1170.11;
exports.transactionFee = function (tx) { return __awaiter(_this, void 0, void 0, function () {
    var gasUsed, gasPrice, fee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gasUsed = tx.receipt.gasUsed;
                return [4, web3.eth.getTransaction(tx.tx)];
            case 1:
                gasPrice = (_a.sent()).gasPrice;
                gasPrice = gasPrice.minus(gasPrice).add(20000000000);
                fee = gasPrice.times(gasUsed);
                return [2, fee];
        }
    });
}); };
var logs = {};
exports.logTx = function (description) {
    var promises = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        promises[_i - 1] = arguments[_i];
    }
    return __awaiter(_this, void 0, void 0, function () {
        var fee, gas, latestTx, i, promise, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    fee = 0;
                    gas = 0;
                    i = 0;
                    _e.label = 1;
                case 1:
                    if (!(i < promises.length)) return [3, 5];
                    promise = promises[i];
                    return [4, promise];
                case 2:
                    latestTx = _e.sent();
                    _a = fee;
                    _b = parseFloat;
                    _d = (_c = web3).fromWei;
                    return [4, exports.transactionFee(latestTx)];
                case 3:
                    fee = _a + _b.apply(void 0, [_d.apply(_c, [_e.sent(), "ether"])]);
                    gas += latestTx.receipt.gasUsed;
                    _e.label = 4;
                case 4:
                    i++;
                    return [3, 1];
                case 5:
                    if (!logs[description]) {
                        logs[description] = [];
                    }
                    logs[description].push(fee);
                    return [2, latestTx];
            }
        });
    });
};
exports.printCosts = function () {
    var green = "\x1b[32m";
    var red = "\x1b[31m";
    var reset = "\x1b[0m";
    console.log("\nCost estimates:");
    for (var i = 0; i < logs.length; i++) {
        var description = logs[i];
        var min = Math.min.apply(Math, logs[description]);
        var max = Math.max.apply(Math, logs[description]);
        var min_usd = Number(min * ethPriceEstimate).toFixed(2);
        var max_usd = Number(max * ethPriceEstimate).toFixed(2);
        console.log(description + " used between " + green + min_usd + " USD" + reset + " and " + red + max_usd + " USD" + reset);
    }
    logs = {};
};
function assertEventsEqual(event, expected) {
    for (var key in expected) {
        if (expected.hasOwnProperty(key)) {
            if (key === "event") {
                (event.event).should.equal(expected.event);
            }
            else {
                var real = event.args[key];
                assert(key in event.args, "Expected event to contain parameter '" + key + "'");
                if (typeof real === "object") {
                    (event.args[key]).should.be.bignumber.equal(expected[key]);
                }
                else {
                    (event.args[key]).should.equal(expected[key]);
                }
            }
        }
    }
    return true;
}
exports.assertEventsEqual = assertEventsEqual;
exports.seconds = 1;
exports.minutes = exports.seconds * 60;
exports.hours = exports.minutes * 60;
exports.days = exports.hours * 24;
exports.sleep = function (s) { return new Promise(function (resolve) { return setTimeout(resolve, s * 1000); }); };
exports.range = function (n) { return Array.from(Array(n).keys()); };
exports.randomHash = function () { return web3.sha3((Math.random() * Number.MAX_SAFE_INTEGER).toString()); };
exports.randomBytes = function () { return web3.sha3((Math.random() * Number.MAX_SAFE_INTEGER).toString()); };
//# sourceMappingURL=test_utils.js.map