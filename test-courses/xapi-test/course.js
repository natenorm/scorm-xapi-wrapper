import ScormWrapper from './scorm-wrapper.esm.js';

// Course state
const courseData = {
    currentPage: 1,
    totalPages: 5,
    visitedPages: [1],
    quizAnswers: {},
    quizScore: null,
    quizGraded: false,
    completed: false,
    interactions: [],
    statementCount: 0
};

// Initialize the wrapper
console.log('[Course] Initializing...');
console.log('[Course] Initial courseData:', courseData);

// xAPI configuration (these would typically come from your LMS/LRS)
const xapiConfig = {
    endpoint: 'https://cloud.scorm.com/lrs/your-endpoint',
    auth: 'Basic your-auth-token',
    actor: {
        name: 'Test User',
        mbox: 'mailto:test@example.com'
    }
};

const wrapper = new ScormWrapper();
wrapper.initialize();

console.log('[Course] Wrapper initialized');
const envType = wrapper.getEnvironmentType();
console.log('[Course] Environment type:', envType);

// Load saved data
const savedData = wrapper.getProgress();
console.log('[Course] Loaded saved data:', savedData);
if (savedData && Object.keys(savedData).length > 0) {
    console.log('[Course] Resuming from saved data - currentPage:', savedData.currentPage);
    console.log('[Course] Before merge, courseData.currentPage:', courseData.currentPage);
    Object.assign(courseData, savedData);
    console.log('[Course] After merge, courseData.currentPage:', courseData.currentPage);
}

// Update UI with loaded data
updateUI();
console.log('[Course] About to show page:', courseData.currentPage);
showPage(courseData.currentPage);

// Save progress
wrapper.saveProgress(courseData);
console.log('[Course] Initialization complete. Final courseData:', courseData);

// Send initial statement
sendStatement('experienced', 'Launched the xAPI test course');

// Update debug panel
updateDebugPanel();

// Navigation functions
window.nextPage = function() {
    if (courseData.currentPage < courseData.totalPages) {
        // If on quiz page and not graded, don't allow next
        if (courseData.currentPage === 4 && !courseData.quizGraded) {
            alert('Please submit the quiz before continuing.');
            return;
        }
        
        courseData.currentPage++;
        if (!courseData.visitedPages.includes(courseData.currentPage)) {
            courseData.visitedPages.push(courseData.currentPage);
        }
        showPage(courseData.currentPage);
        wrapper.saveProgress(courseData);
        console.log('[Course] Progress saved:', courseData);
        
        // Send page view statement
        sendStatement('experienced', `Viewed page ${courseData.currentPage}`);
        
        // Check if reached final page
        if (courseData.currentPage === courseData.totalPages && !courseData.completed) {
            completeCourse();
        }
        
        updateDebugPanel();
    }
};

window.prevPage = function() {
    if (courseData.currentPage > 1) {
        courseData.currentPage--;
        showPage(courseData.currentPage);
        wrapper.saveProgress(courseData);
        console.log('[Course] Progress saved (prev):', courseData);
        
        // Send page view statement
        sendStatement('experienced', `Viewed page ${courseData.currentPage}`);
        
        updateDebugPanel();
    }
};

function showPage(pageNum) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show current page
    const currentPageElement = document.getElementById(`page${pageNum}`);
    if (currentPageElement) {
        currentPageElement.style.display = 'block';
    }
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = pageNum === 1;
    document.getElementById('nextBtn').disabled = pageNum === courseData.totalPages;
    
    // Update page counter
    document.getElementById('currentPage').textContent = pageNum;
    
    // Update progress bar
    const progress = (courseData.visitedPages.length / courseData.totalPages) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // If on results page, show results
    if (pageNum === 5) {
        showFinalResults();
    }
}

function updateUI() {
    document.getElementById('totalPages').textContent = courseData.totalPages;
}

// Interaction tracking
window.trackInteraction = function(interactionType) {
    courseData.interactions.push({
        type: interactionType,
        timestamp: new Date().toISOString()
    });
    
    // Send interaction statement
    const verbs = {
        'watched-video': 'watched',
        'read-article': 'read',
        'listened-audio': 'listened',
        'downloaded-resource': 'downloaded'
    };
    
    const objects = {
        'watched-video': 'instructional video',
        'read-article': 'course article',
        'listened-audio': 'audio content',
        'downloaded-resource': 'course resource'
    };
    
    sendStatement(
        verbs[interactionType] || 'interacted',
        objects[interactionType] || 'content'
    );
    
    // Show feedback
    const feedback = document.getElementById('interactionFeedback');
    feedback.style.display = 'block';
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
    
    wrapper.saveProgress(courseData);
    updateDebugPanel();
};

// Quiz functions
window.gradeQuiz = function() {
    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value,
        q2: document.querySelector('input[name="q2"]:checked')?.value,
        q3: document.querySelector('input[name="q3"]:checked')?.value,
        q4: document.querySelector('input[name="q4"]:checked')?.value,
        q5: document.querySelector('input[name="q5"]:checked')?.value
    };
    
    // Check if all questions answered
    if (Object.values(answers).some(val => !val)) {
        alert('Please answer all questions before submitting.');
        return;
    }
    
    courseData.quizAnswers = answers;
    
    // Correct answers
    const correctAnswers = {
        q1: 'A', // Experience API
        q2: 'B', // Learning Record Store
        q3: 'C', // JSON
        q4: 'B', // Actor
        q5: 'B'  // completed
    };
    
    // Calculate score
    let correct = 0;
    for (let q in correctAnswers) {
        if (answers[q] === correctAnswers[q]) {
            correct++;
        }
        
        // Send answer statement for each question
        sendStatement(
            'answered',
            `Question ${q}`,
            {
                success: answers[q] === correctAnswers[q],
                response: answers[q]
            }
        );
    }
    
    courseData.quizScore = Math.round((correct / 5) * 100);
    courseData.quizGraded = true;
    
    // Report score to LRS
    wrapper.setScore(courseData.quizScore, 0, 100);
    sendStatement('scored', 'Quiz', {
        score: {
            scaled: correct / 5,
            raw: correct,
            min: 0,
            max: 5
        }
    });
    
    // Show results
    const resultsDiv = document.getElementById('quizResults');
    const passed = courseData.quizScore >= 80;
    resultsDiv.innerHTML = `
        <h3>${passed ? '✅ Passed!' : '❌ Not Passed'}</h3>
        <p>You scored <strong>${courseData.quizScore}%</strong> (${correct} out of 5 correct)</p>
        <p>${passed ? 'Great job! You can continue to the next page.' : 'You need 80% to pass. Review the material and try again.'}</p>
    `;
    resultsDiv.style.display = 'block';
    
    // Save progress
    wrapper.saveProgress(courseData);
    console.log('[Course] Quiz graded. Score:', courseData.quizScore);
    
    updateDebugPanel();
};

function completeCourse() {
    courseData.completed = true;
    
    // Mark as complete in wrapper
    wrapper.setComplete();
    
    // Send completion statement
    sendStatement('completed', 'xAPI Test Course', {
        duration: 'PT5M', // ISO 8601 duration (example: 5 minutes)
        success: courseData.quizScore >= 80
    });
    
    wrapper.saveProgress(courseData);
    console.log('[Course] Course completed!');
    
    updateDebugPanel();
}

function showFinalResults() {
    const resultsDiv = document.getElementById('finalResults');
    const passed = courseData.quizScore >= 80;
    
    resultsDiv.innerHTML = `
        <h3>${passed ? '🎉 Congratulations!' : '📝 Course Complete'}</h3>
        <p><strong>Final Score:</strong> ${courseData.quizScore}%</p>
        <p><strong>Status:</strong> ${passed ? 'Passed ✅' : 'Not Passed ❌'}</p>
        <p><strong>Pages Visited:</strong> ${courseData.visitedPages.length} of ${courseData.totalPages}</p>
        <p><strong>Interactions Tracked:</strong> ${courseData.interactions.length}</p>
        <p><strong>Statements Sent:</strong> ${courseData.statementCount}</p>
    `;
}

// xAPI statement helper
function sendStatement(verb, objectName, context = {}) {
    const statement = {
        actor: xapiConfig.actor,
        verb: {
            id: `http://adlnet.gov/expapi/verbs/${verb}`,
            display: { 'en-US': verb }
        },
        object: {
            id: `https://example.com/course/xapi-test/${objectName.replace(/\s+/g, '-').toLowerCase()}`,
            definition: {
                name: { 'en-US': objectName },
                type: 'http://adlnet.gov/expapi/activities/course'
            }
        },
        timestamp: new Date().toISOString()
    };
    
    // Add context if provided
    if (Object.keys(context).length > 0) {
        statement.result = context;
    }
    
    courseData.statementCount++;
    
    console.log('[xAPI] Statement:', statement);
    
    // Add to statements list in UI
    addStatementToUI(verb, objectName);
    
    // In a real LRS environment, this would send via HTTP:
    // fetch(xapiConfig.endpoint + '/statements', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': xapiConfig.auth,
    //         'Content-Type': 'application/json',
    //         'X-Experience-API-Version': '1.0.3'
    //     },
    //     body: JSON.stringify(statement)
    // });
    
    return statement;
}

function addStatementToUI(verb, object) {
    const statementsList = document.getElementById('statementsList');
    
    // Remove "no statements" message
    const noStatements = statementsList.querySelector('.no-statements');
    if (noStatements) {
        noStatements.remove();
    }
    
    // Add new statement (keep last 5)
    const statementItem = document.createElement('div');
    statementItem.className = 'statement-item';
    statementItem.innerHTML = `
        <span class="statement-verb">${verb}</span>
        <span class="statement-object">${object}</span>
        <span class="statement-time">${new Date().toLocaleTimeString()}</span>
    `;
    
    statementsList.insertBefore(statementItem, statementsList.firstChild);
    
    // Keep only last 5 statements
    while (statementsList.children.length > 5) {
        statementsList.removeChild(statementsList.lastChild);
    }
}

function updateDebugPanel() {
    document.getElementById('debugEnv').textContent = envType || 'local';
    document.getElementById('debugInit').textContent = 'Yes ✅';
    document.getElementById('debugPage').textContent = courseData.currentPage;
    document.getElementById('debugScore').textContent = 
        courseData.quizScore !== null ? `${courseData.quizScore}%` : 'Not taken';
    document.getElementById('debugComplete').textContent = courseData.completed ? 'Yes ✅' : 'No';
    document.getElementById('debugStatements').textContent = courseData.statementCount;
}

