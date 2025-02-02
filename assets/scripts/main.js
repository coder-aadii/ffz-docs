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

    console.log('Logging in with:', { email, password });

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (response.status === 200) {
        // alert('Login successful');
        localStorage.setItem('token', data.token); // Store JWT in local storage
        window.location.href = '/pages/dashboard.html';  // Redirect to dashboard
    } else {
        alert('Login failed: ' + (data.message || 'Unknown error'));
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

    console.log('Registering with:', { name, email, password });

    const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    console.log('Registration response:', data);

    if (response.status === 201) {
        alert('Registration successful');
        
        // Slide to the login form
        document.querySelector('.cont').classList.toggle('s--signup');  // Toggle the sliding animation
    } else {
        alert('Registration failed: ' + (data.message || 'Unknown error'));
    }
}

// Fetch user data on dashboard load
async function fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html'; // Redirect to login if no token is found
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log('User data:', data);

        if (response.status === 200) {
            // Display user data on the dashboard
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userEmail').textContent = data.email;
        } else {
            alert('Failed to fetch user data');
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Error fetching user data');
    }
}

// Add event listeners to form submit buttons
document.querySelector('.sign-in .submit').addEventListener('click', loginUser);
document.querySelector('.sign-up .submit').addEventListener('click', registerUser);

// Call fetchUserData when the dashboard page is loaded
if (window.location.pathname === '/pages/dashboard.html') {
    fetchUserData();
}
