# Build Your First SCORM Course - Complete Beginner Guide

**Time: 20 minutes** | **Skill Level: Beginner** | **Tools: Cursor AI**

This guide assumes you know nothing. We'll build a working e-learning course step by step.

---

## 🎯 What We're Building

A simple, multi-page course that:
- ✅ Saves progress automatically
- ✅ Remembers where learners left off
- ✅ Tracks completion
- ✅ Works in any LMS (Moodle, Canvas, etc.)

---

## 🧠 Understanding the Setup

**Think of it this way:**

**SCORM Wrapper** = A tool (like a hammer or screwdriver)
- You keep it somewhere on your computer
- You use it to CREATE new courses
- You don't work INSIDE it

**Your Courses** = Separate projects (like different houses you're building)
- Each course is its own folder
- Each course is opened separately in Cursor
- You build many courses using the ONE wrapper tool

**Example:**
```
Tools/
└── SCORM Wrapper/          ← The tool (keep it here)

My Courses/
├── fire-safety-course/     ← Your first course
├── compliance-training/    ← Your second course  
└── employee-onboarding/    ← Your third course
```

---

## 📋 Before We Start

**You need:**
1. ✅ Cursor AI installed
2. ✅ This SCORM Wrapper folder somewhere on your computer
3. ✅ 20 minutes of time

**You DON'T need:**
- ❌ To know how to code
- ❌ To understand SCORM
- ❌ An LMS to test (we'll test locally!)
- ❌ To open the SCORM Wrapper folder in Cursor every time

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Cursor and Create Your Course Folder

1. Launch **Cursor** application
2. Click **File** → **New Window**
3. You'll create your course in a moment!

---

### Step 2: Create Your Course (ONE COMMAND!)

**Important:** Each course is a separate project. You'll run this command once per course.

1. In Cursor, open the terminal: **View** → **Terminal** (or press `` Ctrl+` ``)
2. Navigate to where you want to create your course:

```bash
# Go to wherever you keep projects (Desktop, Documents, etc.)
cd ~/Desktop
# or
cd ~/Documents/my-courses
```

3. Run ONE of these commands (using the FULL path to the SCORM Wrapper):

#### 📝 Vanilla JavaScript (Easiest - Recommended for Beginners)
```bash
bash "/Users/nathan/projects/SCORM Wrapper/setup-vanilla.sh" my-first-course
```
**Best for:** Simple courses, beginners, no build complexity

#### ⚛️ React (Modern & Popular)
```bash
bash "/Users/nathan/projects/SCORM Wrapper/setup-react.sh" my-react-course
```
**Best for:** Interactive courses, if you know React

#### 💚 Vue (Modern & Easy)
```bash
bash "/Users/nathan/projects/SCORM Wrapper/setup-vue.sh" my-vue-course
```
**Best for:** Interactive courses, if you know Vue

**What happens:**
- ✅ Creates a new folder with your course name
- ✅ Copies all template files
- ✅ Sets up the project
- ✅ Ready to use!

**Tip:** Change `my-first-course` to anything (e.g., `fire-safety-training`)

---

### Step 3: Open Your Course in Cursor

1. In Cursor: **File** → **Open Folder**
2. Navigate to and open the folder you just created (e.g., `my-first-course`)
3. You'll see all the course files ready to edit!

---

### Step 4: Install Dependencies

1. In the terminal, navigate into your course folder and install:

```bash
cd my-first-course
npm install
```

Or if you're already in the folder:

```bash
npm install
```

**What you'll see:** Lots of text scrolling for 30 seconds, then it finishes

---

### Step 5: Start Your Course

1. In the terminal, type:

```bash
npm run dev
```

2. Press **Enter**

**What you'll see:** 
- Terminal says: "Available on: http://127.0.0.1:8080"
- Your browser opens automatically showing a 4-page course!

**🎉 IT'S WORKING!**

Try this:
- Click "Next" to go to page 2
- Refresh your browser
- See? It remembered you were on page 2!

---

### Step 6: Customize Your Course Content

Now the fun part - let's make it YOUR course!

#### Open the HTML file:

1. In Cursor sidebar, click **index.html**
2. You'll see the course structure

#### Ask Cursor AI to Help:

1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) to open Cursor AI chat
2. Type one of these prompts:

**Example Prompt 1: Change the title**
```
Change the course title to "Fire Safety Training" and update page 1 
to introduce fire safety basics
```

**Example Prompt 2: Add a quiz**
```
On page 3, replace the current content with a 3-question 
multiple choice quiz about [YOUR TOPIC]. Add score tracking.
```

**Example Prompt 3: Change styling**
```
Change the color scheme to blue and green instead of purple. 
Make it look more professional.
```

3. Press **Enter**
4. Cursor AI will modify the files for you!
5. Look at your browser - it auto-refreshes with the changes!

---

### Step 7: Keep Customizing (Using Cursor AI)

**Here are more things you can ask Cursor to do:**

#### Add Video
```
Add an HTML5 video to page 2 that tracks when the user 
finishes watching it
```

#### Add Images
```
Add a placeholder image to page 1 that I can replace later
```

#### More Pages
```
Add a 5th page called "Final Quiz" with 5 questions
```

#### Change Navigation
```
Add a "Skip to Quiz" button on page 1
```

#### Custom Tracking
```
Track how long users spend on each page and save it
```

**Pro Tip:** Be specific! Instead of "make it better," say "add a progress percentage display at the top"

---

### Step 8: Test Your Course

As you're building:

1. Keep `npm run dev` running
2. Make changes
3. Browser auto-refreshes
4. Test navigation, buttons, etc.

**Test the SCORM features:**

1. Navigate to page 3
2. Refresh browser → Should go back to page 3 (progress saved!)
3. Open browser console (F12) → See SCORM logs
4. Click "Complete Course" → See completion logged

---

### Step 9: Package for LMS

When you're happy with your course:

1. **Stop the dev server:** In terminal, press `Ctrl+C`
2. **Build production version:**
   ```bash
   npm run build
   ```
3. **Create SCORM package:**
   ```bash
   npm run package
   ```

**What you'll see:** 
- New `dist/` folder created
- New `course.zip` file appears!

**This ZIP file is ready to upload to any LMS!**

---

### Step 10: Upload to Your LMS

1. Log into your LMS (Moodle, Canvas, Blackboard, etc.)
2. Go to your course
3. Find "Add Activity" or "Add Content"
4. Look for "SCORM Package" or "Upload SCORM"
5. Upload `course.zip`
6. Test it in the LMS!

---

## 💡 Common Customizations (Ask Cursor AI)

### Make it look professional
```
Update the styling to look like a corporate training course 
with a clean, modern design
```

### Add branding
```
Add a header with my company logo and use brand colors 
#FF5733 and #1E3A8A
```

### Track quiz scores
```
Add a quiz scoring system that saves the user's best score 
and shows it when they come back
```

### Add a certificate
```
On the completion page, show a printable certificate with 
the user's name and completion date
```

### Mobile-friendly
```
Make sure this course looks good on tablets and phones
```

---

## 🎨 Quick Customization Reference

### What File to Edit:

| Want to Change | Edit This File | Ask Cursor |
|----------------|----------------|------------|
| Page content | `index.html` | "Change page 2 content to..." |
| Colors/fonts | `styles.css` | "Make the colors blue and..." |
| Behavior/logic | `course.js` | "Add a timer that..." |
| Quiz questions | `index.html` | "Add 5 questions about..." |
| Navigation | `index.html` + `course.js` | "Add a menu sidebar..." |

### Cursor AI Prompt Templates:

**Structure:**
```
"Add [WHAT] to [WHERE] that [DOES WHAT]"
```

**Examples:**
- "Add a video player to page 2 that tracks completion"
- "Add a sidebar to the layout that shows progress"
- "Add a quiz to page 3 that requires 80% to pass"

---

## 🐛 Troubleshooting

### "npm: command not found"
**Fix:** Install Node.js from [nodejs.org](https://nodejs.org)

### Browser doesn't open
**Fix:** Manually go to http://localhost:8080

### Changes don't show
**Fix:** 
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows)
2. Or restart: Stop `npm run dev` (Ctrl+C) and run it again

### Course doesn't work in LMS
**Fix:** 
1. Make sure you ran `npm run build` before `npm run package`
2. Try uploading to SCORM Cloud (cloud.scorm.com) first to test

---

## ✅ You're Done When...

- [ ] Course shows your content
- [ ] Navigation works (Next/Previous buttons)
- [ ] Progress saves (refresh browser, still on same page)
- [ ] Course looks good
- [ ] `course.zip` created successfully
- [ ] Tested in LMS

---

## 🎓 Next Level Tips

### Work with AI more efficiently:

**Be specific:**
❌ "Make it better"
✅ "Add a 30-second timer to page 2 that auto-advances when it finishes"

**Work in small steps:**
❌ "Build a complete quiz system with analytics"
✅ "Add 3 multiple choice questions to page 3"
Then: "Add score calculation"
Then: "Save the score to SCORM data"

**Ask for explanations:**
```
"Explain how the progress saving works in course.js"
```

### Save time:

1. **Copy existing patterns:** "Make page 5 look like page 2 but with different content"
2. **Batch similar changes:** "Change all headings to use the Roboto font"
3. **Template sections:** "Create a reusable quiz section I can copy to any page"

---

## 📁 Folder Structure (What You'll Have)

```
my-first-course/
├── index.html          ← Your course pages (edit this!)
├── styles.css          ← Colors, fonts, layout (edit this!)
├── course.js           ← Logic and SCORM (mostly done for you)
├── build.js            ← Build script (don't touch)
├── package.json        ← Config (don't touch)
├── node_modules/       ← Dependencies (don't touch)
├── dist/              ← Built version (auto-generated)
└── course.zip         ← Final package (auto-generated)
```

**Files YOU edit:** `index.html` and `styles.css`
**Files CURSOR edits for you:** Everything else

---

## 🎯 Example 5-Minute Course

Let's build a super simple course right now:

1. **Open Cursor AI** (Cmd+K)
2. **Paste this prompt:**

```
Create a 3-page course about coffee brewing:

Page 1: Introduction to coffee brewing methods (pour over, french press, espresso)
Page 2: Step-by-step pour over guide with images placeholders
Page 3: Quiz with 5 questions about coffee brewing

Use a warm brown and cream color scheme.
Make it friendly and casual in tone.
```

3. **Press Enter**
4. **Watch Cursor AI build it!**
5. **Check your browser - it's done!**

---

## 🚀 You're Ready!

You now know how to:
- ✅ Start a new course project
- ✅ Use Cursor AI to build content
- ✅ Customize everything
- ✅ Test locally
- ✅ Package for LMS
- ✅ Deploy to production

**Start building!** Remember: Cursor AI is your assistant - be specific about what you want, and it'll help you build it.

---

## 💬 Example Conversation with Cursor AI

**You:** "I want to build a workplace harassment prevention course"

**Cursor:** "I'll help! What should be covered?"

**You:** 
```
5 pages:
1. Introduction and why this matters
2. What is harassment (with examples)
3. How to report harassment
4. Bystander intervention strategies  
5. Quiz with 10 questions

Make it professional but approachable. Use blue and white colors.
Add a certificate on completion.
```

**Cursor:** *Builds the entire course structure*

**You:** "On page 2, add more realistic workplace scenarios"

**Cursor:** *Updates page 2 with detailed scenarios*

**You:** "Make the quiz require 80% to pass, and let them retake it"

**Cursor:** *Adds quiz logic with retake functionality*

**Done!** 🎉

---

## 📚 What to Read Next

- **README.md** - Full API documentation
- **QUICK_REFERENCE.md** - Code snippets
- **examples/vanilla-demo/** - See all features working

---

**Happy Course Building!** 🚀

Questions? Check the SCORM wrapper demo at `examples/vanilla-demo/index.html`

