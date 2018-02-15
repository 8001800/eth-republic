pragma solidity ^0.4.17;

import './Utils.sol';
import "./RepublicToken.sol";

/**
 * Active WIP
 * TODOS:
 * 1. Break up into smaller contracts, e.g.:
 *    a. Epoch contract
 *    b. DarkNode list?
 *    c. DarkNode properties shared with traders? (e.g. public key storage)
 * 2. Remove Debug events
 */
contract DarkNodeRegistrar {

  /** Contracts */

  // TODO: Use SafeMath library?
  RepublicToken ren;

  /** Data */

  struct DarkNode {
    bytes publicKey;
    address owner;
    uint256 bond;
    bytes32 seed;
    uint256 index;

    uint256 bondPendingWithdrawal;
    uint256 bondWithdrawalTime;
  }

  struct Epoch {
    uint256 time;
    bytes32 blockhash;
  }

  Epoch currentEpoch;

  // CONFIGURATION
  uint256 epochInterval;
  uint256 minimumBond;

  // Map from Republic IDs to DarkNode structs
  mapping(bytes20 => DarkNode) private DarkNodes;

  // Map from ethereum public addresses to DarkNode IDs
  mapping(address => bytes20) private addressIDs;

  // Layout:
  // [0, deregistered..., toDeregister..., registered..., toRegister...]
  // Since an index of 0 could be either uninitialized or 0, the first element is reserved
  bytes20[] DarkNodeList;

  uint256 deregisteredCount;
  uint256 toDeregisterCount;
  uint256 toRegisterCount;
  uint256 stayingRegisteredCount;

  /** Events */

  event DarkNodeRegistered(bytes20 DarkNodeID, uint256 bond);
  event DarkNodeBondUpdated(bytes20 DarkNodeID, uint256 newBond);
  event DarkNodeDeregistered(bytes20 DarkNodeID);
  event BondRefunded(bytes20 DarkNodeID, uint256 amount);
  event Debug(string message);
  event DebugInt(uint256 num);
  event NextEpoch();
  
  /** Private functions */

  function toRegisterOffset() view private returns (uint256) {
    return stayingRegisteredOffset() + stayingRegisteredCount;
  }

  function toDeregisterOffset() view private returns (uint256) {
    return deregisteredCount + 1;
  }

  function stayingRegisteredOffset() view private returns (uint256) {
    return toDeregisterOffset() + toDeregisterCount;
  }

  function isStayingRegistered(bytes20 _DarkNodeID) private view returns (bool) {
    uint256 index = DarkNodes[_DarkNodeID].index;
    return index >= stayingRegisteredOffset() && index < toRegisterOffset();
  }

  function canRegister(bytes20 _DarkNodeID) private view returns (bool) {
    // TODO: Can register if in toDeregister
    return !isRegistered(_DarkNodeID) && !isPendingRegistration(_DarkNodeID);
  }

  function canDeregister(bytes20 _DarkNodeID) private view returns (bool) {
    return isStayingRegistered(_DarkNodeID) || isPendingRegistration(_DarkNodeID);
  }

  /**
   * @notice A private function that updates a DarkNode's bond that is pending
   * withdrawal.
   *
   * @param _DarkNodeID The ID of the DarkNode that is being updated.
   * @param _amount The bond update amount.
   */
  function updateBondWithdrawal(bytes20 _DarkNodeID, uint256 _amount) private {

    DarkNodes[_DarkNodeID].bond -= _amount;

    if (DarkNodes[_DarkNodeID].bondPendingWithdrawal > 0 && DarkNodes[_DarkNodeID].bondWithdrawalTime < currentEpoch.time) {
      // Can withdraw previous bond
      uint256 toWithdraw = DarkNodes[_DarkNodeID].bondPendingWithdrawal;

      // Store new amount and time
      DarkNodes[_DarkNodeID].bondPendingWithdrawal = _amount;
      DarkNodes[_DarkNodeID].bondWithdrawalTime = now;

      // Transfer Ren (ERC20 token)
      // TODO: Should this be moved to withdrawBond?
      bool success = ren.transfer(msg.sender, toWithdraw);
      require(success);

      BondRefunded(_DarkNodeID, toWithdraw);
    } else {
      // Can't withdraw any bond
      DarkNodes[_DarkNodeID].bondPendingWithdrawal += _amount;
      DarkNodes[_DarkNodeID].bondWithdrawalTime = now;
    }
  }

  /** Public functions */

  /** 
   * @notice The DarkNodeRegistrar constructor.
   *
   * @param _renAddress The address of the Republic Token contract.
   * @param _epochInterval The amount of time between epochs, in seconds.
   * @param _minimumBond The minimum bond amount that can be submitted by a
   *                     trader.
   */
  function DarkNodeRegistrar(address _renAddress, uint256 _epochInterval, uint256 _minimumBond) public {
    ren = RepublicToken(_renAddress);
    epochInterval = _epochInterval;
    minimumBond = _minimumBond;
    DarkNodeList.push(0x0);
    checkEpoch();
  }

  function isRegistered(bytes20 _DarkNodeID) public view returns (bool) {
    uint256 index = DarkNodes[_DarkNodeID].index;
    return index >= toDeregisterOffset() && index < toRegisterOffset();
  }

  function isPendingRegistration(bytes20 _DarkNodeID) public view returns (bool) {
    uint256 index = DarkNodes[_DarkNodeID].index;
    return index >= toRegisterOffset() && index < (toRegisterOffset() + toRegisterCount);
  }
  
  /**
   * @notice Check if the epoch needs to be updated, and update it if
   * necessary.
   *
   * @return True if the epoch was updated, otherwise false.
   */
  function checkEpoch() public returns (bool) {
    // NOTE: Requires `epochInterval` < `now`
    if (now > currentEpoch.time + epochInterval) {
      currentEpoch = Epoch({
        time: now,
        blockhash: block.blockhash(block.number - 1)
      });

      // TODO: Would zeroing deregistered DarkNodes return gas?
      for (uint256 i = deregisteredCount; i < deregisteredCount + toDeregisterCount; i++) {
        delete DarkNodeList[i];
      }

      // Update counts
      deregisteredCount += toDeregisterCount;
      stayingRegisteredCount += toRegisterCount;
      toRegisterCount = 0;
      toDeregisterCount = 0;

      NextEpoch();

      return true;
    }
  
    return false;
  }

  /** 
   * @notice Register a DarkNode and transfer the bond to this contract. The
   * caller must provide the public key of the DarkNode that will be registered
   * and a signature that proves the caller has access to the associated
   * private key. The bond must be provided in REN, as an allowance. The entire
   * allowance is transferred and used as the bond.
   *
   * @param _publicKey The public key of the DarkNode. It is stored to allow other
   *                   DarkNodes and traders to encrypt messages to the DarkNode.
   * @param _signature The Republic ID, generated from the public key and signed
   *                   by the associated private key. It is used as a proof that
   *                   the DarkNode owns the submitted public key.
   */
  function register(bytes _publicKey, bytes _signature) payable public {

    // an outside entity will be calling this after each epochInterval has passed
    // if that has not happened yet, the next DarkNode to register will trigger the update instead
    // checkEpoch(); // <1k gas if no update needed, >40k gas if update needed

    address DarkNodeAddress = Utils.ethereumAddressFromPublicKey(_publicKey);
    bytes20 DarkNodeID = Utils.republicIDFromPublicKey(_publicKey);

    // TODO: Check a signature instead
    // Verify that the DarkNode has provided the correct public key
    require(msg.sender == DarkNodeAddress);

    // DarkNode should not be already registered or awaiting registration
    require(canRegister(DarkNodeID));

    // Set bond to be allowance plus any remaining bond from previous registration
    uint256 allowance = ren.allowance(msg.sender, this);
    // TODO: Use safe maths
    uint256 bond = allowance + DarkNodes[DarkNodeID].bondPendingWithdrawal;

    // Bond should be greater than minumum
    require (bond > minimumBond);

    // Transfer Ren (ERC20 token)
    bool success = ren.transferFrom(msg.sender, this, allowance);
    require(success);

    // Store public key and bond
    uint256 index = DarkNodeList.push(DarkNodeID) - 1;

    toRegisterCount += 1;

    bytes32 seed = keccak256(now, block.blockhash(block.number - 1), DarkNodeID);

    DarkNode memory darkNode = DarkNode({
      publicKey: _publicKey,
      owner: msg.sender,
      bond: bond,
      seed: seed,
      index: index,
      bondPendingWithdrawal: 0,
      bondWithdrawalTime: 0
    });

    DarkNodes[DarkNodeID] = darkNode;

    addressIDs[DarkNodeAddress] = DarkNodeID;

    // Emit event to logs
    DarkNodeRegistered(DarkNodeID, bond);
  }

  /**
   * @notice Increase bond or decrease a DarkNodes's bond
   *
   * @param _DarkNodeID The Republic ID of the DarkNode
   * @param _newBond The new bond to be set for the DarkNode, greater than or less than the current bond
   */
  function updateBond(bytes20 _DarkNodeID, uint256 _newBond) payable public {
    // Ensure DarkNode is already registered
    require(isPendingRegistration(_DarkNodeID) || isStayingRegistered(_DarkNodeID));
    
    // Only allow owner to modify bond
    address owner = Utils.ethereumAddressFromPublicKey(DarkNodes[_DarkNodeID].publicKey);
    require(owner == msg.sender);

    // Set new bond
    require(_newBond > 0);
    uint256 oldBond = DarkNodes[_DarkNodeID].bond;
    if (_newBond == oldBond) {
      return;
    }

    if (_newBond > oldBond) {
      // Increasing bond

      uint256 toAdd = _newBond - oldBond;

      // Sanity checks
      assert(toAdd < _newBond);
      assert(toAdd > 0);

      // Transfer Ren (ERC20 token)
      require(ren.allowance(msg.sender, this) >= toAdd);
      bool success = ren.transferFrom(msg.sender, this, toAdd);
      require(success);

      DarkNodes[_DarkNodeID].bond = _newBond;


    } else if (_newBond < oldBond) {
      // Decreasing bond

      uint256 toRefund = oldBond - _newBond;

      // Sanity check
      assert(toRefund < oldBond);

      updateBondWithdrawal(_DarkNodeID, toRefund);
    }

    // Emit event to logs
    DarkNodeBondUpdated(_DarkNodeID, _newBond);
  }

  /** 
  * @notice Deregister a DarkNode and refund their bond.
  *
  * @param _DarkNodeID The Republic ID of the DarkNode.
  */
  function deregister(bytes20 _DarkNodeID) public {

    // Check that they can deregister
    require(canDeregister(_DarkNodeID));

    // Check that the msg.sender owns the DarkNode
    require(DarkNodes[_DarkNodeID].owner == msg.sender);

    // Swap DarkNodes around
    uint256 destinationIndex;
    uint256 currentIndex = DarkNodes[_DarkNodeID].index;

    bool decreaseLength = false;

    // TODO: If DarkNode is in toRegister, put at end of toRegister and delete, instead
    if (isPendingRegistration(_DarkNodeID)) {
      // still in toRegister

      // last in toRegister
      destinationIndex = toRegisterOffset() + toRegisterCount - 1;

      // Update count
      toRegisterCount -= 1;

      decreaseLength = true;

    } else {

      // already registered, so swap into toDeregister

      // first in registered
      destinationIndex = stayingRegisteredOffset();

      // Update count
      stayingRegisteredCount -= 1;
      toDeregisterCount += 1;
    }

    // Swap two DarkNodes in DarkNodeList
    DarkNodeList[currentIndex] = DarkNodeList[destinationIndex];
    DarkNodeList[destinationIndex] = _DarkNodeID;
    // Update their indexes
    DarkNodes[DarkNodeList[currentIndex]].index = currentIndex;
    DarkNodes[DarkNodeList[destinationIndex]].index = destinationIndex;

    if (decreaseLength) {
      delete DarkNodeList[destinationIndex]; // Never registered, so safe to delete
      DarkNodeList.length = DarkNodeList.length - 1;
    }

    updateBondWithdrawal(_DarkNodeID, DarkNodes[_DarkNodeID].bond);

    // Emit event to logs
    DarkNodeDeregistered(_DarkNodeID);
  }

  /**
  * @notice Withdraw the bond of a DarkNode. This is the latter of two functions a
  * DarkNode must call to retrieve their bond. The first call is to decrease their
  * bond or deregister. This stages an amount of bond to be withdrawn. This 
  * function then allows them to actually make the withdrawal.
  *
  * @param _DarkNodeID The Republic ID of the DarkNode.
  */
  function withdrawBond(bytes20 _DarkNodeID) public {
    updateBondWithdrawal(_DarkNodeID, 0);
  }






  /*** General getters ***/

  function getEpochBlockhash() public view returns (bytes32) {
    return currentEpoch.blockhash;
  }

  function getCurrentDarkNodes() public view returns (bytes20[]) {

    var registeredStart = toDeregisterOffset();
    var registeredEnd = registeredStart + toDeregisterCount + stayingRegisteredCount;

    bytes20[] memory currentDarkNodes = new bytes20[](toDeregisterCount + stayingRegisteredCount);

    for (uint256 i = 0; i < registeredEnd - registeredStart; i++) {
      currentDarkNodes[i] = DarkNodeList[i + registeredStart];
    }
    return currentDarkNodes;
  }

  // TODO: Used for debugging only?, remove before mainnet
  function getAllDarkNodes() public view returns (bytes20[]) {
    // Note: Returns 0x0 at starting position
    return DarkNodeList;
  }

  function getMNetworkCount() public view returns (uint256) {
    // TODO: Should be rounded up?
    return (toDeregisterCount + stayingRegisteredCount) / getMNetworkSize();
  }
  
  function getMNetworkSize() public view returns (uint256) {
    uint256 log = Utils.logtwo(toDeregisterCount + stayingRegisteredCount);
    
    // If odd, add 1 to become even
    return log + (log % 2);
  }

  function getCurrentDarkNodeCount() public view returns (uint256) {
    return (toDeregisterCount + stayingRegisteredCount);
  }

  function getNextDarkNodeCount() public view returns (uint256) {
    return (toDeregisterCount + stayingRegisteredCount) - toDeregisterCount + toRegisterCount;
  }

  function getBond(bytes20 _DarkNodeID) public view returns (uint256) {
    // Check if they have bond pending to be withdrawn but still valid
    if (DarkNodes[_DarkNodeID].bondWithdrawalTime >= currentEpoch.time) {
      return DarkNodes[_DarkNodeID].bond + DarkNodes[_DarkNodeID].bondPendingWithdrawal;
    } else {
      return DarkNodes[_DarkNodeID].bond;
    }
  }

  function getSeed(bytes20 _DarkNodeID) public view returns (bytes32) {
    return DarkNodes[_DarkNodeID].seed;
  }
  
  // Allow anyone to see a Republic ID's public key
  function getPublicKey(bytes20 _DarkNodeID) public view returns (bytes) {
    return DarkNodes[_DarkNodeID].publicKey;
  }

  function getOwner(bytes20 _DarkNodeID) public view returns (address) {
    return Utils.ethereumAddressFromPublicKey(DarkNodes[_DarkNodeID].publicKey);
  }

  function getDarkNodeID(address _addr) public view returns (bytes20) {
    return addressIDs[_addr];
  }

  function getBondPendingWithdrawal(bytes20 _DarkNodeID) public view returns (uint256) {
    return DarkNodes[_DarkNodeID].bondPendingWithdrawal;
  }

}
