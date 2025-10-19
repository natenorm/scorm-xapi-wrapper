# SCORM/xAPI Wrapper - Project Overview

## What Is This?

A complete system for building custom e-learning experiences with SCORM 2004 and xAPI tracking. You can create courses using any web technology (HTML/CSS/JS, React, Vue, etc.) and this wrapper handles all the LMS communication automatically.

## The Big Picture

```
┌─────────────────────────────────────────────────────────┐
│  Your Custom E-Learning Content (HTML, React, Vue)      │
│  - Videos, quizzes, interactive lessons, games, etc.    │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ (simple API)
                  ▼
┌─────────────────────────────────────────────────────────┐
│  SCORM/xAPI Wrapper (This Library)                      │
│  - Auto-detects environment                             │
│  - Handles all tracking                                 │
│  - Saves/loads progress                                 │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    [SCORM LMS]         [xAPI LRS]
    (Moodle, Canvas)    (Learning Record Store)
```

## What Problem Does This Solve?

**Without this wrapper:**
- You need to learn complex SCORM APIs
- Different code for SCORM vs xAPI
- Can't test locally without an LMS
- Hard to package content correctly
- Framework-specific implementations

**With this wrapper:**
- Simple, intuitive API
- One codebase for SCORM & xAPI
- Local testing with localStorage
- Easy packaging with CLI tools
- Works with any framework

## Key Features

### 1. Universal API

One simple API works everywhere:

```javascript
await ScormWrapper.initialize();
await ScormWrapper.saveProgress({ page: 5 });
const saved = await ScormWrapper.getProgress();
await ScormWrapper.setComplete();
```

### 2. Smart Environment Detection

Automatically detects and adapts to:
- SCORM 2004 LMS
- xAPI/Tin Can LRS
- Local development (localStorage)

### 3. Complete Workflow Support

- **Development** - Templates and local testing
- **Building** - Framework-agnostic build process
- **Packaging** - CLI tool creates SCORM-compliant ZIPs
- **Deployment** - Upload to any SCORM-compliant LMS

## What's Included?

### 1. Core Library (`/src`)

The heart of the system:
- `wrapper.js` - Main API
- `detector.js` - Environment detection
- `adapters/` - SCORM & xAPI implementations
- `storage.js` - Local development fallback

Built outputs in `/dist`:
- `scorm-wrapper.umd.js` - For `<script>` tags
- `scorm-wrapper.esm.js` - For `import` statements
- `scorm-wrapper.cjs.js` - For Node.js

### 2. CLI Tools (`/tools`)

**package-builder.js**
Creates SCORM-compliant ZIP packages:
```bash
package-scorm -i ./dist -o course.zip --title "My Course"
```

**create-course.js**
Scaffolds new projects from templates:
```bash
create-scorm-course my-course --template react
```

### 3. Starter Templates (`/templates`)

Ready-to-use project templates:

**vanilla-starter/** - Pure HTML/CSS/JavaScript
- Simplest option
- No build complexity
- Perfect for simple courses
- Just edit HTML and run

**react-starter/** - React + Vite
- Modern React with hooks
- Fast development with HMR
- Component-based architecture
- TypeScript-ready

**vue-starter/** - Vue 3 + Vite
- Composition API
- Reactive data binding
- Single-file components
- Modern tooling

### 4. Examples (`/examples`)

**vanilla-demo/** - Interactive feature showcase
- Demonstrates all API methods
- Real-time event logging
- Copy/paste code examples

### 5. Documentation

- **README.md** - Complete API reference
- **GETTING_STARTED.md** - Step-by-step tutorials
- **PROJECT_OVERVIEW.md** - This file!
- Template-specific READMEs

## How It Works

### Architecture

```
┌──────────────────────────────────────────┐
│ Your Course Code                         │
└───────────────┬──────────────────────────┘
                │
                │ ScormWrapper.initialize()
                │ ScormWrapper.saveProgress()
                │ etc.
                ▼
┌──────────────────────────────────────────┐
│ Core Wrapper (wrapper.js)                │
│ - Lifecycle management                   │
│ - Unified API                            │
└───────────────┬──────────────────────────┘
                │
                │ detect()
                ▼
┌──────────────────────────────────────────┐
│ Environment Detector (detector.js)       │
│ - Checks for API_1484_11 (SCORM)        │
│ - Checks for xAPI config                 │
│ - Falls back to localStorage             │
└───────────────┬──────────────────────────┘
                │
     ┌──────────┼──────────┐
     │          │          │
     ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌─────────┐
│ SCORM   │ │ xAPI   │ │ Local   │
│ Adapter │ │ Adapter│ │ Storage │
└────┬────┘ └───┬────┘ └────┬────┘
     │          │           │
     ▼          ▼           ▼
  [LMS]      [LRS]    [localStorage]
```

### Data Flow Example

1. **Initialize:** Wrapper detects environment and creates adapter
2. **Save:** `saveProgress({ page: 5 })` → Adapter translates to SCORM/xAPI
3. **Load:** Adapter retrieves data → Wrapper returns your object
4. **Complete:** Wrapper tells adapter → Sets LMS completion status

## Use Cases

### 1. Simple Interactive Lessons

Build with vanilla HTML/CSS/JS:
- Text and images
- Simple navigation
- Progress tracking
- Completion certificates

### 2. Video-Based Training

React/Vue components:
- Video player with tracking
- Watch time requirements
- Checkpoint questions
- Resume from last position

### 3. Assessment Courses

Quiz functionality:
- Multiple choice questions
- Score calculation
- Retry logic
- Results reporting to LMS

### 4. Simulations & Games

Interactive experiences:
- Custom interactions
- Complex state management
- Performance metrics
- Detailed progress tracking

### 5. Multi-Module Courses

Large course structures:
- Multiple sections
- Prerequisites
- Progress gates
- Comprehensive tracking

## Development Workflow

### Starting a New Course

```bash
# Copy a template
cp -r templates/react-starter ../my-course
cd ../my-course

# Install dependencies
npm install

# Start developing
npm run dev
```

### During Development

```bash
# Run local dev server
npm run dev

# Edit your content
# - Templates automatically reload
# - localStorage simulates LMS
# - Console shows SCORM logs
```

### Building for Production

```bash
# Build optimized version
npm run build

# Test the build
npm run preview
```

### Packaging for LMS

```bash
# Create SCORM package
npm run package

# Result: course.zip
# Upload to Moodle, Canvas, etc.
```

### Testing in LMS

1. Upload course.zip to your LMS
2. Launch the course
3. Test key scenarios:
   - First launch (no saved data)
   - Save progress and close
   - Relaunch (should resume)
   - Complete the course
   - Check LMS grade book

## Customization Guide

### Easy Customizations

- **Change colors/fonts** - Edit CSS files
- **Add pages** - Follow template patterns
- **Modify text** - Edit HTML/component files
- **Change navigation** - Update page components

### Medium Customizations

- **Add quizzes** - Create question components
- **Custom interactions** - New components/modules
- **Video integration** - Use HTML5 video + tracking
- **Custom progress tracking** - Add to saveProgress()

### Advanced Customizations

- **Custom LMS integration** - Extend adapters
- **Complex state management** - Add Redux/Pinia
- **Multi-language support** - i18n integration
- **Advanced analytics** - Custom xAPI statements

## Technical Details

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari
- Chrome Mobile

### Standards Compliance

- ✅ SCORM 2004 4th Edition (fully implemented)
- ✅ xAPI 1.0.3 (fully implemented)
- ⚠️ SCORM 1.2 (detection only, adapter can be added)

### Data Limits

**SCORM 2004:**
- `suspend_data`: 64KB limit
- Wrapper serializes to JSON
- Automatically truncates if needed

**xAPI:**
- State API: No strict limits
- Depends on LRS configuration
- Generally much more flexible

### Build System

- **Rollup** for bundling
- **Terser** for minification
- Multiple output formats
- Source maps included

## Best Practices

### 1. Save Progress Frequently

```javascript
// Save every 30 seconds
setInterval(async () => {
  await ScormWrapper.saveProgress(getCurrentState());
}, 30000);

// Also save on major actions
button.addEventListener('click', async () => {
  await ScormWrapper.saveProgress({ clicked: true });
});
```

### 2. Handle Errors Gracefully

```javascript
try {
  await ScormWrapper.saveProgress(data);
} catch (error) {
  console.error('Save failed:', error);
  // Show user message or retry
}
```

### 3. Test Thoroughly

- Test locally first
- Test in target LMS before launch
- Test different browsers
- Test mobile devices
- Test resume functionality

### 4. Keep Data Minimal

```javascript
// Good - only essential data
await ScormWrapper.saveProgress({
  page: 5,
  completed: [1, 2, 3, 4]
});

// Bad - unnecessary data
await ScormWrapper.saveProgress({
  entireDOMCopy: document.body.innerHTML, // Too much!
  fullVideoData: videoBlob // Way too much!
});
```

### 5. Provide User Feedback

```javascript
async function saveCourse() {
  showSpinner();
  try {
    await ScormWrapper.saveProgress(data);
    showMessage('Progress saved!');
  } catch (error) {
    showMessage('Save failed, please try again');
  }
}
```

## Troubleshooting

### Course doesn't load in LMS
- Check console for errors
- Verify imsmanifest.xml in ZIP
- Ensure all files are in package
- Try repackaging with CLI tool

### Progress not saving
- Check wrapper is initialized
- Look for console errors
- Verify LMS permissions
- Test locally first

### Can't find SCORM API
- LMS might not support SCORM 2004
- Check LMS documentation
- Try SCORM Cloud test
- Verify package structure

### Build errors
- Run `npm install` again
- Clear node_modules and reinstall
- Check Node.js version (14+)
- Review error messages

## Next Steps

1. **Read GETTING_STARTED.md** - Detailed tutorials
2. **Try vanilla-demo** - See all features in action
3. **Copy a template** - Start building your course
4. **Join community** - Share your projects

## Resources

- [SCORM Specification](https://adlnet.gov/projects/scorm/)
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)
- [SCORM Cloud](https://cloud.scorm.com/) - Free testing
- [IMS Global](https://www.imsglobal.org/) - Standards org

---

**Ready to build amazing e-learning experiences!** 🚀

