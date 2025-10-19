# Quick Setup Scripts

Create a new SCORM course in seconds with these simple scripts!

## 🚀 One Command Setup

### Choose Your Template:

#### 📝 Vanilla JavaScript
```bash
./setup-vanilla.sh my-course-name
```
**What you get:**
- Plain HTML/CSS/JavaScript
- No build complexity
- Perfect for simple courses
- Fastest to learn

#### ⚛️ React
```bash
./setup-react.sh my-course-name
```
**What you get:**
- React 18 + Vite
- Component-based architecture
- Hot module replacement
- Modern development experience

#### 💚 Vue
```bash
./setup-vue.sh my-course-name
```
**What you get:**
- Vue 3 + Composition API
- Reactive components
- Hot module replacement
- Clean, intuitive syntax

---

## 📋 After Running Setup

Your course folder will be created **next to** the SCORM Wrapper folder (as a sibling).

### Next Steps:

```bash
# 1. Open your new course folder
cd ../my-course-name

# 2. Install dependencies
npm install

# 3. Start developing
npm run dev
```

Your course will open in your browser automatically!

---

## 📖 Usage Examples

### Create a Vanilla JS Course
```bash
./setup-vanilla.sh employee-onboarding
cd ../employee-onboarding
npm install
npm run dev
```

### Create a React Course
```bash
./setup-react.sh safety-training
cd ../safety-training
npm install
npm run dev
```

### Create a Vue Course
```bash
./setup-vue.sh compliance-course
cd ../compliance-course
npm install
npm run dev
```

---

## 🔧 What the Scripts Do

1. ✅ Check if folder name is available
2. ✅ Copy all template files
3. ✅ Update `package.json` with your course name
4. ✅ Provide next-step instructions
5. ✅ Create folder in the right location

---

## 🎯 Quick Reference

| Want to Build | Use This Script | Tech Stack |
|---------------|----------------|------------|
| Simple course | `./setup-vanilla.sh name` | HTML/CSS/JS |
| Interactive React app | `./setup-react.sh name` | React + Vite |
| Interactive Vue app | `./setup-vue.sh name` | Vue + Vite |

---

## ⚙️ Advanced: The Generic Script

You can still use the generic script if you prefer:

```bash
./setup-course.sh my-course vanilla   # Creates vanilla course
./setup-course.sh my-course react     # Creates react course
./setup-course.sh my-course vue       # Creates vue course
```

But the individual scripts are simpler and clearer!

---

## 🆘 Troubleshooting

**"Folder already exists"**
→ Choose a different name or delete the existing folder

**"Permission denied"**
→ Run: `chmod +x setup-*.sh` to make scripts executable

**"Template not found"**
→ Make sure you're running the script from the SCORM Wrapper directory

---

## 📁 Where Files Are Created

```
Your Computer
├── SCORM Wrapper/          ← You're here
│   ├── setup-vanilla.sh    ← Run these scripts
│   ├── setup-react.sh
│   └── setup-vue.sh
│
├── my-course-name/         ← Your course gets created here
│   ├── index.html
│   ├── course.js
│   └── ...
```

---

**Ready to create your first course?** Pick a script and run it! 🚀

