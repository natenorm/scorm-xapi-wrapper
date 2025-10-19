# Vanilla JavaScript SCORM Course Template

A ready-to-use template for creating SCORM-compliant e-learning courses using vanilla HTML, CSS, and JavaScript.

## Getting Started

### Installation

```bash
npm install
```

### Development

Start a local development server:

```bash
npm run dev
```

This will open the course in your browser at `http://localhost:8080`.

### Building

Build the course for production:

```bash
npm run build
```

This creates a `dist/` folder with all course files ready for deployment.

### Creating SCORM Package

Create a SCORM-compliant ZIP package:

```bash
npm run package
```

This generates `course.zip` that can be uploaded to any SCORM-compliant LMS (Moodle, Canvas, Blackboard, etc.).

## Customization

### Adding Pages

1. Add a new page div in `index.html`:
```html
<div class="page" data-page="5">
  <h2>Page 5: Your Content</h2>
  <p>Your content here...</p>
</div>
```

2. Update `totalPages` in `course.js`:
```javascript
const totalPages = 5; // Increase this number
```

### Styling

Modify `styles.css` to change the appearance of your course.

### Course Logic

Edit `course.js` to add interactivity, quizzes, or custom tracking.

## SCORM Integration

The template automatically:
- Initializes SCORM connection on load
- Saves progress every 30 seconds
- Saves progress when navigating between pages
- Resumes from last position when reopening
- Tracks completion and scores

### Custom Tracking

```javascript
// Save custom data
userData.customField = 'value';
saveProgress();

// Set score (0-100)
await ScormWrapper.setScore(85);

// Mark complete
await ScormWrapper.setComplete();
```

## Testing

### Local Testing
The wrapper automatically uses localStorage when not in an LMS, so you can develop and test locally.

### LMS Testing
1. Build and package: `npm run package`
2. Upload `course.zip` to your LMS
3. Launch the course from the LMS

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

