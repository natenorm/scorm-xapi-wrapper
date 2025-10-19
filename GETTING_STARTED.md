# Getting Started with SCORM/xAPI Wrapper

This guide will help you start building SCORM-compliant e-learning courses quickly.

## What You've Got

This project provides:

1. **Core Library** - A framework-agnostic SCORM/xAPI wrapper
2. **Starter Templates** - Ready-to-use templates for Vanilla JS, React, and Vue
3. **CLI Tools** - Commands to scaffold projects and create SCORM packages
4. **Examples** - Working demos to learn from

## Quick Start Workflows

### Workflow 1: Start from a Template (Easiest)

**Step 1: Create a New Course**

From this directory, copy a template:

```bash
# For Vanilla JavaScript
cp -r templates/vanilla-starter ../my-new-course

# For React
cp -r templates/react-starter ../my-new-course

# For Vue
cp -r templates/vue-starter ../my-new-course
```

**Step 2: Set Up the Course**

```bash
cd ../my-new-course
npm install
```

**Step 3: Develop**

```bash
npm run dev
```

Your course opens in a browser. Edit the files to customize:
- Vanilla: Edit `index.html`, `styles.css`, `course.js`
- React: Edit files in `src/` directory
- Vue: Edit files in `src/` directory

**Step 4: Package for LMS**

```bash
npm run build    # Build production version
npm run package  # Create course.zip
```

Upload `course.zip` to your LMS (Moodle, Canvas, Blackboard, etc.).

---

### Workflow 2: Use the CLI Tool

**Step 1: Install Globally (Optional)**

```bash
npm install -g .
```

**Step 2: Create a Course**

```bash
create-scorm-course my-new-course
# Choose a template: vanilla, react, or vue
```

**Step 3: Develop and Package**

```bash
cd my-new-course
npm install
npm run dev      # Develop
npm run package  # Package
```

---

### Workflow 3: Add to Existing Project

**Step 1: Install the Library**

```bash
npm install /path/to/scorm-xapi-wrapper
```

**Step 2: Import and Use**

```javascript
import ScormWrapper from 'scorm-xapi-wrapper';

async function initCourse() {
  await ScormWrapper.initialize();
  
  // Load saved progress
  const progress = await ScormWrapper.getProgress();
  if (progress) {
    // Resume from where user left off
  }
  
  // Save progress periodically
  setInterval(async () => {
    await ScormWrapper.saveProgress({
      currentPage: getCurrentPage(),
      answers: getAnswers()
    });
  }, 30000);
}

initCourse();
```

**Step 3: Package Your Course**

```bash
npx package-scorm -i ./dist -o course.zip --title "My Course"
```

---

## Understanding the Files

### In Templates

#### Vanilla Template Structure
```
vanilla-starter/
├── index.html          # Main course HTML
├── styles.css          # Course styling
├── course.js           # Course logic + SCORM integration
├── build.js            # Build script
└── package.json        # Dependencies and scripts
```

#### React Template Structure
```
react-starter/
├── src/
│   ├── App.jsx              # Main app component
│   ├── hooks/useScorm.js    # SCORM hook
│   ├── components/          # Reusable components
│   └── pages/               # Course pages
├── index.html
├── vite.config.js
└── package.json
```

#### Vue Template Structure
```
vue-starter/
├── src/
│   ├── App.vue                     # Main app component
│   ├── composables/useScorm.js     # SCORM composable
│   ├── components/                 # Reusable components
│   └── pages/                      # Course pages
├── index.html
├── vite.config.js
└── package.json
```

---

## Key Concepts

### 1. Automatic Environment Detection

The wrapper automatically detects whether it's running in:
- **SCORM 2004 LMS** - Uses SCORM API
- **xAPI LRS** - Uses xAPI statements
- **Local Development** - Uses localStorage

You don't need to change your code for different environments!

### 2. Progress Saving

Save any JSON data:

```javascript
await ScormWrapper.saveProgress({
  currentPage: 5,
  completedLessons: [1, 2, 3],
  quizAnswers: { q1: 'A', q2: 'B' },
  customData: 'anything you want'
});
```

### 3. Resume Functionality

When users return to your course:

```javascript
const progress = await ScormWrapper.getProgress();
if (progress) {
  goToPage(progress.currentPage);
  restoreAnswers(progress.quizAnswers);
}
```

### 4. Completion Tracking

```javascript
// When user finishes
await ScormWrapper.setComplete();
await ScormWrapper.setScore(85);
```

---

## Testing Your Course

### Local Testing

1. Run `npm run dev`
2. Your course uses localStorage (not SCORM)
3. Test save/resume by refreshing the page
4. Check browser console for logs

### LMS Testing

1. Build: `npm run build`
2. Package: `npm run package`
3. Upload `course.zip` to your LMS
4. Launch from LMS and test:
   - Progress saving
   - Resume functionality
   - Completion tracking
   - Score reporting

---

## Common Customizations

### Add More Pages

**Vanilla:**
1. Add a new `<div class="page" data-page="X">` in HTML
2. Update `totalPages` in JavaScript

**React/Vue:**
1. Create a new component in `src/pages/`
2. Import and add to the pages array in `App`

### Change Styling

Edit the CSS/styles file in your template. All templates use standard CSS.

### Add Quiz Functionality

```javascript
// Calculate score
const score = calculateQuizScore(answers);
await ScormWrapper.setScore(score);

// Save answers for review
await ScormWrapper.saveProgress({
  quizAnswers: answers,
  score: score
});
```

### Add Video Tracking

```javascript
video.addEventListener('timeupdate', () => {
  ScormWrapper.saveProgress({
    videoPosition: video.currentTime
  });
});
```

---

## Next Steps

1. **Explore Examples** - Check `examples/vanilla-demo/` for a feature showcase
2. **Read API Docs** - See `README.md` for complete API reference
3. **Check Templates** - Each template has its own README with specifics
4. **Build Your Course** - Start customizing a template for your content!

---

## Need Help?

- Check the main `README.md` for API documentation
- Look at `examples/` for working code
- Review template-specific READMEs
- Open an issue if you find bugs

---

## Tips for Success

1. **Save Often** - Call `saveProgress()` frequently or on a timer
2. **Test Resume** - Always test that your course resumes correctly
3. **Use Console** - Check browser console for SCORM logs
4. **Start Simple** - Begin with a template and modify gradually
5. **Test in LMS** - Don't just test locally, validate in your target LMS

**Happy Course Building!** 🎓

