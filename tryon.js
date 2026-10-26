/**
 * TryOn.js - Virtual Try-On Page
 * Features: Person image upload, dress image upload, try-on preview generation
 * Integrates with design.js for selected design data
 */

let personImageBase64 = null;
let clothImageBase64 = null;
let selectedDesign = null;

// ===== IMAGE UPLOAD HANDLERS =====
/**
 * Handle person image upload and preview
 */
function setupPersonImageUpload() {
  const personInput = document.getElementById('personInput');
  const personPreview = document.getElementById('personPreview');
  
  if (!personInput) return;
  
  personInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (file) {
      try {
        personImageBase64 = await fileToBase64(file);
        personPreview.src = personImageBase64;
        personPreview.style.display = 'block';
        clearMessage('message');
        console.log('[v0] Person image uploaded and converted to base64');
      } catch (error) {
        showMessage('message', 'Error reading image file', 'error');
        console.error('Image upload error:', error);
      }
    }
  });
}

/**
 * Handle cloth/dress image upload and preview
 */
function setupClothImageUpload() {
  const clothInput = document.getElementById('clothInput');
  const clothPreview = document.getElementById('clothPreview');
  
  if (!clothInput) return;
  
  clothInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (file) {
      try {
        clothImageBase64 = await fileToBase64(file);
        clothPreview.src = clothImageBase64;
        clothPreview.style.display = 'block';
        clearMessage('message');
        console.log('[v0] Cloth image uploaded and converted to base64');
      } catch (error) {
        showMessage('message', 'Error reading image file', 'error');
        console.error('Image upload error:', error);
      }
    }
  });
}

// ===== TRY-ON GENERATION =====
/**
 * Generate virtual try-on preview
 * Sends person image and cloth image to backend API
//  */
// async function generateTryOn() {
//   // Validate inputs
//   if (!personImageBase64) {
//     showMessage('message', 'Please upload a person image', 'error');
//     return;
//   }

//   // Check if cloth image is provided or use selected design
//   let clothSource = null;
  
//   if (clothImageBase64) {
//     clothSource = clothImageBase64;
//   } else if (selectedDesign && selectedDesign.imageUrl) {
//     clothSource = selectedDesign.imageUrl;
//   } else {
//     showMessage('message', 'Please upload a cloth image or select a design from the Design page', 'error');
//     return;
//   }

//   const dressType = getLocalStorage('selectedDressType') || 'custom';

//   try {
//     const generateBtn = document.getElementById('generateBtn');
//     generateBtn.disabled = true;
//     generateBtn.innerHTML = '<span class="spinner"></span> Generating...';

//     showMessage('message', 'Generating your try-on preview... This may take a moment.', 'info');

//     console.log('[v0] Try-on generation started');
//     console.log('[v0] Dress type:', dressType);

//     // Call backend API to generate try-on
//     const response = await apiCall('/vto/generate', 'POST', {
//       personImage: personImageBase64,
//       clothImage: clothSource,
//       dressType,
//     });

//     // Display the generated image
//     const previewContainer = document.getElementById('previewContainer');
//     previewContainer.innerHTML = `<img src="${response.previewImage}" class="preview-image" alt="Try-on preview">`;

//     showMessage('message', 'Try-on preview generated successfully!', 'success');
//     console.log('[v0] Try-on preview generated successfully');
//   } catch (error) {
//     showMessage('message', error.message || 'Failed to generate try-on. Please try again.', 'error');
//     console.error('[v0] Try-On Error:', error);
//   } finally {
//     const generateBtn = document.getElementById('generateBtn');
//     generateBtn.disabled = false;
//     generateBtn.textContent = 'Generate Try-On';
//   }
// }

// // ===== PAGE INITIALIZATION =====
// /**
//  * Initialize try-on page on load
//  * Load selected design from design.html if available
//  */
// window.addEventListener('load', function () {
//   console.log('[v0] Try-On page initialized');
  
//   // Setup image upload handlers
//   setupPersonImageUpload();
//   setupClothImageUpload();
  
//   // Load selected design from localStorage (from design.html)
//   selectedDesign = getLocalStorage('selectedDesign');
//   const dressType = getLocalStorage('selectedDressType');
  
//   console.log('[v0] Selected design from localStorage:', selectedDesign);
//   console.log('[v0] Dress type:', dressType);
  
//   if (!dressType && !selectedDesign) {
//     showMessage('message', 'No design selected. Please select a dress style from the Design page first.', 'info');
//   }
  
//   // Display helpful message if design was selected
//   if (selectedDesign) {
//     showMessage('message', `Design loaded from AI Generator. You can also upload a cloth image to replace it.`, 'info');
//   }
  
//   // Check if user is logged in
//   const userEmail = getLocalStorage('userEmail');
//   if (userEmail) {
//     const userNameElement = document.getElementById('userName');
//     const logoutBtn = document.getElementById('logoutBtn');
//     if (userNameElement && logoutBtn) {
//       userNameElement.textContent = `Welcome, ${userEmail.split('@')[0]}`;
//       userNameElement.style.display = 'inline';
//       logoutBtn.style.display = 'inline-block';
//     }
//   }
// });

// ===== UTILITY FUNCTIONS =====
/**
 * Convert file to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Show message to user
 */
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
  }
}

/**
 * Clear message from user
 */
function clearMessage(elementId) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.style.display = 'none';
  }
}

/**
 * Get value from localStorage
 */
function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error('Error parsing localStorage value:', error);
    return null;
  }
}

/**
 * Call backend API
 */
function apiCall(url, method, data) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
}
