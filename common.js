// API Base URL
const API_BASE_URL = 'http://localhost:3000';

// Message Display Functions
function showMessageCommon(elementId, message, type = 'info') {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
  }
}

function clearMessage(elementId) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.style.display = 'none';
    messageElement.textContent = '';
  }
}

// Local Storage Functions
function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('LocalStorage error:', error);
  }
}

function getLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return null;
  }
}

function removeLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('LocalStorage error:', error);
  }
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API error');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// File to Base64 Conversion
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Logout Function
function logout() {
  removeLocalStorage('userId');
  removeLocalStorage('userEmail');
  removeLocalStorage('adminId');
  removeLocalStorage('selectedDressType');
  window.location.href = 'index.html';
}

// Check Authentication
function checkUserAuth() {
  const userId = getLocalStorage('userId');
  if (!userId) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function checkAdminAuth() {
  const adminId = getLocalStorage('adminId');
  if (!adminId) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Image Preview Handler
function handleImagePreview(inputElement, previewElement) {
  inputElement.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        previewElement.src = event.target.result;
        previewElement.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
}

// Utility: Validate Email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Utility: Debounce
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

console.log('Common.js loaded - API Base URL:', API_BASE_URL);
