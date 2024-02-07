// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auction {
    struct Item {
        address seller;
        string itemName;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
        mapping(address => uint256) bidAmounts;
        address[] bidders;
        bool active;
    }

    Item[] public items;
    uint256[] public expirationTimestamps; 

    event NewBid(address indexed bidder, uint256 amount, string itemName);
    event AuctionEnded(string itemName, address winner, uint256 amount);

    modifier onlyItemSeller(string memory itemName) {
        uint256 itemIndex = getItemIndex(itemName);
        require(msg.sender == items[itemIndex].seller, "Only the seller can call this");
        _;
    }

    modifier onlyBeforeEnd(string memory itemName) {
        uint256 itemIndex = getItemIndex(itemName);
        require(block.timestamp < items[itemIndex].auctionEndTime, "Auction has ended");
        _;
    }

    modifier onlyAfterEnd(string memory itemName) {
        uint256 itemIndex = getItemIndex(itemName);
        require(block.timestamp >= items[itemIndex].auctionEndTime, "Auction hasn't ended yet");
        _;
    }

    function createItem(string memory itemName, uint256 durationInMinutes) external {
        Item storage newItem = items.push();
        newItem.seller = msg.sender;
        newItem.itemName = itemName;
        newItem.auctionEndTime = block.timestamp + (durationInMinutes * 1 minutes) + 5 seconds;
        newItem.active = true;
        expirationTimestamps.push(newItem.auctionEndTime);
    }

    function getItemIndex(string memory itemName) internal view returns (uint256) {
        for (uint256 i = 0; i < items.length; i++) {
            if (keccak256(bytes(items[i].itemName)) == keccak256(bytes(itemName))) {
                return i;
            }
        }
        revert("Item not found");
    }
   
    function placeBid(string memory itemName) external payable onlyBeforeEnd(itemName) {
    uint256 itemIndex = getItemIndex(itemName);
    require(items[itemIndex].active, "Auction is not active");
    require(msg.sender != items[itemIndex].seller, "The seller cannot bid");

    // Pay back the previous bid amount to the bidder
    if (items[itemIndex].bidAmounts[msg.sender] > 0) {
        payable(msg.sender).transfer(items[itemIndex].bidAmounts[msg.sender]);
    }

    // Overwrite the previous bid amount with the new one
    items[itemIndex].bidAmounts[msg.sender] = msg.value;
    uint256 newBidAmount = msg.value;

    if (newBidAmount > items[itemIndex].highestBid) {
        items[itemIndex].highestBidder = msg.sender;
        items[itemIndex].highestBid = newBidAmount;
    }

    bool alreadyExists = false;
    for (uint256 i = 0; i < items[itemIndex].bidders.length; i++) {
        if (items[itemIndex].bidders[i] == msg.sender) {
            alreadyExists = true;
            break;
        }
    }

    if (!alreadyExists) {
        items[itemIndex].bidders.push(msg.sender);
    }

    emit NewBid(msg.sender, newBidAmount, itemName);
}




    function refund(string memory itemName, address recipient ) internal {
        uint256 itemIndex = getItemIndex(itemName);
        uint256 refundAmount = items[itemIndex].bidAmounts[recipient];
        payable(recipient).transfer(refundAmount);

    }

    function endAuction(string memory itemName ) internal onlyAfterEnd(itemName) {
        uint256 itemIndex = getItemIndex(itemName);
        require(items[itemIndex].active, "Auction is not active");

        items[itemIndex].active = false;
        emit AuctionEnded(itemName, items[itemIndex].highestBidder, items[itemIndex].highestBid);

        for (uint256 i = 0; i < items[itemIndex].bidders.length; i++) {
          if(items[itemIndex].bidders[i] != items[itemIndex].highestBidder)
            refund(itemName, items[itemIndex].bidders[i] );
        }

         

        payable(items[itemIndex].seller).transfer(items[itemIndex].highestBid);
    }

    function getBidders(string memory itemName) external view returns (address[] memory) {
        uint256 itemIndex = getItemIndex(itemName);
        return items[itemIndex].bidders;
    }

    function getHighestBidderAndAmount(string memory itemName) external view returns (address, uint256) {
        uint256 itemIndex = getItemIndex(itemName);
        return (items[itemIndex].highestBidder, items[itemIndex].highestBid);
    }

    function checkExpiredItems() external {
        uint256 currentTime = block.timestamp;
        for (uint256 i = 0; i < expirationTimestamps.length; i++) {
            if (expirationTimestamps[i] <= currentTime && items[i].active == true) {
                // Call endAuction for the expired item
                endAuction(items[i].itemName);
            }
        }
    }
}
