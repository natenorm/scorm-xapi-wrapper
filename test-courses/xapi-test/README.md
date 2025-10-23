# xAPI Test Course

This is a comprehensive test course for the **xAPI (Experience API)** functionality of the `scorm-xapi-wrapper`.

## What This Tests

✅ **xAPI Initialization** - Connecting to an LRS  
✅ **Statement Tracking** - Sending experience statements  
✅ **Progress Persistence** - Saving/loading state  
✅ **Completion Tracking** - Course completion statements  
✅ **Score Reporting** - Quiz results via xAPI  
✅ **Interaction Tracking** - Custom learning interactions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Locally

```bash
npm run dev
```

This will:
- Build the course
- Start a local HTTP server
- Open in your browser
- Use localStorage for local testing

### 3. Package for LRS

```bash
npm run package
```

This creates `xapi-test.zip` ready for upload to your LRS!

## Testing in an LRS

### Option 1: SCORM Cloud (Supports xAPI)

1. Go to [SCORM Cloud](https://cloud.scorm.com/)
2. Create a free account
3. Upload `xapi-test.zip`
4. Launch the course
5. Complete the course and check the statements in the LRS

### Option 2: Local LRS (Learning Locker, etc.)

1. Set up a local LRS (e.g., Learning Locker)
2. Get your endpoint URL and auth credentials
3. Update the configuration in `course.js`:

```javascript
const xapiConfig = {
    endpoint: 'https://your-lrs.com/data/xAPI',
    auth: 'Basic your-base64-auth',
    actor: {
        name: 'Your Name',
        mbox: 'mailto:you@example.com'
    }
};
```

4. Rebuild and test: `npm run package`

## What You Should See

### During the Course:
- **Page 1**: Introduction to xAPI
- **Page 2**: Understanding xAPI concepts
- **Page 3**: Interactive tracking buttons
- **Page 4**: 5-question quiz
- **Page 5**: Final results

### In the Debug Panel:
- Current environment (xapi or local)
- Current page number
- Quiz score
- Completion status
- **Statement count and recent statements**

### In Your LRS:
All statements sent, including:
- `experienced` - Page views and interactions
- `answered` - Quiz question responses
- `scored` - Quiz results
- `completed` - Course completion

## xAPI vs SCORM

| Feature | SCORM | xAPI |
|---------|-------|------|
| **API Location** | Window API (`API_1484_11`) | HTTP REST API |
| **Data Format** | Key-value pairs | JSON statements |
| **Requires LMS** | Yes | No (uses LRS) |
| **Offline Tracking** | No | Yes (can queue) |
| **Flexibility** | Limited | Very flexible |

## Statement Example

```json
{
  "actor": {
    "name": "Test User",
    "mbox": "mailto:test@example.com"
  },
  "verb": {
    "id": "http://adlnet.gov/expapi/verbs/completed",
    "display": { "en-US": "completed" }
  },
  "object": {
    "id": "https://example.com/course/xapi-test",
    "definition": {
      "name": { "en-US": "xAPI Test Course" }
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Troubleshooting

### "No statements sent to LRS"

**Local Testing**: Statements are logged to console but not actually sent. This is normal! The wrapper uses localStorage for local development.

**LRS Testing**: Make sure your LRS endpoint and auth are configured correctly in `course.js`.

### "401 Unauthorized"

Your LRS credentials are incorrect. Double-check:
- Endpoint URL
- Auth token (should be Base64 encoded `username:password`)

### "CORS Error"

Your LRS needs to have CORS enabled for cross-origin requests. Check your LRS settings.

## Next Steps

1. ✅ Review the statements in your LRS
2. ✅ Try modifying the course to send custom statements
3. ✅ Integrate the wrapper into your own courses
4. ✅ Use the wrapper with React, Vue, or vanilla JS!

## Need Help?

Check the main README or open an issue on GitHub!

