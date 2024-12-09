import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZrTeJmpSO16DyRvJlsPwLjGcYM5y2aVg",
  authDomain: "bank-system-midterproject.firebaseapp.com",
  projectId: "bank-system-midterproject",
  storageBucket: "bank-system-midterproject.appspot.com",
  messagingSenderId: "184189071537",
  appId: "1:184189071537:web:8d8ba172e9a14e1aa9f290",
  measurementId: "G-2VZSJX5RTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Get the inputs
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('user-password');
const errorMessage = document.getElementById('error-message');

// Submit button
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  const auth = getAuth();
  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);

    // Fetch account details based on email
    const apiUrl = 'https://cada-bank-api.vercel.app';
    const encodedEmail = email;
    const response = await fetch(`${apiUrl}/users/email/${encodedEmail}`);
    console.log('Response status:', response.status); // Log response status
    const responseData = await response.json();
    console.log('Response data:', responseData); // Log response data

    if (response.ok) {
      const userDetails = responseData;
      if (userDetails && userDetails.email) {
        const name_of_user = userDetails.name;
        const address_of_user = userDetails.address;
        localStorage.setItem('email', email);
        localStorage.setItem('name', name_of_user);
        localStorage.setItem('address', address_of_user);
        window.location.href = '../user/user.html';
      } else {
        throw new Error('User not found');
      }
    } else {
      throw new Error(responseData.message || 'Failed to fetch account details');
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessageText = error.message;
    console.error('Error:', errorCode, errorMessageText);
    errorMessage.textContent = errorMessageText || 'Login failed. Please try again.';
  }
});