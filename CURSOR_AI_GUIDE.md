# Building SCORM Courses with Cursor AI

Use Cursor AI to build professional e-learning courses in minutes instead of hours!

## The Magic Formula

```
1. npx create-scorm-course my-course
2. Open in Cursor
3. Tell Cursor what to build
4. npm run package:scorm (or package:xapi)
5. Upload to LMS
```

That's it! Let AI do the heavy lifting while you focus on content.

**Pro Tip:** Your course works with both SCORM and xAPI automatically. Just choose the packaging format when you deploy!

## Getting Started

### 1. Create Your Project

```bash
npx create-scorm-course fire-safety-course
cd fire-safety-course
npm install
```

Choose **Vanilla** template for simplest AI-assisted development.

### 2. Open in Cursor

```bash
cursor .
```

Or open the folder in Cursor manually.

### 3. Give Cursor Instructions

Open the Cursor chat and describe what you want to build. Be specific about:
- Number of pages/sections
- Content topics
- Interactive elements (quiz, drag-drop, etc.)
- Completion criteria
- Scoring requirements

## Example Prompts for Cursor

### Basic Multi-Page Course

```
Create a 5-page fire safety training course. 

Pages:
1. Introduction to fire safety
2. Fire prevention tips
3. Emergency procedures
4. Using fire extinguishers
5. Final quiz (5 questions)

Requirements:
- Save progress after each page
- Previous/Next navigation
- Progress bar showing % complete
- Quiz must be passed with 80% to complete course
- Use the SCORM wrapper to track everything
```

### Interactive Quiz Course

```
Build a cybersecurity awareness quiz course.

Requirements:
- 10 multiple choice questions
- Randomize question order
- Show immediate feedback after each answer
- Track score with SCORM wrapper
- Pass requirement: 70%
- Allow 3 attempts
- Show results page at end
```

### Scenario-Based Learning

```
Create a customer service scenario course.

Structure:
- Present 3 customer scenarios
- Each scenario has 3 decision points
- Each decision shows outcome and feedback
- Track all decisions in SCORM suspend_data
- Award points for best choices
- Complete when all scenarios finished
- Score based on total points (0-100)
```

### Course with Video Content

```
Build a product training course with embedded videos.

Layout:
- Welcome page with course overview
- 4 topic pages, each with:
  - YouTube video embed
  - Key points below video
  - "Mark as viewed" checkbox
- Final assessment page with 8 questions
- Track video completion status
- Must view all videos before taking quiz
- Pass: 75%
```

## Effective Prompts: Best Practices

### ✅ DO

- **Be specific** about page count, content, and features
- **Mention the SCORM wrapper** explicitly
- **Define success criteria** (pass %, completion requirements)
- **Specify data to track** (answers, progress, time, etc.)
- **Request responsive design** if needed for mobile

### ❌ DON'T

- Be vague ("make a course about safety")
- Forget to mention SCORM wrapper usage
- Skip completion requirements
- Omit navigation details
- Assume Cursor knows your LMS requirements

## Iterative Development with Cursor

After Cursor creates your course, refine it with follow-up prompts:

### Enhancing UI/UX

```
"Make the design more modern with better colors and typography"
"Add smooth page transitions between sections"
"Make the progress bar more prominent at the top"
"Add icons to each page title"
```

### Adding Features

```
"Add a sidebar menu to jump directly to any page"
"Include a printable certificate on completion"
"Add timer showing time spent in course"
"Include tooltips explaining each concept"
```

### Fixing Issues

```
"The quiz score calculation is wrong, fix it to be out of 100"
"Progress isn't saving correctly, debug the saveProgress calls"
"Add error handling if SCORM API fails"
"The resume functionality isn't working, check getProgress logic"
```

## SCORM Wrapper API Cheat Sheet

Give Cursor this context when needed:

```javascript
// Always do this first
await ScormWrapper.initialize();

// Save any data (must be JSON-serializable)
await ScormWrapper.saveProgress({
  page: 3,
  answers: { q1: 'A', q2: 'B' },
  timeSpent: 600,
  videosWatched: ['intro', 'safety101']
});

// Load saved data (for resume)
const saved = await ScormWrapper.getProgress();

// Set score (0-100)
await ScormWrapper.setScore(85);

// Mark complete (true = passed, false = failed)
await ScormWrapper.setComplete(true);

// Check environment
const env = ScormWrapper.getEnvironmentType(); // 'scorm2004' | 'local'
```

## Common Cursor AI Requests

### "Review this SCORM implementation"

Ask Cursor to check:
```
"Review my SCORM wrapper usage and make sure:
1. initialize() is called before anything else
2. saveProgress() is called after important state changes
3. setComplete() is only called when user truly finishes
4. score is calculated correctly
5. data passed to saveProgress is serializable"
```

### "Add debugging"

```
"Add console logging to show:
- When SCORM initializes
- Current environment (local vs SCORM)
- When progress is saved
- What data is being saved
- When course marks complete"
```

### "Make it mobile responsive"

```
"Update the CSS to be fully responsive:
- Stack elements vertically on mobile
- Enlarge buttons for touch targets
- Scale fonts appropriately
- Ensure navigation works on touch devices"
```

## Packaging Your Course

Once your course is working locally, tell Cursor to prepare it for deployment:

### For SCORM 2004 (Most Common)

```
"Package this course for SCORM 2004. Run npm run package:scorm to create the ZIP file."
```

Or just run manually:
```bash
npm run package:scorm
```

### For xAPI / Tin Can

```
"Package this course for xAPI format. Run npm run package:xapi to create the ZIP file."
```

Or just run manually:
```bash
npm run package:xapi
```

### Cursor Packaging Prompts

**Prepare for specific platform:**
```
"Prepare this course for upload to Moodle. Make sure it's packaged as SCORM 2004."
```

**Test packaging:**
```
"Package this course for SCORM Cloud's xAPI mode and tell me what files were included."
```

**Customize manifest:**
```
"Update the course title and description in the packaging command to 'Fire Safety Training - Interactive Module'."
```

## Testing Your Course

### Local Testing

```bash
npm run dev
```

Cursor can help set up test buttons:

```
"Add a debug panel at the bottom showing:
- Current environment (SCORM/xAPI/local)
- Saved progress data
- Current score
- Completion status
- Include buttons to reset data and test resume"
```

### LMS Testing

After packaging, upload to your LMS or [SCORM Cloud](https://cloud.scorm.com/) (free):

**SCORM:** Upload `course.zip` to test SCORM 2004 compatibility  
**xAPI:** Upload `course-xapi.zip` to test in xAPI mode

If issues occur, ask Cursor:

```
"The course isn't detecting the SCORM API in SCORM Cloud. 
Review the wrapper initialization and add more detailed logging 
to help diagnose the issue."
```

### Platform-Specific Testing

```
"I'm testing in Moodle and the course isn't resuming properly. 
Help me debug the saveProgress and getProgress calls."
```

## Pro Tips

### 1. Start Simple, Iterate

Create a basic version first:
```
"Create a simple 3-page course with Next/Previous buttons 
and SCORM progress tracking"
```

Then enhance it:
```
"Add a quiz page at the end with 5 questions"
"Make the design more visually appealing"
"Add animations when changing pages"
```

### 2. Use Cursor's Codebase Context

When asking questions, Cursor can see your code. Ask contextual questions:
```
"Why isn't my quiz score saving?"
"How can I add another page to this course?"
"Fix the navigation so it saves progress before changing pages"
```

### 3. Request Comments

```
"Add detailed comments explaining:
- How the SCORM wrapper is used
- How progress tracking works  
- How the quiz scoring works
This will help me maintain the code later."
```

### 4. Ask for Variations

```
"Create 3 variations of the quiz question layout:
1. Traditional multiple choice
2. Card-based selection
3. Image-based options
Show me each so I can pick the best one."
```

## Common Gotchas (Tell Cursor About These)

### Don't Call setComplete() Too Early

❌ Bad:
```javascript
await ScormWrapper.initialize();
await ScormWrapper.setComplete(true); // Marks complete immediately!
```

✅ Good:
```javascript
// Only call when user truly finishes
function finishCourse() {
  if (quizPassed && allPagesViewed) {
    await ScormWrapper.setComplete(true);
  }
}
```

### Save Serializable Data Only

❌ Bad:
```javascript
await ScormWrapper.saveProgress({
  domElement: document.querySelector('#quiz'), // Can't serialize DOM
  callback: () => console.log('hi') // Can't serialize functions
});
```

✅ Good:
```javascript
await ScormWrapper.saveProgress({
  quizAnswers: ['A', 'B', 'C'], // Simple data only
  currentPage: 3,
  score: 85
});
```

### Initialize Before Everything

❌ Bad:
```javascript
await ScormWrapper.saveProgress({ page: 1 }); // Error! Not initialized
await ScormWrapper.initialize();
```

✅ Good:
```javascript
await ScormWrapper.initialize();
await ScormWrapper.saveProgress({ page: 1 });
```

## Sample Full Prompt

Here's a complete, detailed prompt you can use as a template:

```
Create a comprehensive workplace safety training course.

STRUCTURE:
- Welcome/Introduction page
- 5 content pages covering:
  1. Hazard identification
  2. Personal protective equipment (PPE)
  3. Emergency procedures
  4. Incident reporting
  5. Safety best practices
- Final quiz page (10 questions)
- Results/Certificate page

FEATURES:
- Previous/Next navigation on all pages
- Progress bar showing % complete at top
- Each content page has an image, title, and 3-4 bullet points
- Content pages have "Mark Complete" checkbox (required before proceeding)
- Quiz has 10 multiple choice questions (4 options each)
- Immediate feedback on quiz answers
- Pass requirement: 80%
- Show score and pass/fail on results page

SCORM INTEGRATION:
- Initialize SCORM wrapper on load
- Save progress after each page navigation
- Save quiz answers as they're selected
- Resume from last page on course relaunch
- Set score based on quiz results
- Mark complete only if score >= 80%
- Track time spent in course

DESIGN:
- Clean, professional look
- Use blue/gray color scheme
- Responsive (works on mobile)
- Clear, readable fonts
- Buttons have hover effects

Please use the SCORM wrapper API properly and include error handling.
```

## Getting Help

If you're stuck:

1. Ask Cursor to "explain how this code works"
2. Ask Cursor to "add comments to clarify the logic"
3. Check [QUICKSTART.md](./QUICKSTART.md) for basic usage
4. Review [README.md](./README.md) for full API docs
5. Look at test courses in `/test-courses` for examples

Happy course building with AI! 🤖🎓


