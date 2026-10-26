// Declare necessary functions and variables
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = type;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function apiCall(url, method, data) {
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => response.json());
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

document.getElementById('adminLoginForm').addEventListener('submit', async function (e) {
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
    showMessage('message', 'Admin login in progress...', 'info');

    const response = await apiCall('/admin/login', 'POST', {
      email,
      password,
    });

    // Store admin data
    setLocalStorage('adminId', response.adminId);
    setLocalStorage('adminEmail', response.email);

    showMessage('message', 'Admin login successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1500);
  } catch (error) {
    showMessage('message', error.message || 'Admin login failed', 'error');
    console.error('Admin Login Error:', error);
  }
});
