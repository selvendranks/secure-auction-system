// Import necessary dependencies
import contractAddress from '../../config/contract';
const {Web3} = require('web3');
const artifacts = require('../build/contracts/Auction.json'); // Replace with the correct path to your contract's JSON file

const web3 = new Web3('http://127.0.0.1:8545'); // Replace with your Ethereum node URL
const Auction = artifacts.abi; // Use the contract ABI directly


// Define the function to create an item
async function createItem(fromAddress, itemName, durationInMinutes) {
  try {
    // Create a contract instance
    const auction = new web3.eth.Contract(Auction, contractAddress);

    // Call the contract function to create the item
    const tx = await auction.methods.createItem(itemName, durationInMinutes).send({ from: fromAddress , gas: 200000});

    // Wait for the transaction to be mined
    const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);

    // Check if the transaction was successful
    if (receipt.status) {
      console.log(`Item "${itemName}" created successfully.`);
      return "success";
    } else {
      console.error('Transaction failed.');
    }
  } catch (error) {
    console.error('Error creating item:', error);
  }
}



export default createItem;


// Call the createItem function

