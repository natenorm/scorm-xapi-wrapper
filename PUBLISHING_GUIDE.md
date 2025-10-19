# Publishing to NPM - Guide

This guide will help you publish the SCORM Wrapper to npm so anyone can use it!

## 🎯 Goal

After publishing, anyone can run:
```bash
npx create-scorm-course my-course
```

And it will work from anywhere!

---

## 📋 Before You Publish

### 1. Create NPM Account

1. Go to https://www.npmjs.com/
2. Sign up for free
3. Verify your email
4. Remember your username and password

### 2. Login to NPM Locally

```bash
npm login
```

Enter your username, password, and email.

---

## 🔧 Prepare the Package

### 1. Choose a Package Name

Check if your name is available: https://www.npmjs.com/package/[your-name]

**Good names:**
- `create-scorm-course` ⭐ (if available)
- `scorm-course-builder`
- `@yourname/create-scorm-course` (scoped - always available)

### 2. Update package.json

The main `package.json` is already set up, but verify:

```json
{
  "name": "create-scorm-course",  // Change this!
  "version": "1.0.0",
  "description": "Create SCORM 2004 and xAPI courses with React, Vue, or vanilla JavaScript",
  "bin": {
    "create-scorm-course": "./cli.js"
  }
}
```

### 3. Create Main CLI Entry Point

We need a single entry point that works with npx:

Create `cli.js`:
```javascript
#!/usr/bin/env node
const { program } = require('commander');
// ... CLI logic here
```

---

## 📦 What to Publish

**Include:**
- ✅ `dist/` - Built wrapper library
- ✅ `templates/` - All starter templates
- ✅ `tools/` - CLI tools
- ✅ `types/` - TypeScript definitions
- ✅ README, docs

**Exclude:**
- ❌ `node_modules/`
- ❌ `examples/` (keep in GitHub, not npm)
- ❌ Source code (already built to dist/)
- ❌ Development files

Update `.npmignore`:
```
examples/
src/
*.log
.DS_Store
```

---

## 🚀 Publishing Steps

### 1. Test Locally First

```bash
# Link it locally
npm link

# Test from another directory
cd ~/Desktop
create-scorm-course test-course
```

If it works, you're ready!

### 2. Publish to NPM

```bash
# Make sure everything is committed
git add .
git commit -m "Prepare for npm publish"

# Publish to npm
npm publish --access public
```

If using scoped package (`@yourname/package`):
```bash
npm publish --access public
```

### 3. Test the Published Package

```bash
# Clear local link
npm unlink create-scorm-course

# Test from npm
npx create-scorm-course@latest test-course-2
```

---

## 📝 After Publishing

### Update Documentation

All docs should now say:
```bash
npx create-scorm-course my-course
```

Instead of the old bash command!

### Create GitHub Repo

1. Create repo on GitHub
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/scorm-wrapper.git
git push -u origin main
```

3. Add these to README:
   - npm badge: `[![npm version](https://badge.fury.io/js/create-scorm-course.svg)](https://www.npmjs.com/package/create-scorm-course)`
   - Installation instructions
   - Quick start guide

---

## 🔄 Updating the Package

When you make changes:

```bash
# Update version
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Publish update
npm publish
```

Users get latest with:
```bash
npx create-scorm-course@latest my-course
```

---

## 🎨 Make It Pretty

### Add Badges to README

```markdown
# SCORM/xAPI Wrapper

[![npm version](https://img.shields.io/npm/v/create-scorm-course.svg)](https://www.npmjs.com/package/create-scorm-course)
[![downloads](https://img.shields.io/npm/dm/create-scorm-course.svg)](https://www.npmjs.com/package/create-scorm-course)
[![license](https://img.shields.io/npm/l/create-scorm-course.svg)](https://github.com/yourusername/scorm-wrapper/blob/main/LICENSE)
```

### Add Keywords to package.json

```json
{
  "keywords": [
    "scorm",
    "scorm2004",
    "xapi",
    "elearning",
    "lms",
    "course-builder",
    "learning",
    "create-scorm-course"
  ]
}
```

This helps people find your package!

---

## 📊 Monitor Your Package

- **npm stats**: https://www.npmjs.com/package/create-scorm-course
- **unpkg CDN**: https://unpkg.com/create-scorm-course/
- **GitHub stars**: Track popularity
- **Issues**: Help users with problems

---

## 🆘 Troubleshooting

**"Package name already taken"**
→ Try a different name or use scoped: `@yourname/create-scorm-course`

**"Permission denied"**
→ Run `npm login` again

**"Cannot find module"**
→ Make sure `bin` in package.json points to correct file

**Users report errors**
→ Check GitHub issues, fix, and publish update

---

## ✅ Final Checklist

Before publishing:
- [ ] Tested locally with `npm link`
- [ ] README is clear and helpful
- [ ] Version number is correct
- [ ] `.npmignore` excludes unnecessary files
- [ ] Logged into npm (`npm whoami`)
- [ ] Package name is available
- [ ] Committed all changes to git

After publishing:
- [ ] Tested with `npx create-scorm-course`
- [ ] Pushed to GitHub
- [ ] Updated all documentation
- [ ] Added badges to README
- [ ] Shared with community!

---

## 🌟 Promotion Ideas

Once published:
- Post on Reddit r/javascript, r/elearning
- Tweet about it
- Write a blog post
- Add to awesome-scorm list
- Post on Product Hunt
- LinkedIn announcement

---

**Ready to make SCORM development easier for everyone!** 🚀

