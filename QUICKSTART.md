# Quickstart

Get up and running with a SCORM course in 5 minutes!

## Create a Course in 5 Steps

### 1. Create Your Project

```bash
npx create-scorm-course my-course
cd my-course
npm install
```

Choose your template:
- **Vanilla** - Plain HTML/CSS/JavaScript (simplest, recommended for beginners)
- **React** - React 18 + Vite
- **Vue** - Vue 3 + Vite

### 2. Start Development Server

```bash
npm run dev
```

Opens your browser at `http://localhost:8080` (vanilla) or `http://localhost:5173` (React/Vue)

The wrapper automatically uses **local storage mode** when not in an LMS, so you can develop and test locally.

### 3. Build Your Course

**Option A: Code it yourself**
- Edit the HTML/CSS/JS files in your project
- Use the SCORM wrapper API (see below)

**Option B: Use Cursor AI**
- Open your project in Cursor
- Tell Cursor what you want (see [CURSOR_AI_GUIDE.md](./CURSOR_AI_GUIDE.md))
- Let AI build it for you!

### 4. Package for LMS

```bash
npm run package
```

Creates `course.zip` - ready to upload to any SCORM 2004 compliant LMS!

### 5. Upload & Test

- Upload `course.zip` to your LMS (Moodle, Canvas, Blackboard, etc.)
- Or test in [SCORM Cloud](https://cloud.scorm.com/) (free account)
- Launch and verify it works!

## Using the SCORM Wrapper

The wrapper provides a simple API for tracking course progress:

```javascript
import ScormWrapper from 'scorm-xapi-wrapper';

// 1. Initialize (call this first!)
await ScormWrapper.initialize();

// 2. Save progress (call this whenever something important happens)
await ScormWrapper.saveProgress({
  currentPage: 3,
  answers: { q1: 'A', q2: 'B', q3: 'C' },
  timeSpent: 300
});

// 3. Load saved progress (for resume functionality)
const savedData = await ScormWrapper.getProgress();
if (savedData) {
  goToPage(savedData.currentPage);
  restoreAnswers(savedData.answers);
}

// 4. Set score (0-100)
await ScormWrapper.setScore(85);

// 5. Mark complete (call only when course is truly finished!)
await ScormWrapper.setComplete(true); // true = passed, false = failed

// 6. Cleanup (called automatically on page unload, but you can call it manually)
await ScormWrapper.terminate();
```

### Check Environment

```javascript
const env = ScormWrapper.getEnvironmentType();
// Returns: 'scorm2004', 'scorm12', 'xapi', or 'local'

if (env === 'local') {
  console.log('Running in local development mode');
}
```

## Common Patterns

### Multi-Page Course

```javascript
let currentPage = 1;
const totalPages = 5;

async function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    await ScormWrapper.saveProgress({ currentPage });
    showPage(currentPage);
  }
}

async function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    await ScormWrapper.saveProgress({ currentPage });
    showPage(currentPage);
  }
}

// On load: resume from saved page
const saved = await ScormWrapper.getProgress();
if (saved && saved.currentPage) {
  currentPage = saved.currentPage;
}
showPage(currentPage);
```

### Quiz with Score

```javascript
const quiz = {
  q1: 'A',
  q2: 'B', 
  q3: 'C'
};

let answers = {};

function submitQuiz() {
  let correct = 0;
  Object.keys(quiz).forEach(q => {
    if (answers[q] === quiz[q]) correct++;
  });
  
  const score = Math.round((correct / Object.keys(quiz).length) * 100);
  const passed = score >= 70;
  
  await ScormWrapper.setScore(score);
  await ScormWrapper.setComplete(passed);
  
  if (passed) {
    showMessage('Congratulations! You passed!');
  } else {
    showMessage('Score too low. Please try again.');
  }
}
```

## Troubleshooting

### "No API found" in LMS

The wrapper is falling back to local storage. Check:
1. Is your LMS SCORM 2004 compliant?
2. Is the course ZIP file properly structured? (manifest at root)
3. Check browser console for specific errors

### Progress not saving

Make sure you:
1. Called `initialize()` before other methods
2. Are calling `saveProgress()` after changes
3. Are passing serializable data (no functions, DOM elements, etc.)

### Course not resuming

1. Check that you're calling `getProgress()` on load
2. Verify the data is being saved (check console logs)
3. In LMS, try "Reset" then relaunch to test fresh state

## Next Steps

- Read [CURSOR_AI_GUIDE.md](./CURSOR_AI_GUIDE.md) for AI-assisted development tips
- See [README.md](./README.md) for full API documentation
- Check out the test courses in `/test-courses` for examples

## Need Help?

- GitHub Issues: [your-repo-url/issues](https://github.com/yourusername/scorm-wrapper/issues)
- Documentation: [README.md](./README.md)

Happy course building! 🎓


