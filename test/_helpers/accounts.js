"use strict";
exports.__esModule = true;
var privateKeys = require("./privateKeys.json");
var secp256k1 = require("secp256k1");
var createKeccakHash = require("keccak");
var sha3 = function (msg) {
    return createKeccakHash("keccak256").update(msg).digest();
};
var accountToBuffer = function (account) {
    return Buffer.from(account.secretKey.data);
};
var privateToPublic = function (privateKey) {
    return "0x04" + secp256k1.publicKeyCreate(privateKey, false).slice(1).toString("hex");
};
var publicToAddress = function (publicKey) {
    var publicKeyBuf = Buffer.from(publicKey.slice(2), "hex");
    return "0x" + sha3(publicKeyBuf.slice(1)).slice(-20).toString("hex");
};
var publicToRepublic = function (publicKey) {
    var publicKeyBuf = Buffer.from(publicKey.slice(2), "hex");
    return "0x" + sha3(publicKeyBuf).slice(0, 20).toString("hex");
};
var ethaddrRegex = /[0-9A-Fa-f]{64}/g;
var getAccounts = function (accs) {
    var priv = Object.keys(accs).map(function (account) { return accountToBuffer(accs[account]); });
    var pubs = priv.map(function (key) { return privateToPublic(key); });
    var addresses = pubs.map(function (pub) { return publicToAddress(pub); });
    var repIds = pubs.map(function (pub) { return publicToRepublic(pub); });
    var _indexMap = {};
    var ret = [];
    for (var i = 0; i < priv.length; i++) {
        ret.push({
            private: priv[i],
            public: pubs[i],
            address: addresses[i],
            republic: repIds[i]
        });
        _indexMap[repIds[i]] = i;
    }
    return {
        accounts: ret,
        indexMap: _indexMap
    };
};
exports.accounts = (_a = getAccounts(privateKeys.addresses), _a.accounts), exports.indexMap = _a.indexMap;
var _a;
//# sourceMappingURL=accounts.js.map