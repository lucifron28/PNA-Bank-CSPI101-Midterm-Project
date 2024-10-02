  // Import the functions you need from the SDKs you need

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";

  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

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
