import Web3 from 'web3';

const web3 = new Web3(window.ethereum || 'http://localhost:8545');

export default web3;
