import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

// Use your own configs!
const app = firebase.initializeApp({
  apiKey: "AIzaSyCltBSMNEcxmA4-qpuDexccDHcRUBztTag",
  authDomain: "onlineauction-83b82.firebaseapp.com",
  projectId: "onlineauction-83b82",
  storageBucket: "onlineauction-83b82.appspot.com",
  messagingSenderId: "267440412708",
  appId: "1:267440412708:web:8679466e12e88d2fb9a0b1",
  measurementId: "G-1GJFRNDMDP"
});

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;
export const firestoreApp = app.firestore();
export const storageApp = app.storage();
export const authApp = app.auth();
