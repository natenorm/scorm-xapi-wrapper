#!/usr/bin/env node

/**
 * SCORM Course Scaffolding CLI
 * Creates new course projects from templates
 */

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

program
  .name('create-scorm-course')
  .description('Create a new SCORM course project from a template')
  .argument('[project-name]', 'Project name')
  .option('-t, --template <template>', 'Template to use (vanilla, react, vue)')
  .parse(process.argv);

const projectName = program.args[0];
const options = program.opts();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🎓 SCORM Course Creator\n');
  
  // Get project name
  let name = projectName;
  if (!name) {
    name = await prompt('Project name: ');
    if (!name) {
      console.error('Error: Project name is required');
      process.exit(1);
    }
  }
  
  // Get template choice
  let template = options.template;
  if (!template) {
    console.log('\nAvailable templates:');
    console.log('  1) vanilla - Plain HTML/CSS/JavaScript');
    console.log('  2) react   - React with Vite');
    console.log('  3) vue     - Vue with Vite');
    
    const choice = await prompt('\nChoose template (1-3): ');
    
    switch (choice.trim()) {
      case '1':
        template = 'vanilla';
        break;
      case '2':
        template = 'react';
        break;
      case '3':
        template = 'vue';
        break;
      default:
        template = 'vanilla';
    }
  }
  
  rl.close();
  
  // Validate template
  const validTemplates = ['vanilla', 'react', 'vue'];
  if (!validTemplates.includes(template)) {
    console.error(`Error: Invalid template "${template}"`);
    console.log(`Valid templates: ${validTemplates.join(', ')}`);
    process.exit(1);
  }
  
  const templateDir = path.join(__dirname, '..', 'templates', `${template}-starter`);
  const targetDir = path.join(process.cwd(), name);
  
  // Check if template exists
  if (!fs.existsSync(templateDir)) {
    console.error(`Error: Template directory not found: ${templateDir}`);
    process.exit(1);
  }
  
  // Check if target directory exists
  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory already exists: ${targetDir}`);
    process.exit(1);
  }
  
  // Copy template
  console.log(`\nCreating new ${template} course: ${name}`);
  console.log(`  Template: ${template}-starter`);
  console.log(`  Location: ${targetDir}\n`);
  
  copyDirectory(templateDir, targetDir);
  
  // Update package.json name
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = name;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
  
  console.log('✓ Course created successfully!\n');
  console.log('Next steps:');
  console.log(`  cd ${name}`);
  console.log('  npm install');
  console.log('  npm run dev        # Start development server');
  console.log('  npm run build      # Build for production');
  console.log('  npm run package    # Create SCORM package\n');
}

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

