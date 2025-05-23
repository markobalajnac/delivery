// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJX5WFpbq4yqjiPN7e7CYW9icfGiUo5Lo",
  authDomain: "deliverytracker-28746.firebaseapp.com",
  projectId: "deliverytracker-28746",
  storageBucket: "deliverytracker-28746.firebasestorage.app",
  messagingSenderId: "418446081844",
  appId: "1:418446081844:web:fc81d75b1f93672037af61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);