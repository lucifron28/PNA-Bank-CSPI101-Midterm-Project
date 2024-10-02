document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://cada-bank-api.vercel.app';
    const accountsContainer = document.querySelector('.accounts');
    const accountModal = document.getElementById('account-modal');
    const closeAccountModal = document.getElementById('close-account-modal');
    const accountForm = document.getElementById('account-form');
    const errorMessage = document.getElementById('error-message');
    const userEmailElement = document.getElementById('user-email');
    const userAddressElement = document.getElementById('user-address');
    const userNameElement = document.getElementById('user-name');
    const addAccountButton = document.getElementById('add-account-button');
    const viewAccountModal = document.getElementById('view-account-modal');
    const closeViewAccountModal = document.getElementById('close-view-account-modal');
    const accountDetails = document.getElementById('account-details');
    const withdrawButton = document.getElementById('withdraw-button');
    const depositButton = document.getElementById('deposit-button');

    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name') || 'N/A';
    const address = localStorage.getItem('address') || 'N/A';
    userEmailElement.textContent = email;
    userAddressElement.textContent = address;
    userNameElement.textContent = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    async function loadAccounts() {
        try {
            const response = await fetch(`${apiUrl}/banks/email/${email}`);
            if (response.ok) {
                const accounts = await response.json();
                displayAccounts(accounts);
            } else {
                throw new Error('Failed to load accounts');
            }
        } catch (error) {
            console.error('Error loading accounts:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Error loading accounts. Please try again.';
            }
        }
    }

    function displayAccounts(accounts) {
        accountsContainer.innerHTML = '';
        accounts.forEach(account => {
            const accountDiv = document.createElement('div');
            accountDiv.classList.add('account');
            accountDiv.innerHTML = `
                <p>Account Number: ${account.account_number}</p>
                <p>Account Type: ${account.type_of_account}</p>
                <p>Balance: ${account.balance}</p>
                <button class="view-account-button" data-account='${JSON.stringify(account)}'>View</button>
                <button class="delete-account-button" data-account-number='${account.account_number}'>Delete</button>
            `;
            accountsContainer.appendChild(accountDiv);
        });

        document.querySelectorAll('.view-account-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const account = JSON.parse(e.target.getAttribute('data-account'));
                viewAccount(account);
            });
        });

        document.querySelectorAll('.delete-account-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const accountNumber = e.target.getAttribute('data-account-number');
                await deleteAccount(accountNumber);
            });
        });
    }

    async function deleteAccount(accountNumber) {
        try {
            const response = await fetch(`${apiUrl}/banks/${accountNumber}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadAccounts();
            } else {
                throw new Error('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Error deleting account. Please try again.';
            }
        }
    }

    function viewAccount(account) {
        accountDetails.innerHTML = `
            <p>Account Number: ${account.account_number}</p>
            <p>Account Type: ${account.type_of_account}</p>
            <p>Balance: ${account.balance}</p>
        `;
        viewAccountModal.style.display = 'block';

        withdrawButton.onclick = async () => {
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            await updateBalance(account.account_number, -amount);
        };

        depositButton.onclick = async () => {
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            await updateBalance(account.account_number, amount);
        };
    }

    async function updateBalance(accountNumber, amount) {
        try {
            const currentBalanceResponse = await fetch(`${apiUrl}/banks/${accountNumber}`);
            if (!currentBalanceResponse.ok) {
                throw new Error('Failed to fetch current balance');
            }
            const currentBalanceData = await currentBalanceResponse.json();
            const currentBalance = currentBalanceData.balance;
    
            let finalAmount = currentBalance + amount;
            const response = await fetch(`${apiUrl}/banks/${accountNumber}/balance?amount=${finalAmount}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            const responseData = await response.json();
            console.log('Response Data:', responseData);
    
            if (response.ok) {
                loadAccounts();
                viewAccountModal.style.display = 'none';
            } else {
                throw new Error('Failed to update balance');
            }
        } catch (error) {
            console.error('Error updating balance:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Error updating balance. Please try again.';
            }
        }
    }

    accountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const accountBalance = parseFloat(document.getElementById('account-balance').value);
        const accountType = document.getElementById('account-type').value;
    
        const newAccount = {
            name: name,
            address: address,
            email: email,
            account_number: Math.floor(Math.random() * 1000000000), // Generate a random account number
            balance: accountBalance,
            is_active: true,
            type_of_account: accountType
        };
    
        try {
            const response = await fetch(`${apiUrl}/banks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAccount)
            });
            if (response.ok) {
                loadAccounts();
                accountModal.style.display = 'none';
            } else {
                throw new Error('Failed to add account');
            }
        } catch (error) {
            console.error('Error adding account:', error);
            if (errorMessage) {
                errorMessage.textContent = 'Error adding account. Please try again.';
            }
        }
    });

    addAccountButton.addEventListener('click', () => {
        accountModal.style.display = 'block';
    });

    closeAccountModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
    });

    closeViewAccountModal.addEventListener('click', () => {
        viewAccountModal.style.display = 'none';
    });

    loadAccounts();
});