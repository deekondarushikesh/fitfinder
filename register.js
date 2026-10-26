(() => {
const showMessage = (elementId, message, type) => {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = type;
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
const apiCall = async (url, method = "GET", data = null) => {
  let options = {
    method,
    headers: { "Content-Type": "application/json" }
  };

  // Add JSON body only for non-GET requests
  if (method !== "GET" && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Try to parse JSON safely
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text; 
    }
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
};
document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    showMessage('message', 'Please fill in all fields', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('message', 'Please enter a valid email', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('message', 'Password must be at least 6 characters', 'error');
    return;
  }

  try {
    showMessage('message', 'Creating account...', 'info');

    const response = await apiCall('/auth/register', 'POST', {
      name,
      email,
      password,
    });

    showMessage('message', 'Registration successful! Redirecting to login...', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } catch (error) {
    showMessage('message', error.message || 'Registration failed', 'error');
    console.error('Registration Error:', error);
  }
});
})();
