# SCORM/xAPI Wrapper - Quick Reference

## Installation

```bash
# In your course project
npm install /path/to/scorm-xapi-wrapper
```

## Basic Usage

```javascript
import ScormWrapper from 'scorm-xapi-wrapper';

// Initialize
await ScormWrapper.initialize();

// Save any data
await ScormWrapper.saveProgress({ 
  page: 5, 
  score: 80, 
  answers: {...} 
});

// Load data
const progress = await ScormWrapper.getProgress();

// Mark complete
await ScormWrapper.setComplete();
await ScormWrapper.setScore(85);

// Cleanup
await ScormWrapper.terminate();
```

## API Methods

| Method | Description | Example |
|--------|-------------|---------|
| `initialize()` | Connect to LMS | `await ScormWrapper.initialize()` |
| `saveProgress(data)` | Save any JSON data | `await ScormWrapper.saveProgress({ page: 5 })` |
| `getProgress()` | Load saved data | `const data = await ScormWrapper.getProgress()` |
| `setComplete()` | Mark course complete | `await ScormWrapper.setComplete()` |
| `setScore(score)` | Set score (0-100) | `await ScormWrapper.setScore(85)` |
| `terminate()` | Close connection | `await ScormWrapper.terminate()` |
| `getEnvironmentType()` | Get environment | `const env = ScormWrapper.getEnvironmentType()` |
| `isInitialized()` | Check if ready | `if (ScormWrapper.isInitialized()) {...}` |

## CLI Commands

### Create New Course

```bash
# Copy template manually
cp -r templates/vanilla-starter my-course

# Or use CLI (if installed globally)
create-scorm-course my-course
```

### Package Course

```bash
package-scorm -i ./dist -o course.zip --title "My Course"
```

Options:
- `-i, --input <dir>` - Input directory (required)
- `-o, --output <file>` - Output file (default: course.zip)
- `-t, --title <title>` - Course title
- `-d, --description <text>` - Course description
- `--id <id>` - Course identifier

## Templates

### Vanilla JavaScript

```bash
cd templates/vanilla-starter
npm install
npm run dev       # Start dev server
npm run build     # Build for production
npm run package   # Create SCORM package
```

**Files to edit:**
- `index.html` - Course content
- `styles.css` - Styling
- `course.js` - Logic

### React

```bash
cd templates/react-starter
npm install
npm run dev       # http://localhost:5173
npm run build
npm run package
```

**Files to edit:**
- `src/App.jsx` - Main component
- `src/pages/` - Add course pages
- `src/styles.css` - Global styles

### Vue

```bash
cd templates/vue-starter
npm install
npm run dev       # http://localhost:5173
npm run build
npm run package
```

**Files to edit:**
- `src/App.vue` - Main component
- `src/pages/` - Add course pages
- `src/styles.css` - Global styles

## Common Patterns

### Auto-Save Progress

```javascript
// Initialize
await ScormWrapper.initialize();

// Load saved progress
const saved = await ScormWrapper.getProgress();
if (saved) {
  currentPage = saved.page;
}

// Auto-save every 30 seconds
setInterval(() => {
  ScormWrapper.saveProgress({ 
    page: currentPage 
  });
}, 30000);

// Save on page change
function goToPage(num) {
  currentPage = num;
  ScormWrapper.saveProgress({ page: num });
}
```

### Quiz Tracking

```javascript
// Save answers
const answers = { q1: 'A', q2: 'B', q3: 'C' };
await ScormWrapper.saveProgress({ answers });

// Calculate and set score
const score = calculateScore(answers);
await ScormWrapper.setScore(score);

// Mark complete if passed
if (score >= 70) {
  await ScormWrapper.setComplete();
}
```

### Video Progress

```javascript
video.addEventListener('timeupdate', () => {
  ScormWrapper.saveProgress({
    videoTime: video.currentTime,
    videoDuration: video.duration
  });
});

// Resume video position
const progress = await ScormWrapper.getProgress();
if (progress?.videoTime) {
  video.currentTime = progress.videoTime;
}
```

### Multi-Page Course

```javascript
const pages = ['intro', 'lesson1', 'lesson2', 'quiz', 'complete'];
let currentPage = 0;

// Load progress
const saved = await ScormWrapper.getProgress();
if (saved?.currentPage) {
  currentPage = saved.currentPage;
}

// Navigation
function nextPage() {
  currentPage++;
  showPage(pages[currentPage]);
  ScormWrapper.saveProgress({ currentPage });
}

// Completion
function completeCourse() {
  ScormWrapper.setComplete();
  ScormWrapper.setScore(100);
}
```

## Environment Types

| Type | When | Uses |
|------|------|------|
| `scorm2004` | In SCORM LMS | SCORM 2004 API |
| `xapi` | In xAPI LRS | xAPI statements |
| `local` | Local development | localStorage |

Check environment:
```javascript
const env = ScormWrapper.getEnvironmentType();
console.log('Running in:', env);
```

## Data Limits

**SCORM 2004:** 64KB for `suspend_data`
- Keep data minimal
- Don't store large objects
- JSON is automatically serialized

**xAPI:** Flexible, depends on LRS
- Generally no strict limits
- State API used for storage

## Testing Checklist

- [ ] Test locally (localStorage mode)
- [ ] Test save progress
- [ ] Test resume functionality
- [ ] Test completion
- [ ] Test in target LMS
- [ ] Test on mobile
- [ ] Test in different browsers
- [ ] Check LMS gradebook

## Troubleshooting

**"Wrapper not initialized"**
→ Call `initialize()` first

**Progress not saving**
→ Check console for errors
→ Verify `initialize()` succeeded
→ Ensure data is JSON-serializable

**Can't find SCORM API**
→ Verify LMS supports SCORM 2004
→ Check package structure
→ Test with SCORM Cloud

**Build errors**
→ Run `npm install`
→ Check Node.js version (14+)
→ Clear node_modules, reinstall

## File Structure

```
your-course/
├── dist/              # Built files
├── src/               # Source files
├── package.json       # Dependencies
└── course.zip         # SCORM package (after npm run package)
```

## NPM Scripts (in templates)

```json
{
  "dev": "Start development server",
  "build": "Build production version",
  "package": "Create SCORM ZIP"
}
```

## Browser Console Tips

Check for SCORM logs:
```javascript
// Shows initialization
[Wrapper] Detected environment: scorm2004

// Shows data operations
[SCORM 2004] Progress saved successfully
[SCORM 2004] Course marked as complete
```

## Quick Links

- **Full Documentation:** `README.md`
- **Getting Started Guide:** `GETTING_STARTED.md`
- **Project Overview:** `PROJECT_OVERVIEW.md`
- **Examples:** `examples/vanilla-demo/`
- **Templates:** `templates/`

## Support

Check console logs for detailed error messages and operation status. All wrapper operations log to console for debugging.

---

**Need more details?** See the full README.md for complete documentation.

