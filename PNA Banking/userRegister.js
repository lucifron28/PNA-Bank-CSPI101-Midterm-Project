// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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
const confirmPasswordInput = document.getElementById('user-confirm-password');
const errorMessage = document.getElementById('error-message');

// Submit button
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const userName = document.getElementById('name').value;
  const userAddress = document.getElementById('address').value;

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match';
    return;
  }

  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created:', user);
    localStorage.setItem('email', email);
    await addNewUser(email, userName, userAddress);
    window.location.href = 'PNAlogin.html';
  } catch (error) {
    const errorCode = error.code;
    const errorMessageText = error.message;
    errorMessage.textContent = errorMessageText;
  }
});

async function addNewUser(email, name, address) {
  const apiUrl = 'https://cada-bank-api.vercel.app';
  const response = await fetch(`${apiUrl}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
      address,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add user');
  }
  return await response.json();
}