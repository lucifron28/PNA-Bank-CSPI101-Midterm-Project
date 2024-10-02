document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const apiUrl = 'http://cada-bank-api.vercel.app';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            // Fetch account details based on email
            const response = await fetch(`${apiUrl}/banks/email/${email}`);
            if (response.ok) {
                const user = await response.json();
                if (user && user.length > 0) {
                    const name_of_user = user[0].name;
                    const address_of_user = user[0].address;
                    console.log(name_of_user);
                    console.log(address_of_user);
                    localStorage.setItem('email', email);
                    localStorage.setItem('name', name_of_user);
                    localStorage.setItem('address', address_of_user);
                    window.location.href = '../user/user.html';
                } else {
                    throw new Error('User not found');
                }
            } else {
                throw new Error('Failed to fetch account details');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
        }
    });
});