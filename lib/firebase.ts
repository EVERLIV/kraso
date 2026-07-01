
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";
import "firebase/compat/analytics";

// Config provided by user
// Use your domain for "Continue to yourdomain.com" on Google sign-in; leave empty for firebaseapp.com
const customAuthDomain = import.meta.env.VITE_AUTH_DOMAIN || "";
const firebaseConfig = {
  apiKey: "AIzaSyDlXu-Y-B0SWAbJs_1_mtnHlatCOXZTQT0",
  authDomain: customAuthDomain || "project-1285666415996898989.firebaseapp.com",
  databaseURL: "https://project-1285666415996898989-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "project-1285666415996898989",
  storageBucket: "smartphotos.ru",
  messagingSenderId: "318064340729",
  appId: "1:318064340729:web:b5d3d5100d14ae2d4a3c28",
  measurementId: "G-LVBHWV70CD"
};

let app;
let auth: firebase.auth.Auth | undefined;
let db: firebase.firestore.Firestore | undefined;
let storage: firebase.storage.Storage | undefined;
let functions: firebase.functions.Functions | undefined;
let googleProvider: firebase.auth.GoogleAuthProvider | undefined;
let analytics: firebase.analytics.Analytics | undefined;

try {
  // Initialize Firebase App
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
    console.log("Firebase App initialized with ID:", firebaseConfig.projectId);
  } else {
    app = firebase.apps[0];
  }

  // Initialize Auth
  try {
    auth = firebase.auth();
    googleProvider = new firebase.auth.GoogleAuthProvider();
  } catch (e) {
    console.error("Auth initialization failed:", e);
  }

  // Initialize Firestore
  try {
    db = firebase.firestore();
  } catch (e) {
    console.error("Firestore initialization failed:", e);
  }

  // Initialize Storage
  try {
    storage = firebase.storage();
  } catch (e) {
    console.error("Storage initialization failed:", e);
  }

  // Initialize Functions
  try {
    functions = firebase.functions();
  } catch (e) {
    console.error("Functions initialization failed:", e);
  }
  
  // Initialize Analytics (Browser only)
  if (typeof window !== 'undefined') {
    try {
      analytics = firebase.analytics();
    } catch (e) {
      console.warn("Analytics initialization failed (might be blocked by adblocker):", e);
    }
  }
  
} catch (error) {
  console.error("Firebase Critical Error:", error);
}

export { app, auth, db, storage, functions, googleProvider, analytics, firebase };
