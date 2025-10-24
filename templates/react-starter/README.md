# React SCORM Course Template

A modern React template for creating SCORM-compliant e-learning courses using React and Vite.

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
├── App.jsx              # Main application component
├── main.jsx             # Entry point
├── styles.css           # Global styles
├── hooks/
│   └── useScorm.js      # SCORM integration hook
├── components/
│   ├── Navigation.jsx   # Navigation component
│   └── ProgressBar.jsx  # Progress bar component
└── pages/
    ├── Page1.jsx        # Course pages
    ├── Page2.jsx
    ├── Page3.jsx
    └── Page4.jsx
```

## Customization

### Adding Pages

1. Create a new page component in `src/pages/`:
```jsx
function Page5() {
  return (
    <div className="page">
      <h2>Page 5: Your Content</h2>
      <p>Your content here...</p>
    </div>
  );
}

export default Page5;
```

2. Import and add to `PAGES` array in `App.jsx`:
```jsx
import Page5 from './pages/Page5';

const PAGES = [Page1, Page2, Page3, Page4, Page5];
```

### Using the SCORM Hook

The `useScorm` hook provides easy access to SCORM functionality:

```jsx
import { useScorm } from './hooks/useScorm';

function MyComponent() {
  const { saveProgress, setComplete, setScore } = useScorm();
  
  const handleSubmit = async () => {
    await saveProgress({ answer: 'correct' });
    await setScore(100);
    await setComplete();
  };
  
  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Custom Styling

Modify `src/styles.css` or add component-specific styles.

### State Management

For complex courses, consider adding:
- Redux or Zustand for global state
- React Query for data fetching
- React Router for advanced navigation

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

```jsx
function Quiz({ onScore }) {
  const [answers, setAnswers] = useState({});
  
  const handleSubmit = () => {
    const score = calculateScore(answers);
    onScore(score);
  };
  
  return (
    <div className="quiz">
      {/* Quiz questions */}
    </div>
  );
}
```

### Video Tracking

```jsx
function VideoPage() {
  const { saveProgress } = useScorm();
  
  const handleProgress = (time) => {
    saveProgress({ videoTime: time });
  };
  
  return <video onTimeUpdate={(e) => handleProgress(e.target.currentTime)} />;
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

