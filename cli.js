#!/usr/bin/env node

/**
 * create-scorm-course CLI
 * Main entry point for creating SCORM courses from templates
 */

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES = {
  vanilla: {
    name: 'Vanilla JavaScript',
    description: 'Plain HTML/CSS/JavaScript - Easiest for beginners',
    icon: '📝',
    dir: 'vanilla-starter'
  },
  react: {
    name: 'React',
    description: 'React 18 + Vite - Modern & popular',
    icon: '⚛️',
    dir: 'react-starter'
  },
  vue: {
    name: 'Vue',
    description: 'Vue 3 + Vite - Modern & easy',
    icon: '💚',
    dir: 'vue-starter'
  }
};

program
  .name('create-scorm-course')
  .description('Create a new SCORM 2004/xAPI course from a template')
  .argument('[project-name]', 'Name of your course project')
  .option('-t, --template <template>', 'Template to use: vanilla, react, or vue')
  .option('--no-install', 'Skip npm install')
  .action(async (projectName, options) => {
    await createCourse(projectName, options);
  });

program.parse();

async function createCourse(projectName, options) {
  console.log('🎓 Create SCORM Course\n');

  // Get project name
  if (!projectName) {
    projectName = await prompt('Project name: ');
    if (!projectName) {
      console.error('❌ Project name is required');
      process.exit(1);
    }
  }

  // Check if directory exists
  const targetDir = path.join(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Directory "${projectName}" already exists!`);
    console.log('   Choose a different name or delete the existing directory.');
    process.exit(1);
  }

  // Get template choice
  let template = options.template;
  if (!template) {
    console.log('Choose a template:\n');
    console.log('  1) vanilla - Plain HTML/CSS/JavaScript (recommended for beginners)');
    console.log('  2) react   - React 18 + Vite');
    console.log('  3) vue     - Vue 3 + Vite\n');

    const choice = await prompt('Select template (1-3): ');
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

  // Validate template
  if (!TEMPLATES[template]) {
    console.error(`❌ Invalid template: ${template}`);
    console.log(`   Valid templates: ${Object.keys(TEMPLATES).join(', ')}`);
    process.exit(1);
  }

  const templateInfo = TEMPLATES[template];
  
  console.log(`\n${templateInfo.icon} Creating ${templateInfo.name} course: ${projectName}\n`);

  // Find template directory
  const templateDir = path.join(__dirname, 'templates', templateInfo.dir);
  
  if (!fs.existsSync(templateDir)) {
    console.error(`❌ Template not found: ${templateDir}`);
    process.exit(1);
  }

  // Copy template
  console.log('📋 Copying template files...');
  copyDirectory(templateDir, targetDir);

  // Update package.json
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  console.log('✅ Course created successfully!\n');
  console.log(`📍 Location: ${targetDir}`);
  console.log(`${templateInfo.icon} Template: ${templateInfo.name}\n`);
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log('  npm run dev\n');
  console.log('🚀 Happy course building!');
}

/**
 * Copy directory recursively
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

/**
 * Prompt user for input
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

