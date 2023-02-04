// import firebase from 'firebase'
// ^^ outdated
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// ^^ new code - tutorial outdated


const firebaseConfig = {

    apiKey: "AIzaSyAO6bBojB0LwSWTP2ZLVq-OISMAbJdMeTs",
    authDomain: "challenge-e4db3.firebaseapp.com",
    projectId: "challenge-e4db3",
    storageBucket: "challenge-e4db3.appspot.com",
    messagingSenderId: "830424889017",
    appId: "1:830424889017:web:53d3da64cf410cf2b1cd68",
    measurementId: "G-C2B6H6F9NK"
};


const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }