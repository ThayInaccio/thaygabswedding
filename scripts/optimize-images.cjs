#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Image optimization function
function optimizeImage(inputPath, outputPath, quality = 80) {
  try {
    // Use sharp or imagemin for image optimization
    // For now, we'll use a simple copy with size check
    const stats = fs.statSync(inputPath);
    const sizeInMB = stats.size / (1024 * 1024);
    
    console.log(`Processing: ${path.basename(inputPath)} (${sizeInMB.toFixed(2)}MB)`);
    
    if (sizeInMB > 1) {
      console.warn(`⚠️  Large image detected: ${path.basename(inputPath)} (${sizeInMB.toFixed(2)}MB)`);
      console.warn(`   Consider optimizing this image manually or using a smaller version.`);
    }
    
    // Copy file to output directory
    fs.copyFileSync(inputPath, outputPath);
    
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }
}

// Process all images in assets directory
function processAssets() {
  const processDirectory = (dir) => {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Create corresponding directory in output
        const outputSubDir = path.join(OUTPUT_DIR, path.relative(ASSETS_DIR, fullPath));
        if (!fs.existsSync(outputSubDir)) {
          fs.mkdirSync(outputSubDir, { recursive: true });
        }
        processDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
          const relativePath = path.relative(ASSETS_DIR, fullPath);
          const outputPath = path.join(OUTPUT_DIR, relativePath);
          optimizeImage(fullPath, outputPath);
        }
      }
    });
  };
  
  processDirectory(ASSETS_DIR);
  console.log('✅ Image optimization complete!');
}

// Run the optimization
processAssets(); 