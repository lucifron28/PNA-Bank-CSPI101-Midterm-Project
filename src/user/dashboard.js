import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://cada-bank-api.vercel.app";
  const accountsContainer = document.querySelector(".accounts");
  const accountModal = document.getElementById("account-modal");
  const closeAccountModal = document.getElementById("close-account-modal");
  const accountForm = document.getElementById("account-form");
  const errorMessage = document.getElementById("error-message");
  const userEmailElement = document.getElementById("user-email");
  const userAddressElement = document.getElementById("user-address");
  const userNameElement = document.getElementById("user-name");
  const addAccountButton = document.getElementById("add-account-button");
  const viewAccountModal = document.getElementById("view-account-modal");
  const closeViewAccountModal = document.getElementById("close-view-account-modal");
  const accountDetails = document.getElementById("account-details");
  const withdrawButton = document.getElementById("withdraw-button");
  const depositButton = document.getElementById("deposit-button");
  const logoutButton = document.getElementById("logout-button");

  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name") || "N/A";
  const address = localStorage.getItem("address") || "N/A";

  userNameElement.textContent = name.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  async function loadUser() {
    try {
      const response = await fetch(`${apiUrl}/users/email/${email}`);
      if (response.ok) {
        const user = await response.json();
        userEmailElement.textContent = user.email;
        userAddressElement.textContent = user.address;
        userNameElement.textContent = user.name;
      } else {
        throw new Error("Failed to load user");
      }
    } catch (error) {
      console.error("Error loading user:", error);
      window.location.href = "../PNA Banking/PNAlogin.html";
    }
  }

  async function loadAccounts() {
    try {
      const response = await fetch(`${apiUrl}/banks/email/${email}`);
      if (response.ok) {
        const accounts = await response.json();
        displayAccounts(accounts);
      } else {
        throw new Error("Failed to load accounts");
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
      if (errorMessage) {
        errorMessage.textContent = "Error loading accounts. Please try again.";
      }
    }
  }

  function displayAccounts(accounts) {
    accountsContainer.innerHTML = "";
    accounts.forEach((account) => {
      const accountDiv = document.createElement("div");
      accountDiv.classList.add("account");
      accountDiv.innerHTML = `
        <p>Account Number: ${account.account_number}</p>
        <p>Account Type: ${account.type_of_account}</p>
        <p>Balance: ${account.balance}</p>
        <button class="view-account-button" data-account='${JSON.stringify(account)}'>View</button>
        <button class="delete-account-button" data-account-number='${account.account_number}'>Delete</button>
      `;
      accountsContainer.appendChild(accountDiv);
    });

    document.querySelectorAll(".view-account-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const account = JSON.parse(e.target.getAttribute("data-account"));
        viewAccount(account);
      });
    });

    document.querySelectorAll(".delete-account-button").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const accountNumber = e.target.getAttribute("data-account-number");
        await deleteAccount(accountNumber);
      });
    });
  }

  async function deleteAccount(accountNumber) {
    try {
      const response = await fetch(`${apiUrl}/banks/${accountNumber}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadAccounts();
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      if (errorMessage) {
        errorMessage.textContent = "Error deleting account. Please try again.";
      }
    }
  }

  function viewAccount(account) {
    document.getElementById("account-number").textContent = account.account_number;
    document.getElementById("account-type").textContent = account.type_of_account;
    document.getElementById("account-balance").textContent = `₱${account.balance.toFixed(2)}`;
    viewAccountModal.style.display = "block";

    // Clear previous transaction amount
    document.getElementById("transaction-amount").value = "";

    // Add event listeners to the buttons
    const withdrawBtn = document.getElementById("withdraw-button");
    const depositBtn = document.getElementById("deposit-button");

    withdrawBtn.onclick = async () => {
      const amount = parseFloat(document.getElementById("transaction-amount").value);
      if (amount && amount > 0) {
        await updateBalance(account.account_number, -amount);
      } else {
        errorMessage.textContent = "Please enter a valid amount";
      }
    };

    depositBtn.onclick = async () => {
      const amount = parseFloat(document.getElementById("transaction-amount").value);
      if (amount && amount > 0) {
        await updateBalance(account.account_number, amount);
      } else {
        errorMessage.textContent = "Please enter a valid amount";
      }
    };
  }

  async function updateBalance(accountNumber, amount) {
    try {
      const currentBalanceResponse = await fetch(`${apiUrl}/banks/${accountNumber}`);
      if (!currentBalanceResponse.ok) {
        throw new Error("Failed to fetch current balance");
      }
      const currentBalanceData = await currentBalanceResponse.json();
      const currentBalance = currentBalanceData.balance;

      let finalAmount = currentBalance + amount;
      const response = await fetch(`${apiUrl}/banks/${accountNumber}/balance?amount=${finalAmount}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (response.ok) {
        loadAccounts();
        viewAccountModal.style.display = "none";
      } else {
        throw new Error("Failed to update balance");
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      if (errorMessage) {
        errorMessage.textContent = "Error updating balance. Please try again.";
      }
    }
  }

  accountForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const accountBalance = parseFloat(document.getElementById("account-balance").value);
    const accountType = document.getElementById("account-type").value;

    const newAccount = {
      name: name,
      address: address,
      email: email,
      account_number: Math.floor(Math.random() * 1000000000), // Generate a random account number
      balance: accountBalance,
      is_active: true,
      type_of_account: accountType,
    };

    try {
      const response = await fetch(`${apiUrl}/banks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
      if (response.ok) {
        loadAccounts();
        accountModal.style.display = "none";
      } else {
        throw new Error("Failed to add account");
      }
    } catch (error) {
      console.error("Error adding account:", error);
      if (errorMessage) {
        errorMessage.textContent = "Error adding account. Please try again.";
      }
    }
  });

  addAccountButton.addEventListener("click", () => {
    accountModal.style.display = "block";
    accountModal.scrollIntoView({
      behavior: "smooth", 
      block: "start"
    });
  });

  closeAccountModal.addEventListener("click", () => {
    accountModal.style.display = "none";
  });

  closeViewAccountModal.addEventListener("click", () => {
    viewAccountModal.style.display = "none";
  });

  logoutButton.addEventListener("click", async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "../PNA Banking/PNAlogin.html";
    } catch (error) {
      console.error("Error logging out:", error);
      if (errorMessage) {
        errorMessage.textContent = "Error logging out. Please try again.";
      }
    }
  });

  loadUser();
  loadAccounts();
});
