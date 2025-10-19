#!/usr/bin/env node

/**
 * SCORM Package Builder CLI
 * Creates SCORM 2004 4th Edition packages from course content
 */

const { program } = require('commander');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

program
  .name('package-scorm')
  .description('Package course content into SCORM 2004 ZIP file')
  .option('-i, --input <directory>', 'Input directory containing course files')
  .option('-o, --output <file>', 'Output ZIP file path', 'course.zip')
  .option('-t, --title <title>', 'Course title', 'Course')
  .option('-d, --description <description>', 'Course description', '')
  .option('-id, --identifier <id>', 'Course identifier', generateId())
  .parse(process.argv);

const options = program.opts();

if (!options.input) {
  console.error('Error: Input directory is required');
  console.log('Usage: package-scorm -i <input-directory> [-o <output.zip>]');
  process.exit(1);
}

const inputDir = path.resolve(options.input);
const outputFile = path.resolve(options.output);

if (!fs.existsSync(inputDir)) {
  console.error(`Error: Input directory does not exist: ${inputDir}`);
  process.exit(1);
}

console.log('Creating SCORM package...');
console.log(`  Input: ${inputDir}`);
console.log(`  Output: ${outputFile}`);

// Create imsmanifest.xml
const manifest = createManifest(options);

// Create ZIP archive
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log(`✓ SCORM package created: ${outputFile}`);
  console.log(`  Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});

archive.on('error', (err) => {
  console.error('Error creating package:', err);
  process.exit(1);
});

archive.pipe(output);

// Add manifest
archive.append(manifest, { name: 'imsmanifest.xml' });

// Add all files from input directory
archive.directory(inputDir, false);

archive.finalize();

/**
 * Create SCORM 2004 4th Edition manifest
 */
function createManifest(options) {
  const { identifier, title, description } = options;
  const orgId = `${identifier}-org`;
  const itemId = `${identifier}-item`;
  const resourceId = `${identifier}-resource`;
  
  // Find the entry point HTML file
  const entryPoint = findEntryPoint(inputDir);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                      http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                      http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd
                      http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd
                      http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  
  <organizations default="${orgId}">
    <organization identifier="${orgId}">
      <title>${escapeXml(title)}</title>
      <item identifier="${itemId}" identifierref="${resourceId}">
        <title>${escapeXml(title)}</title>
      </item>
    </organization>
  </organizations>
  
  <resources>
    <resource identifier="${resourceId}" type="webcontent" 
              adlcp:scormType="sco" href="${entryPoint}">
${generateResourceFiles(inputDir)}
    </resource>
  </resources>
  
</manifest>`;
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
 * Generate resource file entries for manifest
 */
function generateResourceFiles(dir, baseDir = '') {
  let files = [];
  
  const entries = fs.readdirSync(path.join(dir, baseDir));
  
  for (const entry of entries) {
    const fullPath = path.join(dir, baseDir, entry);
    const relativePath = path.join(baseDir, entry);
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(generateResourceFiles(dir, relativePath));
    } else {
      files.push(`      <file href="${relativePath.replace(/\\/g, '/')}" />`);
    }
  }
  
  return files.join('\n');
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
 * Generate unique identifier
 */
function generateId() {
  return `course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

