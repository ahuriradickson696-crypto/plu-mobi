import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

async function compressImages() {
  console.log('🔍 Searching for large images in public/leaders...');
  const files = await glob('public/leaders/*.{jpg,jpeg,png}');
  let compressedCount = 0;

  for (const file of files) {
    const stats = fs.statSync(file);
    const sizeInMB = stats.size / (1024 * 1024);

    // Only compress if the file is over 1MB
    if (sizeInMB > 1) {
      console.log(`⏳ Compressing ${path.basename(file)} (${sizeInMB.toFixed(2)} MB)...`);
      
      const tempPath = file + '.tmp';
      
      // Resize to max 1000px, compress to 80% quality
      await sharp(file)
        .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(tempPath);

      // Replace original with compressed version
      fs.renameSync(tempPath, file);
      
      const newStats = fs.statSync(file);
      const newSizeInMB = newStats.size / (1024 * 1024);
      console.log(`✅ ${path.basename(file)}: ${sizeInMB.toFixed(2)} MB -> ${newSizeInMB.toFixed(2)} MB`);
      compressedCount++;
    }
  }
  if (compressedCount === 0) {
    console.log('✨ All images are already under 1MB. No compression needed.');
  } else {
    console.log(`🎉 Successfully compressed ${compressedCount} images!`);
  }
}

compressImages().catch(console.error);