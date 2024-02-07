// Import necessary dependencies

import Web3 from 'web3';
import artifacts from '../build/contracts/Auction.json' assert { type: 'json' };
 

const web3 = new Web3('http://127.0.0.1:8545'); // Replace with your Ethereum node URL
const Auction = artifacts.abi; // Use the contract ABI directly
const contractAddress = "0xE7184B86B98abcD0F76Bd79120492546c57cb02f"
const fromAddress = "0x70A6FeaA8c5ae91540FB8C640413Dbb78F84316F"

// Define the function to check expired items
async function checkExpiredItems() {
  try {

    console.log("running");
    // Create a contract instance
    const auction = new web3.eth.Contract(Auction, contractAddress);

    // Call the contract function to check expired items
    const tx = await auction.methods.checkExpiredItems().send({from: fromAddress, gas: 200000 });

    // Wait for the transaction to be mined
    const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);

    // Check if the transaction was successful
    if (receipt.status) {
      console.log('Expired items checked successfully.');
    } else {
      console.error('Transaction failed.');
    }
  } catch (error) {
    console.error('Error checking expired items:', error);
  }
}

// Set interval to call checkExpiredItems every 30 seconds (30000 milliseconds)
setInterval(checkExpiredItems, 30000);
