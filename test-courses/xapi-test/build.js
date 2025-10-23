import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

// Clean and create dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// Copy course files
const filesToCopy = ['index.html', 'course.js', 'styles.css'];

filesToCopy.forEach(file => {
    fs.copyFileSync(
        path.join(__dirname, file),
        path.join(distDir, file)
    );
});

// Copy the wrapper from node_modules or local build
let wrapperSource;
const nodeModulesWrapper = path.join(__dirname, 'node_modules', 'scorm-xapi-wrapper', 'dist', 'scorm-wrapper.esm.js');
const localWrapper = path.join(__dirname, '..', '..', 'dist', 'scorm-wrapper.esm.js');

if (fs.existsSync(nodeModulesWrapper)) {
    wrapperSource = nodeModulesWrapper;
    console.log('Using wrapper from node_modules');
} else if (fs.existsSync(localWrapper)) {
    wrapperSource = localWrapper;
    console.log('Using wrapper from local parent directory');
} else {
    console.error('Error: scorm-wrapper.esm.js not found!');
    console.error('Please run "npm run build" in the parent directory first.');
    process.exit(1);
}

fs.copyFileSync(
    wrapperSource,
    path.join(distDir, 'scorm-wrapper.esm.js')
);

console.log('✅ Build complete! Files copied to dist/');

