/**
 * Simple build script for vanilla template
 * Copies files to dist folder and bundles the wrapper
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create dist directory
fs.mkdirSync(distDir, { recursive: true });

// Copy HTML, CSS files
const filesToCopy = ['index.html', 'styles.css'];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

// Copy the wrapper library
const wrapperSrc = path.join(__dirname, '..', '..', 'dist', 'scorm-wrapper.esm.js');
const wrapperDest = path.join(distDir, 'scorm-wrapper.esm.js');

if (fs.existsSync(wrapperSrc)) {
  fs.copyFileSync(wrapperSrc, wrapperDest);
  console.log('✓ Copied SCORM wrapper');
} else {
  console.warn('Warning: SCORM wrapper not found. Run npm run build in root directory first.');
}

// Copy course.js and update import path
const courseJs = fs.readFileSync(path.join(__dirname, 'course.js'), 'utf8');
const updatedCourseJs = courseJs.replace(
  "import ScormWrapper from '../../dist/scorm-wrapper.esm.js';",
  "import ScormWrapper from './scorm-wrapper.esm.js';"
);
fs.writeFileSync(path.join(distDir, 'course.js'), updatedCourseJs);
console.log('✓ Copied course.js');

console.log('\n✓ Build complete! Files in dist/');

