import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyAAO29JBf6qHFPHXvj_P65rgVZWpBbCdOM",
    authDomain: "marshall-fitness-app.firebaseapp.com",
    databaseURL: "https://marshall-fitness-app.firebaseio.com",
    projectId: "marshall-fitness-app",
    storageBucket: "marshall-fitness-app.appspot.com",
    messagingSenderId: "686743805821",
    appId: "1:686743805821:web:224f40b79bd81bf69b7614",
    measurementId: "G-XB8H31N9WS"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

const auth = firebase.auth();

export  { db, auth };