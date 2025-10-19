# SCORM/xAPI Wrapper

A framework-agnostic JavaScript library for building SCORM 2004 and xAPI-compliant e-learning content. Create custom courses with any web technology and easily integrate LMS tracking for progress, completion, and scoring.

## Features

- 🎯 **Framework Agnostic** - Works with vanilla JS, React, Vue, Angular, Svelte, or any web framework
- 🔄 **Auto-Detection** - Automatically detects SCORM 2004, xAPI, or local development environment
- 💾 **Resume Support** - Save and restore learner progress seamlessly
- 📦 **Easy Packaging** - CLI tools to create SCORM-compliant ZIP packages
- 🚀 **Quick Start Templates** - Ready-to-use starter projects for vanilla JS, React, and Vue
- 🧪 **Local Development** - localStorage fallback for testing without an LMS
- 📘 **TypeScript Support** - Includes TypeScript definitions
- 🌐 **Multiple Formats** - UMD, ESM, and CommonJS builds

## Quick Start

### Option 1: Use a Template (Recommended)

Create a new course from a template with one command:

```bash
# Choose your template:
./setup-vanilla.sh my-course     # HTML/CSS/JavaScript
./setup-react.sh my-course       # React with Vite
./setup-vue.sh my-course         # Vue 3 with Vite
```

Then:

```bash
cd ../my-course
npm install
npm run dev          # Start development server
npm run package      # Create SCORM package
```

### Option 2: Install in Existing Project

```bash
npm install scorm-xapi-wrapper
```

## Usage

### Basic Example

```javascript
import ScormWrapper from 'scorm-xapi-wrapper';

// Initialize connection to LMS
await ScormWrapper.initialize();

// Save progress (any JSON-serializable data)
await ScormWrapper.saveProgress({
  currentPage: 5,
  answers: { q1: 'A', q2: 'B' },
  timeSpent: 3600
});

// Load saved progress
const progress = await ScormWrapper.getProgress();
if (progress) {
  // Resume from saved state
  goToPage(progress.currentPage);
}

// Mark completion
await ScormWrapper.setComplete();
await ScormWrapper.setScore(85);

// Cleanup when finished
await ScormWrapper.terminate();
```

### HTML Script Tag

```html
<!DOCTYPE html>
<html>
<head>
  <script src="scorm-wrapper.umd.js"></script>
</head>
<body>
  <script>
    (async () => {
      await ScormWrapper.initialize();
      
      const saved = await ScormWrapper.getProgress();
      if (saved) {
        console.log('Resuming from:', saved);
      }
      
      // Your course logic here
    })();
  </script>
</body>
</html>
```

### React Hook

```jsx
import { useScorm } from './hooks/useScorm';

function Course() {
  const { initialized, saveProgress, setComplete } = useScorm();
  
  const handleComplete = async () => {
    await setComplete();
    await setScore(100);
  };
  
  return <button onClick={handleComplete}>Complete</button>;
}
```

### Vue Composable

```vue
<script>
import { useScorm } from './composables/useScorm';

export default {
  setup() {
    const { saveProgress, setComplete } = useScorm();
    
    const handleComplete = async () => {
      await setComplete();
      await setScore(100);
    };
    
    return { handleComplete };
  }
};
</script>
```

## API Reference

### ScormWrapper

#### `initialize()`
Initialize connection to the LMS. Must be called before any other methods.

```javascript
await ScormWrapper.initialize();
```

#### `saveProgress(data)`
Save progress data. Accepts any JSON-serializable object.

```javascript
await ScormWrapper.saveProgress({
  currentPage: 3,
  userData: { name: 'John' },
  answers: { q1: 'correct' }
});
```

#### `getProgress()`
Retrieve saved progress data. Returns `null` if no progress exists.

```javascript
const progress = await ScormWrapper.getProgress();
```

#### `setComplete()`
Mark the course as completed.

```javascript
await ScormWrapper.setComplete();
```

#### `setScore(score)`
Set the course score (0-100).

```javascript
await ScormWrapper.setScore(85);
```

#### `terminate()`
Terminate the LMS connection. Called automatically on page unload.

```javascript
await ScormWrapper.terminate();
```

#### `getEnvironmentType()`
Get the detected environment type.

```javascript
const env = ScormWrapper.getEnvironmentType();
// Returns: 'scorm2004' | 'xapi' | 'local'
```

#### `isInitialized()`
Check if wrapper is initialized.

```javascript
if (ScormWrapper.isInitialized()) {
  // Safe to call other methods
}
```

## Packaging for LMS

### CLI Tool

Package your course for upload to an LMS:

```bash
npx package-scorm -i ./dist -o course.zip --title "My Course"
```

Options:
- `-i, --input <directory>` - Input directory containing course files (required)
- `-o, --output <file>` - Output ZIP file path (default: course.zip)
- `-t, --title <title>` - Course title (default: Course)
- `-d, --description <description>` - Course description
- `--id, --identifier <id>` - Course identifier (auto-generated if not provided)

### In package.json

```json
{
  "scripts": {
    "build": "vite build",
    "package": "npm run build && package-scorm -i dist -o course.zip"
  }
}
```

## Templates

### Copy Template Manually

```bash
cp -r node_modules/scorm-xapi-wrapper/templates/vanilla-starter my-course
cd my-course
npm install
```

### Use CLI Scaffolding

```bash
npx create-scorm-course my-course --template react
```

Available templates:
- `vanilla` - Plain HTML/CSS/JavaScript
- `react` - React with Vite
- `vue` - Vue 3 with Vite

## Development

### Local Testing

The wrapper automatically uses localStorage when not in an LMS, allowing you to develop and test locally without needing an LMS.

### Testing in LMS

1. Build your course: `npm run build`
2. Package for SCORM: `npm run package`
3. Upload `course.zip` to your LMS (Moodle, Canvas, Blackboard, etc.)
4. Launch and test

## Architecture

### Environment Detection

The wrapper automatically detects the runtime environment:

1. **SCORM 2004** - Looks for `API_1484_11` in window hierarchy
2. **xAPI** - Checks for xAPI configuration in URL parameters or global config
3. **Local** - Falls back to localStorage for development

### Adapters

- **SCORM2004Adapter** - Implements SCORM 2004 4th Edition API
- **XAPIAdapter** - Implements xAPI (Tin Can) specification
- **LocalStorageAdapter** - Fallback for local development

### Data Flow

```
Your Course
    ↓
ScormWrapper (Unified API)
    ↓
Environment Detector
    ↓
[SCORM Adapter | xAPI Adapter | Local Adapter]
    ↓
[LMS | LRS | localStorage]
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## SCORM Standards

- ✅ SCORM 2004 4th Edition (primary support)
- ⚠️ SCORM 1.2 (detection included, adapter can be added)
- ✅ xAPI (Tin Can)

## Examples

See the `/examples` directory for complete working examples:

- `examples/vanilla-demo` - Feature showcase with vanilla JavaScript
- `examples/react-demo` - React integration examples

See the `/templates` directory for starter templates:

- `templates/vanilla-starter` - Plain HTML/CSS/JS template
- `templates/react-starter` - React + Vite template
- `templates/vue-starter` - Vue 3 + Vite template

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Resources

- [SCORM 2004 4th Edition Documentation](https://adlnet.gov/projects/scorm/)
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)
- [IMS Content Packaging](https://www.imsglobal.org/content/packaging/)

## Support

For issues and questions, please [open an issue](https://github.com/yourusername/scorm-xapi-wrapper/issues).

---

**Happy Course Building!** 🎓

