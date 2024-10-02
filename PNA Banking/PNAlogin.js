document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const apiUrl = 'http://cada-bank-api.vercel.app';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            // Fetch account details based on email
            const response = await fetch(`${apiUrl}/banks`);
            if (response.ok) {
                const users = await response.json();
                let user;
                if (users) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].email === email) {
                            console.log('User found:', users[i]);
                            user = users[i];
                            break;
                        }
                    }
                    localStorage.setItem('email', email);
                    localStorage.setItem('name', user.name.value);
                    localStorage.setItem('address', user.address.value);
                    window.location.href = '../user/user.html'; // Redirect to the main page
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