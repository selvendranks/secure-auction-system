import { createContext, useEffect, useState } from "react";
import { authApp, firestoreApp } from "../config/firebase";

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

  const bidAuction = (auctionId, price) => {
    if (!currentUser) {
      return setGlobalMsg("Please login first");
    }
    let newPrice = price;
    if (price > 10) {
      newPrice = Math.floor((price / 100) * 110);
    } else {
      newPrice = `${+newPrice + 1}`;
    }
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