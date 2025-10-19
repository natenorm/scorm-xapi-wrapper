# Getting This on GitHub - Step by Step

Super simple guide to get your SCORM Wrapper on GitHub.

## 🚀 Quick Steps

### 1. Build the Library First

```bash
cd "/Users/nathan/projects/SCORM Wrapper"
npm run build
```

This creates the `dist/` folder with the built library.

---

### 2. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: SCORM/xAPI Wrapper with templates"
```

---

### 3. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `scorm-xapi-wrapper` (or whatever you want)
3. Description: "Framework-agnostic SCORM 2004 and xAPI wrapper for building e-learning courses"
4. Keep it **Public** (so others can use it)
5. **DON'T** initialize with README (we have one!)
6. Click **Create repository**

---

### 4. Connect and Push

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/scorm-xapi-wrapper.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username!

---

### 5. Verify It Worked

Go to: `https://github.com/YOUR-USERNAME/scorm-xapi-wrapper`

You should see all your files! 🎉

---

## 📖 Update README

Add a badge at the top of README.md:

```markdown
[![GitHub](https://img.shields.io/github/stars/YOUR-USERNAME/scorm-xapi-wrapper?style=social)](https://github.com/YOUR-USERNAME/scorm-xapi-wrapper)
```

---

## 🎯 How People Will Use It

### Option 1: Clone and Link

```bash
git clone https://github.com/YOUR-USERNAME/scorm-xapi-wrapper.git
cd scorm-xapi-wrapper
npm install
npm run build
npm link
```

Now they can use:
```bash
create-scorm-course my-course
```

### Option 2: Direct Download

Download ZIP from GitHub → Extract → Run setup scripts

### Option 3: Use Setup Scripts Directly

```bash
bash <(curl -s https://raw.githubusercontent.com/YOUR-USERNAME/scorm-xapi-wrapper/main/setup-vanilla.sh) my-course
```

---

## 📝 Add These to README

Update your main README.md to include:

```markdown
## Installation

### Quick Start (Recommended)

1. Clone this repository:
```bash
git clone https://github.com/YOUR-USERNAME/scorm-xapi-wrapper.git
cd scorm-xapi-wrapper
```

2. Build and link globally:
```bash
npm install
npm run build
npm link
```

3. Create your first course:
```bash
cd ~/Desktop
create-scorm-course my-first-course
cd my-first-course
npm install
npm run dev
```

### Or Use Setup Scripts Directly

From the scorm-xapi-wrapper directory:
```bash
./setup-vanilla.sh my-course    # Vanilla JS
./setup-react.sh my-course      # React
./setup-vue.sh my-course        # Vue
```
```

---

## 🔄 Making Updates

When you make changes:

```bash
git add .
git commit -m "Description of what you changed"
git push
```

---

## ⭐ Optional: Add Topics

On GitHub repo page:
1. Click the gear icon next to "About"
2. Add topics: `scorm`, `xapi`, `elearning`, `lms`, `course-builder`
3. This helps people discover your project!

---

## 📊 Optional: Add a License

Add a LICENSE file (MIT is common):

1. On GitHub repo page
2. Click "Add file" → "Create new file"
3. Name it `LICENSE`
4. GitHub will offer templates - choose MIT
5. Commit!

---

## ✅ Done!

Your project is now on GitHub and others can:
- Clone it
- Star it
- Fork it
- Open issues
- Submit PRs

**When you're ready for npm, just follow `PUBLISHING_GUIDE.md`!**

