const EC = require('elliptic').ec
const ECDSA = new EC('secp256k1');
const KECCAK = require('keccak') 

const createKeccakHash = require('keccak')


var key = ec.genKeyPair();


var msg = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var signature = key.sign(msg);
 
// Export DER encoded signature in Array 
var derSign = signature.toDER();
 
// Verify signature 
console.log(key.verify(msg, derSign));
 
// CHECK WITH NO PRIVATE KEY 
 
// Public key as '04 + x + y' 
var pub = '04bb1fa3...';
 
// Signature MUST be either: 
// 1) hex-string of DER-encoded signature; or 
// 2) DER-encoded signature as buffer; or 
// 3) object with two hex-string properties (r and s) 
 
var signature = 'b102ac...'; // case 1 
var signature = new Buffer('...'); // case 2 
var signature = { r: 'b1fc...', s: '9c42...' }; // case 3 
 
// Import public key 
var key = ec.keyFromPublic(pub, 'hex');
 
// Verify signature 
console.log(key.verify(msg, signature));

buyOrderID = "";
sellOrderID = "";


contract('Consensus', function () {
  it('Able to submit a match', function () {

    const buyOrderID = createKeccakHash('keccak256').update('Buy').digest('hex')
    const sellOrderID = createKeccakHash('keccak256').update('Sell').digest('hex')
    const matchID = getMatchID(buyOrderID, sellOrderID);
    const key = ECDSA.genKeyPair();
    const msg = matchID
  });
});