// Declare variables before using them
const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API base URL
const checkAdminAuth = () => {
  // Implement your admin authentication check logic here
  return true; // Placeholder return value
};

const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const showMessage = (id, message, type) => {
  const messageElement = document.getElementById(id);
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;
  messageElement.style.display = 'block';
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
};

const apiCall = async (endpoint, method, data = null) => {
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Check admin authentication on page load
window.addEventListener('load', function () {
  if (!checkAdminAuth()) {
    return;
  }
  loadDesigns();
});

// Handle image preview
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
imageInput.addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (file) {
    const base64 = await fileToBase64(file);
    imagePreview.src = base64;
    imagePreview.style.display = 'block';
  }
});

// Handle add design form submission
document.getElementById('addDesignForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value;
  const imageInput = document.getElementById('image');

  if (!title || !category || !imageInput.files[0]) {
    showMessage('message', 'Please fill in all fields', 'error');
    return;
  }

  try {
    showMessage('message', 'Adding design...', 'info');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', imageInput.files[0]);

    const response = await fetch(`${API_BASE_URL}/admin/design/add`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add design');
    }

    const result = await response.json();

    showMessage('message', 'Design added successfully!', 'success');
    
    // Reset form
    document.getElementById('addDesignForm').reset();
    imagePreview.style.display = 'none';

    // Reload designs
    setTimeout(() => {
      loadDesigns();
    }, 1000);
  } catch (error) {
    showMessage('message', error.message || 'Failed to add design', 'error');
    console.error('Add Design Error:', error);
  }
});

// Load all designs
async function loadDesigns() {
  try {
    const response = await apiCall('/admin/design/all', 'GET');
    const designs = response.designs || [];

    const designList = document.getElementById('designList');

    if (designs.length === 0) {
      designList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">No designs added yet</p>';
      return;
    }

    designList.innerHTML = designs
      .map(
        design => `
      <div class="design-card">
        <img src="${design.imageUrl}" alt="${design.title}" class="design-card-image">
        <div class="design-card-content">
          <div class="design-card-title">${design.title}</div>
          <div class="design-card-category">${design.category}</div>
          <div class="design-card-actions">
            <button class="btn-delete" onclick="deleteDesign('${design._id}')">Delete</button>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  } catch (error) {
    console.error('Load Designs Error:', error);
    const designList = document.getElementById('designList');
    designList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Failed to load designs</p>';
  }
}

// Delete design
async function deleteDesign(designId) {
  if (!confirm('Are you sure you want to delete this design?')) {
    return;
  }

  try {
    showMessage('message', 'Deleting design...', 'info');

    const response = await apiCall(`/admin/design/${designId}`, 'DELETE');

    showMessage('message', 'Design deleted successfully!', 'success');

    // Reload designs
    setTimeout(() => {
      loadDesigns();
    }, 1000);
  } catch (error) {
    showMessage('message', error.message || 'Failed to delete design', 'error');
    console.error('Delete Design Error:', error);
  }
}
