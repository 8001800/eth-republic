pragma solidity ^0.4.17;

contract Consensus {
    mapping (bytes32 => bytes32) public matches;
    mapping (bytes32 => address) public matchFinder;

    function submit(bytes32 buyOrderID, bytes32 sellOrderID, uint8 v, bytes32 r, bytes32 s) public returns (bool) {
      require(matches[buyOrderID] == 0x0);
      matches[buyOrderID] = sellOrderID;
      bytes32 matchID = keccak256(buyOrderID, sellOrderID);
      matchFinder[matchID] = ecrecover(matchID,v,r,s);
    }

    function matchID(bytes32 buyOrderID, bytes32 sellOrderID) public pure returns (bytes32) {
      return keccak256(buyOrderID, sellOrderID);
    }
    
}