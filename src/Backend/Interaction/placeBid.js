// Import necessary dependencies
const {Web3} = require('web3');
const artifacts = require('../build/contracts/Auction.json'); // Replace with the correct path to your contract's JSON file
import contractAddress from '../../config/contract';
const web3 = new Web3('http://127.0.0.1:8545'); // Replace with your Ethereum node URL
const Auction = artifacts.abi; // Use the contract ABI directly

// Define the Ethereum address that will call this function (you can replace this)
// let fromAddress = ''; // Replace with your address

// Define the item details
// const itemName = 'Knife'; // Replace with your item's name
// const durationInMinutes = 10; // Replace with the duration in minutes

// Define the contract address
 // Replace with your contract address

// Define the function to create an item
async function placeBid(fromAddress, itemName, bidAmount) {
  try {
    // Create a contract instance
    const auction = new web3.eth.Contract(Auction, contractAddress);

    const tx = await auction.methods.placeBid(itemName).send({
        from: fromAddress,
        value: web3.utils.toWei(bidAmount, 'ether'), // Send the bid amount in Ether
        gas: 200000,
      });

      console.log(bidAmount);
  
      // Wait for the transaction to be mined
      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
  
      // Check if the transaction was successful
      if (receipt.status) {
        console.log(`Bid placed successfully for item "${itemName}".`);
        console.log(receipt);
        return "success";
      } else {
        console.error('Transaction failed.');
      }
  } catch (error) {
    console.error('Error placing bid', error);
  }
}



export default placeBid;


// Call the createItem function

