/**
 * Design.js - AI Dress Design Generation and Selection
 * Features: AI design generation, preset design selection, localStorage management
 * API Integration: HuggingFace / RapidAPI for image generation
 */

async function generateDesign() {
  const clothFile = document.getElementById("clothInput").files[0];
  const prompt = document.getElementById("designPrompt").value.trim();

  if (!clothFile || !prompt) {
    showMessage("message", "Upload cloth image and enter a prompt", "error");
    return;
  }

  const formData = new FormData();
  formData.append("clothImage", clothFile);
  formData.append("prompt", prompt);

  showMessage("message", "Generating designs... please wait", "info");

  try {
    const response = await fetch("http://localhost:5000/design/generate", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage("message", data.error || "Generation failed", "error");
      return;
    }

    showMessage("message", "Designs generated successfully!", "success");

    document.getElementById("generatedDesignsSection").style.display = "block";
    const grid = document.getElementById("generatedDesignsGrid");
    grid.innerHTML = "";

    const clothName = data.clothName;
    const designId = data.designId;

    data.generatedImages.forEach((img) => {
      const card = document.createElement("div");
      card.classList.add("design-card");

      card.innerHTML = `
        <img src="http://localhost:5000/${img}" class="design-image">
        <p class="cloth-label">Cloth: ${clothName}</p>
        <button class="btn btn-small" onclick="selectGeneratedDress('${img}', '${designId}')">
          Try This Dress
        </button>
      `;

      grid.appendChild(card);
    });

  } catch (error) {
    console.error("Error:", error);
    showMessage("message", "Something went wrong", "error");
  }
}

function selectGeneratedDress(imagePath, designId) {
  localStorage.setItem("selectedDress", imagePath);
  localStorage.setItem("selectedDesignId", designId);
  window.location.href = "tryon.html";
}



// ===== CONFIGURATION =====
// Replace these with your actual API credentials
const AI_CONFIG = {
  // HuggingFace API Option (Free tier available)
  HUGGINGFACE_API_KEY: 'API_KEY', // Get from https://huggingface.co/settings/tokens
  HUGGINGFACE_MODEL: 'runwayml/stable-diffusion-v1-5', // Image generation model
  
  // RapidAPI Option (Alternative)
  RAPIDAPI_KEY: 'RAPIDAPI_KEY', // Get from https://rapidapi.com
  RAPIDAPI_HOST: 'hugging-face-api.p.rapidapi.com',
  
  // API Type to use: 'huggingface' or 'rapidapi'
  API_TYPE: 'huggingface'
};

// Global Variables
let selectedDress = null;
let generatedDesigns = [];
let clothImageBase64 = null;

// Function Declarations
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
  }
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function clearMessage(elementId) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = '';
    messageElement.className = 'message';
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

// ===== TAB NAVIGATION =====
/**
 * Switch between AI Design and Preset Designs tabs
 * @param {string} tabName - Name of the tab to display
 */
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Highlight active button
  event.target.classList.add('active');
}

// ===== IMAGE UPLOAD HANDLER =====
/**
 * Handle cloth image upload and preview
 */
function setupImageUploadHandler() {
  const clothInput = document.getElementById('clothInput');
  const clothPreview = document.getElementById('clothPreview');
  
  if (!clothInput) return;
  
  clothInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showMessage('message', 'File size exceeds 10MB limit', 'error');
        return;
      }
      
      try {
        // Convert to base64 for preview and API
        clothImageBase64 = await fileToBase64(file);
        clothPreview.src = clothImageBase64;
        clothPreview.style.display = 'block';
        clearMessage('message');
      } catch (error) {
        showMessage('message', 'Error reading image file', 'error');
        console.error('File reading error:', error);
      }
    }
  });
}

// ===== AI DESIGN GENERATION =====
/**
 * Generate dress designs using AI API
 * Uses HuggingFace Stable Diffusion model
 */
async function generateDesign() {
  // Validate inputs
  const clothInput = document.getElementById('clothInput');
  const designPrompt = document.getElementById('designPrompt');
  
  if (!clothInput.files.length) {
    showMessage('message', 'Please upload a cloth texture image first', 'error');
    return;
  }
  
  if (!designPrompt.value.trim()) {
    showMessage('message', 'Please enter a design description', 'error');
    return;
  }
  
  const generateBtn = document.getElementById('generateDesignBtn');
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner"></span> Generating designs...';
  
  try {
    showMessage('message', 'Analyzing cloth texture and generating designs... This may take 30-60 seconds.', 'info');
    
    // Create enhanced prompt with cloth texture context
    const enhancedPrompt = createEnhancedPrompt(
      designPrompt.value,
      document.getElementById('dressStyle').value
    );
    
    console.log('[v0] AI Generation started with prompt:', enhancedPrompt);
    
    // Call AI API
    const generatedImages = await callAIDesignAPI(enhancedPrompt);
    
    if (generatedImages && generatedImages.length > 0) {
      displayGeneratedDesigns(generatedImages, designPrompt.value);
      showMessage('message', 'Successfully generated dress designs!', 'success');
    } else {
      showMessage('message', 'No designs generated. Please try again with a different prompt.', 'error');
    }
  } catch (error) {
    console.error('Design generation error:', error);
    showMessage('message', error.message || 'Failed to generate designs. Please check your API key and try again.', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate Designs';
  }
}

/**
 * Create an enhanced prompt with technical details for AI model
 * @param {string} userPrompt - User's design description
 * @param {string} dressStyle - Selected dress style
 * @returns {string} Enhanced prompt for AI model
 */
function createEnhancedPrompt(userPrompt, dressStyle) {
  // Build enhanced prompt with technical keywords for better AI generation
  let prompt = `High-quality professional dress design, ${userPrompt}`;
  
  if (dressStyle) {
    prompt += `, ${dressStyle} style`;
  }
  
  // Add quality modifiers
  prompt += ', detailed fabric texture, realistic lighting, professional photography, studio background, high resolution, 8k';
  
  return prompt;
}

/**
 * Call AI API (HuggingFace or RapidAPI) to generate designs
 * @param {string} prompt - Design prompt
 * @returns {Promise<Array>} Array of generated image URLs
 */
async function callAIDesignAPI(prompt) {
  if (AI_CONFIG.API_TYPE === 'huggingface') {
    return await callHuggingFaceAPI(prompt);
  } else if (AI_CONFIG.API_TYPE === 'rapidapi') {
    return await callRapidAPIDesign(prompt);
  } else {
    throw new Error('Invalid API type configured');
  }
}

/**
 * Call HuggingFace API for image generation (Recommended - Free)
 * @param {string} prompt - Design prompt
 * @returns {Promise<Array>} Array of generated image URLs
 * 
 * Setup Instructions:
 * 1. Go to https://huggingface.co/settings/tokens
 * 2. Create a new token (read permissions only)
 * 3. Replace YOUR_HUGGINGFACE_API_KEY_HERE with your token
 */
async function callHuggingFaceAPI(prompt) {
  const apiKey = AI_CONFIG.HUGGINGFACE_API_KEY;
  
  if (apiKey === 'YOUR_HUGGINGFACE_API_KEY_HERE') {
    throw new Error(
      'HuggingFace API key not configured. ' +
      'Please get your API key from https://huggingface.co/settings/tokens and update it in design.js'
    );
  }
  
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${AI_CONFIG.HUGGINGFACE_MODEL}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 7.5
          }
        }),
        timeout: 120000 // 2 minutes timeout for generation
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'HuggingFace API error');
    }
    
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    console.log('[v0] Generated image blob URL:', imageUrl);
    
    // Return single generated image wrapped in array
    // Note: For multiple variations, you would call API multiple times with different seeds
    return [{
      url: imageUrl,
      prompt: prompt
    }];
  } catch (error) {
    console.error('HuggingFace API Error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Call RapidAPI for image generation (Alternative - Requires paid plan)
 * @param {string} prompt - Design prompt
 * @returns {Promise<Array>} Array of generated image URLs
 * 
 * Setup Instructions:
 * 1. Go to https://rapidapi.com
 * 2. Search for "Hugging Face Image Generation"
 * 3. Subscribe to the API and copy your API key
 * 4. Update RAPIDAPI_KEY in AI_CONFIG
 */
async function callRapidAPIDesign(prompt) {
  const apiKey = AI_CONFIG.RAPIDAPI_KEY;
  const apiHost = AI_CONFIG.RAPIDAPI_HOST;
  
  if (apiKey === 'YOUR_RAPIDAPI_KEY_HERE') {
    throw new Error(
      'RapidAPI key not configured. ' +
      'Get your key from https://rapidapi.com and update it in design.js'
    );
  }
  
  try {
    const response = await fetch(
      'https://hugging-face-api.p.rapidapi.com/image-generation',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        },
        body: JSON.stringify({
          prompt: prompt,
          size: '512x512'
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.images && data.images.length > 0) {
      return data.images.map((img, index) => ({
        url: img.url || img,
        prompt: prompt
      }));
    }
    
    throw new Error('No images generated');
  } catch (error) {
    console.error('RapidAPI Error:', error);
    throw new Error(`Design generation API failed: ${error.message}`);
  }
}

// ===== DISPLAY GENERATED DESIGNS =====
/**
 * Display generated designs in grid
 * @param {Array} images - Array of generated image objects
 * @param {string} originalPrompt - Original user prompt
 */
function displayGeneratedDesigns(images, originalPrompt) {
  const grid = document.getElementById('generatedDesignsGrid');
  const section = document.getElementById('generatedDesignsSection');
  
  grid.innerHTML = ''; // Clear previous designs
  generatedDesigns = images; // Store for later selection
  
  images.forEach((design, index) => {
    const card = document.createElement('div');
    card.className = 'generated-design-card';
    
    card.innerHTML = `
      <img src="${design.url}" alt="Generated dress ${index + 1}" class="generated-design-image">
      <div class="generated-design-info">
        <div class="generated-design-title">Design #${index + 1}</div>
        <div class="generated-design-prompt">${originalPrompt}</div>
        <div class="generated-design-actions">
          <button class="btn-select-design" onclick="selectGeneratedDesign(${index})">Select & Try-On</button>
          <button class="btn-view-design" onclick="viewDesignFullscreen(${index})">View</button>
        </div>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  section.style.display = 'block';
  
  // Scroll to designs
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 500);
}

// ===== DESIGN SELECTION =====
/**
 * Select a generated design and navigate to try-on
 * @param {number} designIndex - Index of design in generatedDesigns array
 */
function selectGeneratedDesign(designIndex) {
  const selectedDesign = generatedDesigns[designIndex];
  
  // Save selected design to localStorage
  const designData = {
    source: 'generated',
    imageUrl: selectedDesign.url,
    prompt: selectedDesign.prompt,
    timestamp: new Date().toISOString()
  };
  
  setLocalStorage('selectedDesign', designData);
  showMessage('message', 'Design selected! Redirecting to try-on page...', 'success');
  
  setTimeout(() => {
    window.location.href = 'tryon.html';
  }, 1000);
}

/**
 * Select a preset dress style
 * @param {string} dressType - Type of dress (saree, kurti, gown, etc.)
 */
function selectPresetDress(dressType) {
  // Remove previous selection
  document.querySelectorAll('.dress-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selection to clicked card
  event.currentTarget.classList.add('selected');
  selectedDress = dressType;
  
  // Save to localStorage
  setLocalStorage('selectedDressType', dressType);
  
  console.log('[v0] Selected preset dress type:', dressType);
}

/**
 * Continue to try-on with selected design
 */
function continueTryOn() {
  if (!selectedDress) {
    showMessage('message', 'Please select a dress style first', 'error');
    return;
  }
  
  // Save selected dress type
  setLocalStorage('selectedDressType', selectedDress);
  
  // Redirect to try-on page
  window.location.href = 'tryon.html';
}

// ===== FULLSCREEN PREVIEW =====
/**
 * View design in fullscreen modal
 * @param {number} designIndex - Index of design
 */
function viewDesignFullscreen(designIndex) {
  const design = generatedDesigns[designIndex];
  
  // Create and show modal
  let modal = document.getElementById('designModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'designModal';
    modal.className = 'design-modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="design-modal-content">
      <button class="design-modal-close" onclick="closeDesignModal()">✕</button>
      <img src="${design.url}" alt="Design preview" class="design-modal-image">
      <div class="design-modal-info">
        <h2>Design Preview</h2>
        <p><strong>Prompt:</strong> ${design.prompt}</p>
        <button class="btn" onclick="selectGeneratedDesign(${designIndex})" style="width: 100%; margin-top: 20px;">
          Select & Continue to Try-On
        </button>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Close design fullscreen modal
 */
function closeDesignModal() {
  const modal = document.getElementById('designModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// ===== PAGE INITIALIZATION =====
/**
 * Initialize design page on load
 */
window.addEventListener('load', function () {
  console.log('[v0] Design page initialized');
  
  // Setup image upload handler
  setupImageUploadHandler();
  
  // Load previously selected dress
  const savedDressType = getLocalStorage('selectedDressType');
  if (savedDressType) {
    selectedDress = savedDressType;
    
    // Highlight previously selected card in preset designs
    document.querySelectorAll('.dress-card').forEach((card, index) => {
      const types = ['saree', 'kurti', 'gown', 'western', 'lehenga'];
      if (types.includes(savedDressType)) {
        const cardType = card.querySelector('.dress-card-label').textContent.toLowerCase();
        if (cardType.includes(savedDressType)) {
          card.classList.add('selected');
        }
      }
    });
  }
  
  // Check if user is logged in
  const userEmail = getLocalStorage('userEmail');
  if (userEmail) {
    const userNameElement = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    if (userNameElement && logoutBtn) {
      userNameElement.textContent = `Welcome, ${userEmail.split('@')[0]}`;
      userNameElement.style.display = 'inline';
      logoutBtn.style.display = 'inline-block';
    }
  }
});
