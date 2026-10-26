// Declare showMessage function
(() => {
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = type;
}

// Declare validateEmail function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Declare apiCall function
async function apiCall(url, method, data) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

// Declare setLocalStorage function
function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showMessage('message', 'Please fill in all fields', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('message', 'Please enter a valid email', 'error');
    return;
  }

  try {
    showMessage('message', 'Logging in...', 'info');

    const response = await apiCall('/auth/login', 'POST', {
      email,
      password,
    });

    // Store user data
    setLocalStorage('userId', response.userId);
    setLocalStorage('userEmail', response.email);
    setLocalStorage('userName', response.name);

    showMessage('message', 'Login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'design.html';
    }, 1500);
  } catch (error) {
    showMessage('message', error.message || 'Login failed', 'error');
    console.error('Login Error:', error);
  }
});
})();