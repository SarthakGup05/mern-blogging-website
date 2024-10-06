// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKggVRQ8QoHKaouei2tkqvQ58bC6Ybbo0",
  authDomain: "travel-blog-react1.firebaseapp.com",
  projectId: "travel-blog-react1",
  storageBucket: "travel-blog-react1.appspot.com",
  messagingSenderId: "784040271563",
  appId: "1:784040271563:web:aed1ba5f1d64581b9c054e",
  measurementId: "G-YG3YN5M8ZJ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google sign-in provider
const provider = new GoogleAuthProvider();

// Function to handle Google sign-in
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Handle successful sign-in with user data (e.g., user.uid, user.displayName)
    console.log("Logged in with Google:", user);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    // Handle errors appropriately
  }
};

// Call the function when needed (e.g., on a button click)
// Example: You might use this function in a React component

// export default function SignInButton() {
//   return (
//     <button onClick={handleGoogleSignIn}>
//       Sign in with Google
//     </button>
//   );
// }
