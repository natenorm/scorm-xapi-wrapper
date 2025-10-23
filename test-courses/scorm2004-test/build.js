import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}

// Create dist directory
fs.mkdirSync(distDir, { recursive: true });

// Copy HTML, CSS, JS files, and SCORM manifest
const filesToCopy = ['index.html', 'styles.css', 'course.js', 'imsmanifest.xml'];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

// Copy the wrapper library from parent project
const wrapperSrc = path.join(__dirname, '..', '..', 'dist', 'scorm-wrapper.esm.js');
const wrapperDest = path.join(distDir, 'scorm-wrapper.esm.js');

if (fs.existsSync(wrapperSrc)) {
  fs.copyFileSync(wrapperSrc, wrapperDest);
  console.log('✓ Copied SCORM wrapper');
} else {
  console.warn('Warning: SCORM wrapper not found. Run npm run build in root directory first.');
  console.warn(`Looking for: ${wrapperSrc}`);
}

console.log('\n✓ Build complete! Files in dist/');
console.log('  Run "npm run package" to create SCORM package.');


