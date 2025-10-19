# SCORM Wrapper - Vanilla JavaScript Demo

This demo showcases all features of the SCORM/xAPI wrapper using vanilla JavaScript.

## Running the Demo

### Option 1: Simple HTTP Server

```bash
npx http-server . -p 8080 -o
```

### Option 2: Python

```bash
python3 -m http.server 8080
```

### Option 3: PHP

```bash
php -S localhost:8080
```

Then open http://localhost:8080 in your browser.

## Features Demonstrated

1. **Environment Detection** - Shows which environment was detected (SCORM, xAPI, or local)
2. **Save Progress** - Save custom key-value pairs
3. **Load Progress** - Retrieve saved progress
4. **Set Score** - Set course score (0-100)
5. **Mark Complete** - Mark course as completed
6. **Event Logging** - Real-time log of all SCORM operations

## Local Testing

Since this demo runs outside an LMS, it will automatically use localStorage. Try:

1. Save some progress data
2. Refresh the page
3. Load progress - you'll see your saved data

This demonstrates the resume functionality that will work in a real LMS.

