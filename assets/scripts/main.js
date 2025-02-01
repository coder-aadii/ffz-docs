// Toggle between Sign In and Sign Up forms
document.querySelector('.img__btn').addEventListener('click', function () {
    document.querySelector('.cont').classList.toggle('s--signup');
});

// Handle user login
async function loginUser(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic form validation
    if (!email || !password) {
        alert('Please fill in both fields.');
        return;
    }

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);  // Store token in localStorage
        window.location.href = '/pages/dashboard.html';  // Redirect to dashboard
    } else {
        alert('Login failed: ' + data.message || 'Unknown error');
    }
}

// Handle user registration
async function registerUser(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Basic form validation
    if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);  // Store token in localStorage
        alert('Registration successful');
        
        // Slide to the login form
        document.querySelector('.cont').classList.toggle('s--signup');  // Toggle the sliding animation
    } else {
        alert('Registration failed: ' + data.message || 'Unknown error');
    }
}

// Add event listeners to form submit buttons
document.querySelector('.sign-in .submit').addEventListener('click', loginUser);
document.querySelector('.sign-up .submit').addEventListener('click', registerUser);
