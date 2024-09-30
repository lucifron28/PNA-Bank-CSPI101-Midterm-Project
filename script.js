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
            address: document.getElementById('address').value,
            account_number: parseInt(document.getElementById('account_number').value),
            balance: parseFloat(document.getElementById('balance').value),
            is_active: document.getElementById('is_active').checked,
            type_of_account: document.getElementById('type_of_account').value
        };
        console.log('Creating bank:', bank); // Debugging log
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bank)
            });
            const data = await response.json();
            console.log('Response:', data); // Debugging log
            if (response.ok) {
                loadBanks();
            } else {
                console.error('Error creating bank:', data);
            }
        } catch (error) {
            console.error('Error creating bank:', error);
        }
    });

    async function loadBanks() {
        try {
            const response = await fetch(apiUrl);
            banks = await response.json();
            banksTableBody.innerHTML = '';
            banks.forEach(bank => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${bank.name}</td>
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
        } catch (error) {
            console.error('Error loading banks:', error);
        }
    }

    window.openUpdateModal = (accountNumber) => {
        currentAccountNumber = accountNumber;
        const bank = banks.find(b => b.account_number === accountNumber);
        document.getElementById('update-name').value = bank.name;
        document.getElementById('update-address').value = bank.address;
        document.getElementById('update-balance').value = bank.balance;
        document.getElementById('update-is_active').checked = bank.is_active;
        document.getElementById('update-type_of_account').value = bank.type_of_account;
        updateBankModal.style.display = 'flex';
    };

    updateBankForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedBank = {
            name: document.getElementById('update-name').value || undefined,
            address: document.getElementById('update-address').value || undefined,
            balance: parseFloat(document.getElementById('update-balance').value) || undefined,
            is_active: document.getElementById('update-is_active').checked,
            type_of_account: document.getElementById('update-type_of_account').value || undefined
        };
        console.log('Updating bank:', updatedBank); // Debugging log
        try {
            const response = await fetch(`${apiUrl}/${currentAccountNumber}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBank)
            });
            const data = await response.json();
            console.log('Response:', data); // Debugging log
            if (response.ok) {
                updateBankModal.style.display = 'none';
                loadBanks();
            } else {
                console.error('Error updating bank:', data);
            }
        } catch (error) {
            console.error('Error updating bank:', error);
        }
    });

    window.deleteBank = async (accountNumber) => {
        try {
            const response = await fetch(`${apiUrl}/${accountNumber}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log('Deleted bank:', data); // Debugging log
            if (response.ok) {
                loadBanks();
            } else {
                console.error('Error deleting bank:', data);
            }
        } catch (error) {
            console.error('Error deleting bank:', error);
        }
    };

    closeModal.onclick = () => {
        updateBankModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === updateBankModal) {
            updateBankModal.style.display = 'none';
        }
    };

    loadBanks();
});