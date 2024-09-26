document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://cada-bank-api.vercel.app/banks';

    const createBankForm = document.getElementById('create-bank-form');
    const banksTableBody = document.querySelector('#banks-table tbody');

    createBankForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bank = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            account_number: parseInt(document.getElementById('account_number').value),
            balance: parseFloat(document.getElementById('balance').value),
            is_active: document.getElementById('is_active').checked,
            status: document.getElementById('status').value,
            type_of_account: document.getElementById('type_of_account').value
        };
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bank)
        });
        loadBanks();
    });

    async function loadBanks() {
        const response = await fetch(apiUrl);
        const banks = await response.json();
        banksTableBody.innerHTML = '';
        banks.forEach(bank => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bank.name}</td>
                <td>${bank.address}</td>
                <td>${bank.account_number}</td>
                <td>${bank.balance}</td>
                <td>${bank.is_active}</td>
                <td>${bank.status}</td>
                <td>${bank.type_of_account}</td>
                <td>
                    <button onclick="updateBank(${bank.account_number})">Update</button>
                    <button onclick="deleteBank(${bank.account_number})">Delete</button>
                    <button onclick="deposit(${bank.account_number})">Deposit</button>
                    <button onclick="withdraw(${bank.account_number})">Withdraw</button>
                </td>
            `;
            banksTableBody.appendChild(row);
        });
    }

    window.updateBank = async (accountNumber) => {
        // Implement update functionality
    };

    window.deleteBank = async (accountNumber) => {
        await fetch(`${apiUrl}/${accountNumber}`, {
            method: 'DELETE'
        });
        loadBanks();
    };

    window.deposit = async (accountNumber) => {
        const amount = prompt('Enter amount to deposit:');
        await fetch(`${apiUrl}/${accountNumber}/deposit?amount=${amount}`, {
            method: 'PUT'
        });
        loadBanks();
    };

    window.withdraw = async (accountNumber) => {
        const amount = prompt('Enter amount to withdraw:');
        await fetch(`${apiUrl}/${accountNumber}/withdraw?amount=${amount}`, {
            method: 'PUT'
        });
        loadBanks();
    };

    loadBanks();
});