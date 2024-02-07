import { createContext, useEffect, useState } from "react";
import { authApp, firestoreApp } from "../config/firebase";
import Web3 from "web3"; // Import the Web3 library
import  placeBid  from "../Backend/Interaction/placeBid";
const web3 = new Web3(window.ethereum);
const artifacts = require("../Backend/build/contracts/Auction.json");
const auctionAbi = artifacts.abi;

const requestEthAccess = async (bidAmount, name) => {
 
  try {

    
    if (typeof window.ethereum !== "undefined") {
      // Request Ethereum access and get the accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selectedAccount = accounts[0];


      const balanceWei = await web3.eth.getBalance(selectedAccount);
      const balanceEther = web3.utils.fromWei(balanceWei, "ether");
      console.log(balanceEther);

      console.log(selectedAccount);

       let bidItemResult = await placeBid(
        selectedAccount,
        name,
        bidAmount
      );

      if (bidItemResult === "success") {
        // Only execute submitForm if createItem was successful
     
      } else {
        // Handle the error from createItem here, if needed
        console.error("createItem failed");
      }
     
    
    }
  } catch (error) {
    // Handle errors or user rejection
    console.error(error);
  }
};

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalMsg, setGlobalMsg] = useState("");
  const [endedAuctions, setEndedAuctions] = useState([]);

  const register = (email, password) => {
    return authApp.createUserWithEmailAndPassword(email, password);
  };

  const login = (email, password) => {
    return authApp.signInWithEmailAndPassword(email, password);
  };

  const logout = () => {
    return authApp.signOut();
  };

  const bidAuction = async(auctionId, bidAmount , name) => {

    
    
    
    if (!currentUser) {
      return setGlobalMsg("Please login first");
    }
    let newPrice = bidAmount;
    if (bidAmount > 10) {
      newPrice = Math.floor((bidAmount / 100) * 110);
    } else {
      newPrice = `${+newPrice + 1}`;
    }
    
    let ethValue = newPrice/2358;
    await requestEthAccess(ethValue , name);

    const db = firestoreApp.collection("auctions");

    // db.doc(auctionId).update({
    //   ['bidders.' + currentUser.email]: newPrice,
    // })

    // .then(() => {
    //   // Bid placed successfully
    //   console.log('Bid placed successfully');
    // })
    // .catch((error) => {
    //   // Handle error
    //   console.error('Error placing bid:', error);
    // });
    db.doc(auctionId)
      .get()
      .then((doc) => {
        const currentBidders = doc.data().bidders || {};

        let currentUsermail = currentUser.email;
          // const updateData = {};
        currentBidders[currentUsermail] = newPrice;
        return db.doc(auctionId).update({
          bidders: currentBidders,
          curPrice: newPrice,
          curWinner: currentUser.email,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };


const endAuction = async (auctionId) => {
  const db = firestoreApp.collection("auctions");

  try {
    await db.doc(auctionId).update({ ended: true }); // Update the ended state
    setEndedAuctions((prev) => [...prev, auctionId]); // Add to endedAuctions state
  } catch (error) {
    console.error("Error ending auction:", error);
  }
};

useEffect(() => {
  const subscribe = authApp.onAuthStateChanged((user) => {
    setCurrentUser(user);
    setLoading(false);
  });

  return subscribe;
}, []);

useEffect(() => {
  const interval = setTimeout(() => setGlobalMsg(""), 5000);
  return () => clearTimeout(interval);
}, [globalMsg]);

return (
  <AuthContext.Provider
    value={{
      currentUser,
      register,
      login,
      logout,
      bidAuction,
      endAuction,

      endAuction,
      globalMsg,
      endedAuctions,
    }}
  >
    {!loading && children}
  </AuthContext.Provider>
            );
  }