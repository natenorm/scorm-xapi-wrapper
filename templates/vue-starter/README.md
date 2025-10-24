# Vue SCORM Course Template

A modern Vue 3 template for creating SCORM-compliant e-learning courses using Vue and Vite.

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Building

Build the course for production:

```bash
npm run build
```

### Packaging Your Course

This template works with both SCORM 2004 and xAPI formats. Choose based on your target platform:

#### SCORM 2004 Package (Most Common)

```bash
npm run package:scorm
```

Creates `course.zip` for traditional LMS platforms (Moodle, Canvas, Blackboard).

#### xAPI Package

```bash
npm run package:xapi
```

Creates `course-xapi.zip` for Learning Record Stores (SCORM Cloud xAPI, Learning Locker).

#### Quick Reference
- **SCORM 2004**: Use for most LMS platforms
- **xAPI**: Use for modern LRS platforms or advanced analytics

The wrapper automatically detects the environment at runtime - no code changes needed!

## Project Structure

```
src/
├── App.vue                    # Main application component
├── main.js                    # Entry point
├── styles.css                 # Global styles
├── composables/
│   └── useScorm.js           # SCORM integration composable
├── components/
│   ├── Navigation.vue        # Navigation component
│   └── ProgressBar.vue       # Progress bar component
└── pages/
    ├── Page1.vue             # Course pages
    ├── Page2.vue
    ├── Page3.vue
    └── Page4.vue
```

## Customization

### Adding Pages

1. Create a new page component in `src/pages/`:
```vue
<template>
  <div class="page">
    <h2>Page 5: Your Content</h2>
    <p>Your content here...</p>
  </div>
</template>

<script>
export default {
  name: 'Page5'
};
</script>
```

2. Import and add to pages array in `App.vue`:
```javascript
import Page5 from './pages/Page5.vue';

const pages = [Page1, Page2, Page3, Page4, Page5];
```

### Using the SCORM Composable

The `useScorm` composable provides easy access to SCORM functionality:

```vue
<script>
import { useScorm } from './composables/useScorm';

export default {
  setup() {
    const { saveProgress, setComplete, setScore } = useScorm();
    
    const handleSubmit = async () => {
      await saveProgress({ answer: 'correct' });
      await setScore(100);
      await setComplete();
    };
    
    return {
      handleSubmit
    };
  }
};
</script>
```

### Custom Styling

Modify `src/styles.css` or add component-specific styles in `<style>` tags.

### State Management

For complex courses, consider adding Pinia for state management:

```bash
npm install pinia
```

## SCORM Features

The template automatically:
- Initializes SCORM connection
- Saves progress every 30 seconds
- Saves progress on navigation
- Resumes from last position
- Tracks completion and scores

## Testing

### Local Testing
The wrapper uses localStorage when not in an LMS, enabling local development.

### LMS Testing
1. `npm run package`
2. Upload `course.zip` to your LMS
3. Launch and test

## Building Advanced Features

### Quizzes

```vue
<template>
  <div class="quiz">
    <div v-for="question in questions" :key="question.id">
      <p>{{ question.text }}</p>
      <button @click="selectAnswer(question.id, option)"
              v-for="option in question.options"
              :key="option">
        {{ option }}
      </button>
    </div>
    <button @click="submitQuiz">Submit</button>
  </div>
</template>
```

### Video Tracking

```vue
<template>
  <video @timeupdate="handleProgress" />
</template>

<script>
import { useScorm } from './composables/useScorm';

export default {
  setup() {
    const { saveProgress } = useScorm();
    
    const handleProgress = (e) => {
      saveProgress({ videoTime: e.target.currentTime });
    };
    
    return { handleProgress };
  }
};
</script>
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

