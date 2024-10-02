document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://cada-bank-api.vercel.app/banks';

    const createBankForm = document.getElementById('create-bank-form');
    const banksTableBody = document.querySelector('#banks-table tbody');
    const updateBankModal = document.getElementById('update-bank-modal');
    const updateBankForm = document.getElementById('update-bank-form');
    const closeModal = document.querySelector('.close');

    let currentAccountNumber = null;
    let banks = [];

    createBankForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bank = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            account_number: parseInt(document.getElementById('account_number').value),
            balance: parseFloat(document.getElementById('balance').value),
            is_active: document.getElementById('is_active').checked,
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
        banks = await response.json();
        banksTableBody.innerHTML = '';
        banks.forEach(bank => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bank.name}</td>
                <td>${bank.email}</td>
                <td>${bank.address}</td>
                <td>${bank.account_number}</td>
                <td>${bank.balance}</td>
                <td>${bank.is_active}</td>
                <td>${bank.type_of_account}</td>
                <td>
                    <button onclick="openUpdateModal(${bank.account_number})">Update</button>
                    <button onclick="deleteBank(${bank.account_number})">Delete</button>
                </td>
            `;
            banksTableBody.appendChild(row);
        });
    }

    window.openUpdateModal = (accountNumber) => {
        currentAccountNumber = accountNumber;
        const bank = banks.find(b => b.account_number === accountNumber);
        document.getElementById('update-name').value = bank.name;
        document.getElementById('update-email').value = bank.email;
        document.getElementById('update-address').value = bank.address;
        document.getElementById('update-balance').value = bank.balance;
        document.getElementById('update-is_active').checked = bank.is_active;
        document.getElementById('update-type_of_account').value = bank.type_of_account;
        updateBankModal.style.display = 'flex';
        updateBankModal.style.animation = 'fade-in-right 0.5s'
        document.querySelector('.image').style.animation = 'fade-out-right 0.5s'
        setTimeout(() => {
            document.querySelector('.image').style.display = 'none';
        }, 300); // Delay time should match the animation duration (in milliseconds);
    };

    updateBankForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateBankModal.style.animation = 'fade-out-left 0.5s'
        setTimeout(() => {
            closeModalAndShowImage();
        }, 300);
        document.querySelector('.image').style.animation = 'fade-in-left 0.5s'
        const updatedBank = {
            name: document.getElementById('update-name').value || undefined,
            email: document.getElementById('update-email').value || undefined,
            address: document.getElementById('update-address').value || undefined,
            balance: parseFloat(document.getElementById('update-balance').value) || undefined,
            is_active: document.getElementById('update-is_active').checked,
            type_of_account: document.getElementById('update-type_of_account').value || undefined
        };
        await fetch(`${apiUrl}/${currentAccountNumber}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBank)
        });
        updateBankModal.style.display = 'none';
        loadBanks();
    });

    window.deleteBank = async (accountNumber) => {
        await fetch(`${apiUrl}/${accountNumber}`, {
            method: 'DELETE'
        });
        loadBanks();
    };

    function closeModalAndShowImage() {
        updateBankModal.style.display = 'none';
        document.querySelector('.image').style.display = 'flex';
    }

    closeModal.onclick = () => {
        updateBankModal.style.animation = 'fade-out-left 0.5s'
        setTimeout(() => {
            closeModalAndShowImage();
        }, 300);
        document.querySelector('.image').style.animation = 'fade-in-left 0.5s'
    };
    loadBanks();
});