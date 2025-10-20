import ScormWrapper from './scorm-wrapper.esm.js';

// Course state
const courseData = {
  currentPage: 1,
  totalPages: 5,
  visitedPages: [1],
  quizAnswers: {},
  quizScore: null,
  quizGraded: false,
  completed: false
};

// Quiz answer key
const quizAnswerKey = {
  q1: 'A', // SCORM = Sharable Content Object Reference Model
  q2: 'B', // suspend_data stores custom data
  q3: 'B', // API_1484_11 is SCORM 2004 API name
  q4: 'B', // ZIP file with imsmanifest.xml
  q5: 'B'  // success_status = passed/failed
};

// Initialize course
async function initCourse() {
  try {
    console.log('[Course] Initializing...');
    console.log('[Course] Initial courseData:', JSON.stringify(courseData));
    
    // Initialize SCORM wrapper
    await ScormWrapper.initialize();
    console.log('[Course] Wrapper initialized');
    
    // Update debug panel
    const envType = ScormWrapper.getEnvironmentType();
    document.getElementById('envType').textContent = envType;
    document.getElementById('envType').className = envType === 'local' ? 'env-local' : 'env-scorm';
    console.log('[Course] Environment type:', envType);
    
    // Load any saved progress
    const savedData = await ScormWrapper.getProgress();
    console.log('[Course] Loaded saved data:', savedData);
    
    if (savedData && savedData.currentPage) {
      console.log('[Course] Resuming from saved data - currentPage:', savedData.currentPage);
      console.log('[Course] Before merge, courseData.currentPage:', courseData.currentPage);
      Object.assign(courseData, savedData);
      console.log('[Course] After merge, courseData.currentPage:', courseData.currentPage);
      
      // Restore quiz answers if any
      if (savedData.quizAnswers) {
        Object.keys(savedData.quizAnswers).forEach(question => {
          const radio = document.querySelector(`input[name="${question}"][value="${savedData.quizAnswers[question]}"]`);
          if (radio) radio.checked = true;
        });
      }
    } else {
      console.log('[Course] Starting fresh - no saved data found');
    }
    
    // Show current page
    console.log('[Course] About to show page:', courseData.currentPage);
    showPage(courseData.currentPage);
    
    console.log('[Course] Initialization complete. Final courseData:', JSON.stringify(courseData));
  } catch (error) {
    console.error('[Course] Initialization error:', error);
    alert('Failed to initialize course: ' + error.message);
  }
}

// Show specific page
function showPage(pageNum) {
  courseData.currentPage = pageNum;
  
  // Track visited pages
  if (!courseData.visitedPages.includes(pageNum)) {
    courseData.visitedPages.push(pageNum);
  }
  
  // Get template and clone it
  const template = document.getElementById(`page${pageNum}`);
  const content = document.getElementById('content');
  content.innerHTML = '';
  content.appendChild(template.content.cloneNode(true));
  
  // Update progress bar
  const progress = (courseData.visitedPages.length / courseData.totalPages) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  document.getElementById('progressText').textContent = `Page ${pageNum} of ${courseData.totalPages}`;
  
  // Update navigation buttons
  document.getElementById('prevBtn').style.display = pageNum === 1 ? 'none' : 'inline-block';
  document.getElementById('nextBtn').style.display = pageNum === courseData.totalPages ? 'none' : 'inline-block';
  
  // Show complete button on last page if quiz is graded
  const completeBtn = document.getElementById('completeBtn');
  if (pageNum === courseData.totalPages && courseData.quizGraded) {
    completeBtn.style.display = 'inline-block';
    updateFinalPage();
  } else {
    completeBtn.style.display = 'none';
  }
  
  // If on quiz page, restore answers
  if (pageNum === 4 && courseData.quizAnswers) {
    setTimeout(() => {
      Object.keys(courseData.quizAnswers).forEach(question => {
        const radio = document.querySelector(`input[name="${question}"][value="${courseData.quizAnswers[question]}"]`);
        if (radio) radio.checked = true;
      });
      
      if (courseData.quizGraded) {
        showQuizResults();
      }
    }, 10);
  }
  
  // Update debug panel
  updateDebugPanel();
  
  // Save progress
  saveProgress();
}

// Navigate to next page
window.nextPage = function() {
  if (courseData.currentPage < courseData.totalPages) {
    // If leaving quiz page, save answers
    if (courseData.currentPage === 4) {
      saveQuizAnswers();
    }
    showPage(courseData.currentPage + 1);
  }
};

// Navigate to previous page
window.previousPage = function() {
  if (courseData.currentPage > 1) {
    showPage(courseData.currentPage - 1);
  }
};

// Save quiz answers
function saveQuizAnswers() {
  for (let i = 1; i <= 5; i++) {
    const question = `q${i}`;
    const selected = document.querySelector(`input[name="${question}"]:checked`);
    if (selected) {
      courseData.quizAnswers[question] = selected.value;
    }
  }
}

// Grade the quiz
window.gradeQuiz = function() {
  // Save all answers first
  saveQuizAnswers();
  
  // Check if all questions answered
  if (Object.keys(courseData.quizAnswers).length < 5) {
    alert('Please answer all questions before submitting.');
    return;
  }
  
  // Grade quiz
  let correct = 0;
  Object.keys(quizAnswerKey).forEach(question => {
    if (courseData.quizAnswers[question] === quizAnswerKey[question]) {
      correct++;
    }
  });
  
  courseData.quizScore = Math.round((correct / 5) * 100);
  courseData.quizGraded = true;
  
  // Show results
  showQuizResults();
  
  // Save score to SCORM
  ScormWrapper.setScore(courseData.quizScore);
  
  // Save progress
  saveProgress();
  
  console.log(`[Course] Quiz graded: ${correct}/5 correct = ${courseData.quizScore}%`);
};

// Show quiz results
function showQuizResults() {
  const resultsDiv = document.getElementById('quizResults');
  if (!resultsDiv) return;
  
  const passed = courseData.quizScore >= 70;
  resultsDiv.style.display = 'block';
  resultsDiv.className = passed ? 'quiz-results success' : 'quiz-results failure';
  resultsDiv.innerHTML = `
    <h3>${passed ? '✅ Passed!' : '❌ Failed'}</h3>
    <p><strong>Your Score:</strong> ${courseData.quizScore}% (${Math.round(courseData.quizScore / 20)}/5 correct)</p>
    <p>${passed ? 'Great job! You can now proceed to complete the course.' : 'You need 70% or higher to pass. Please review the material and try again.'}</p>
  `;
}

// Update final page with results
function updateFinalPage() {
  const finalScore = document.getElementById('finalScore');
  const finalStatus = document.getElementById('finalStatus');
  
  if (finalScore && courseData.quizScore !== null) {
    const passed = courseData.quizScore >= 70;
    finalScore.textContent = `${courseData.quizScore}%`;
    finalStatus.textContent = passed ? '✅ Passed' : '❌ Failed (< 70%)';
    finalStatus.className = passed ? 'status-passed' : 'status-failed';
  }
}

// Complete the course
window.completeCourse = async function() {
  if (!courseData.quizGraded) {
    alert('Please complete the quiz first!');
    showPage(4);
    return;
  }
  
  if (courseData.completed) {
    alert('Course already completed!');
    return;
  }
  
  try {
    const passed = courseData.quizScore >= 70;
    
    console.log(`[Course] Completing course - Score: ${courseData.quizScore}%, Passed: ${passed}`);
    
    // Mark complete in SCORM with pass/fail status
    await ScormWrapper.setComplete(passed);
    
    courseData.completed = true;
    await saveProgress();
    
    alert(`Course completed!\n\nScore: ${courseData.quizScore}%\nStatus: ${passed ? 'PASSED ✅' : 'FAILED ❌'}\n\nThis data has been sent to your LMS.`);
    
    // Update debug panel
    document.getElementById('debugCompletion').textContent = passed ? '✅ Complete (Passed)' : '✅ Complete (Failed)';
    
  } catch (error) {
    console.error('[Course] Error completing course:', error);
    alert('Error completing course: ' + error.message);
  }
};

// Save progress to SCORM
async function saveProgress() {
  try {
    await ScormWrapper.saveProgress(courseData);
    document.getElementById('debugSaved').textContent = '✅ Yes (just now)';
    console.log('[Course] Progress saved:', courseData);
  } catch (error) {
    console.error('[Course] Error saving progress:', error);
    document.getElementById('debugSaved').textContent = '❌ Error';
  }
}

// Update debug panel
function updateDebugPanel() {
  document.getElementById('debugPage').textContent = courseData.currentPage;
  document.getElementById('debugAnswers').textContent = Object.keys(courseData.quizAnswers).length > 0 
    ? Object.keys(courseData.quizAnswers).map(q => `${q}=${courseData.quizAnswers[q]}`).join(', ')
    : 'None';
  document.getElementById('debugScore').textContent = courseData.quizScore !== null 
    ? `${courseData.quizScore}%` 
    : 'Not taken';
  document.getElementById('debugCompletion').textContent = courseData.completed 
    ? '✅ Complete' 
    : 'Not complete';
}

// Load saved data (for testing)
window.loadSavedData = async function() {
  try {
    const savedData = await ScormWrapper.getProgress();
    if (savedData) {
      alert('Saved Data:\n\n' + JSON.stringify(savedData, null, 2));
    } else {
      alert('No saved data found.');
    }
  } catch (error) {
    alert('Error loading data: ' + error.message);
  }
};

// Clear all data (for testing)
window.clearAllData = async function() {
  if (!confirm('This will clear all progress and reload the course. Continue?')) {
    return;
  }
  
  try {
    // Reset course data
    courseData.currentPage = 1;
    courseData.visitedPages = [1];
    courseData.quizAnswers = {};
    courseData.quizScore = null;
    courseData.quizGraded = false;
    courseData.completed = false;
    
    // Save empty data
    await ScormWrapper.saveProgress(courseData);
    
    // Reload page
    window.location.reload();
  } catch (error) {
    alert('Error clearing data: ' + error.message);
  }
};

// Manual exit (for testing terminate)
window.manualExit = async function() {
  try {
    console.log('[Course] Manual exit requested');
    
    // Save current progress
    await saveProgress();
    
    // Terminate SCORM connection
    await ScormWrapper.terminate();
    
    alert('Progress saved and SCORM session terminated!\n\nYou can now close this window or relaunch to test resume functionality.');
  } catch (error) {
    console.error('[Course] Error during manual exit:', error);
    alert('Error saving: ' + error.message);
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCourse);


