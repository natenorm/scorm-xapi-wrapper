#!/usr/bin/env node

/**
 * xAPI Package Builder CLI
 * Creates xAPI (Tin Can) packages from course content
 */

import { program } from 'commander';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('package-xapi')
  .description('Package course content into xAPI ZIP file')
  .option('-i, --input <directory>', 'Input directory containing course files')
  .option('-o, --output <file>', 'Output ZIP file path', 'course-xapi.zip')
  .option('-t, --title <title>', 'Course title', 'Course')
  .option('-d, --description <description>', 'Course description', '')
  .option('-id, --identifier <id>', 'Course activity ID', generateActivityId())
  .parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Error: Input directory is required');
  console.log('Usage: package-xapi -i <input-directory> [-o <output.zip>]');
  process.exit(1);
}

const inputDir = path.resolve(options.input);
const outputFile = path.resolve(options.output);

if (!fs.existsSync(inputDir)) {
  console.error(`Error: Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

console.log('Creating xAPI package...');
console.log(`  Input: ${inputDir}`);
console.log(`  Output: ${outputFile}`);

// Create tincan.xml
const manifest = createTinCanManifest(options);

// Create ZIP archive
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`✓ xAPI package created: ${outputFile}`);
  console.log(`  Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});

archive.on('error', (err) => {
  console.error('Error creating package:', err);
  process.exit(1);
});

archive.pipe(output);

// Add tincan.xml manifest
archive.append(manifest, { name: 'tincan.xml' });

// Add all files from input directory
archive.directory(inputDir, false);

archive.finalize();

/**
 * Create tincan.xml manifest for xAPI
 */
function createTinCanManifest(options) {
  const { identifier, title, description } = options;
  
  // Find the entry point HTML file
  const entryPoint = findEntryPoint(inputDir);
  
  const desc = description || `${title} - xAPI course`;
  
  return `<?xml version="1.0" encoding="utf-8" ?>
<tincan xmlns="http://projecttincan.com/tincan.xsd">
    <activities>
        <activity id="${identifier}" type="http://adlnet.gov/expapi/activities/course">
            <name>${escapeXml(title)}</name>
            <description lang="en-US">${escapeXml(desc)}</description>
            <launch lang="en-US">${entryPoint}</launch>
        </activity>
    </activities>
</tincan>`;
}

/**
 * Find entry point HTML file
 */
function findEntryPoint(dir) {
  const candidates = ['index.html', 'index.htm', 'main.html', 'course.html'];
  
  for (const file of candidates) {
    if (fs.existsSync(path.join(dir, file))) {
      return file;
    }
  }
  
  // Find any HTML file
  const files = fs.readdirSync(dir);
  const htmlFile = files.find(f => f.endsWith('.html') || f.endsWith('.htm'));
  
  if (htmlFile) {
    return htmlFile;
  }
  
  console.warn('Warning: No HTML entry point found, using index.html');
  return 'index.html';
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate unique activity ID (URL format for xAPI)
 */
function generateActivityId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `http://example.com/courses/${timestamp}-${random}`;
}

