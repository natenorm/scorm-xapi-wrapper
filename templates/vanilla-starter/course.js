/**
 * Course Logic with SCORM Integration
 */

import ScormWrapper from '../../dist/scorm-wrapper.esm.js';

// Course state
let currentPage = 1;
const totalPages = 4;
let userData = {};

/**
 * Initialize course
 */
async function initCourse() {
  try {
    // Initialize SCORM wrapper
    await ScormWrapper.initialize();
    console.log('SCORM wrapper initialized');
    console.log('Environment:', ScormWrapper.getEnvironmentType());

    // Load saved progress
    const savedProgress = await ScormWrapper.getProgress();
    if (savedProgress) {
      console.log('Loaded saved progress:', savedProgress);
      currentPage = savedProgress.currentPage || 1;
      userData = savedProgress.userData || {};
      
      // Restore user data if available
      if (userData.name) {
        const input = document.getElementById('userInput');
        const greeting = document.getElementById('greeting');
        if (input) input.value = userData.name;
        if (greeting) greeting.textContent = `Hello, ${userData.name}!`;
      }
    }

    // Display current page
    showPage(currentPage);
    updateProgress();

    // Setup auto-save every 30 seconds
    setInterval(saveProgress, 30000);

    // Save progress before page unload
    window.addEventListener('beforeunload', saveProgress);

  } catch (error) {
    console.error('Error initializing course:', error);
  }
}

/**
 * Show specific page
 */
function showPage(pageNum) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show current page
  const page = document.querySelector(`[data-page="${pageNum}"]`);
  if (page) {
    page.classList.add('active');
  }

  currentPage = pageNum;

  // Update navigation
  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage === totalPages;
  document.getElementById('pageIndicator').textContent = `Page ${currentPage} of ${totalPages}`;

  // Update progress bar
  const progress = (currentPage / totalPages) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;

  // Save progress when navigating
  saveProgress();
}

/**
 * Next page
 */
window.nextPage = function() {
  if (currentPage < totalPages) {
    showPage(currentPage + 1);
  }
};

/**
 * Previous page
 */
window.previousPage = function() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
};

/**
 * Save progress to LMS
 */
async function saveProgress() {
  try {
    const progressData = {
      currentPage,
      userData,
      timestamp: new Date().toISOString()
    };

    await ScormWrapper.saveProgress(progressData);
    console.log('Progress saved');
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Update progress tracking
 */
function updateProgress() {
  const progress = (currentPage / totalPages) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
}

/**
 * Save user data (example interaction)
 */
window.saveUserData = function() {
  const input = document.getElementById('userInput');
  const greeting = document.getElementById('greeting');
  
  if (input && input.value) {
    userData.name = input.value;
    greeting.textContent = `Hello, ${userData.name}!`;
    saveProgress();
  }
};

/**
 * Complete course
 */
window.completeCourse = async function() {
  try {
    await ScormWrapper.setComplete();
    await ScormWrapper.setScore(100);
    
    const message = document.getElementById('completionMessage');
    message.textContent = '✓ Course completed successfully!';
    message.style.display = 'block';
    
    console.log('Course completed');
  } catch (error) {
    console.error('Error completing course:', error);
  }
};

// Initialize course when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCourse);
} else {
  initCourse();
}

