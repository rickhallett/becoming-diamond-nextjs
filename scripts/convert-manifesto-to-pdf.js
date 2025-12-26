/**
 * Convert Diamond Manifesto PNG to optimized PDF
 * Uses sharp for image processing and PDFKit for PDF generation
 */

const sharp = require('sharp');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function convertManifestToPDF() {
  const inputPath = path.join(process.cwd(), 'public', 'Diamond Manifesto.png');
  const outputPath = path.join(process.cwd(), 'public', 'assets', 'diamond-manifesto.pdf');

  console.log('🔄 Converting Diamond Manifesto to PDF...');
  console.log(`📁 Input: ${inputPath}`);
  console.log(`📁 Output: ${outputPath}`);

  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`📊 Original image: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)} MB`);

    // Optimize image (reduce size while maintaining quality)
    const optimizedImagePath = path.join(process.cwd(), 'public', 'assets', 'diamond-manifesto-optimized.png');

    await sharp(inputPath)
      .resize(1200, null, { // Max width 1200px (good for email)
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(optimizedImagePath);

    const optimizedMetadata = await sharp(optimizedImagePath).metadata();
    console.log(`✨ Optimized image: ${optimizedMetadata.width}x${optimizedMetadata.height}`);

    // Create PDF
    const doc = new PDFDocument({
      size: [optimizedMetadata.width, optimizedMetadata.height],
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    // Pipe to file
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Add image to PDF (full page)
    doc.image(optimizedImagePath, 0, 0, {
      width: optimizedMetadata.width,
      height: optimizedMetadata.height
    });

    // Add metadata
    doc.info['Title'] = 'The Diamond Manifesto';
    doc.info['Author'] = 'Becoming Diamond';
    doc.info['Subject'] = 'Personal development and presence mastery';
    doc.info['Keywords'] = 'diamond, manifesto, presence, consciousness';

    doc.end();

    // Wait for PDF to finish writing
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Check output file size
    const stats = fs.statSync(outputPath);
    const fileSizeKB = stats.size / 1024;
    const fileSizeMB = fileSizeKB / 1024;

    console.log(`✅ PDF created: ${fileSizeKB.toFixed(0)} KB (${fileSizeMB.toFixed(2)} MB)`);

    if (fileSizeKB > 500) {
      console.warn(`⚠️  Warning: PDF size (${fileSizeKB.toFixed(0)} KB) exceeds recommended 500 KB for email attachments`);
      console.warn('   Consider further optimization or reducing image dimensions');
    } else {
      console.log('✅ PDF size is within recommended limits for email attachments');
    }

    // Clean up optimized PNG
    fs.unlinkSync(optimizedImagePath);
    console.log('🧹 Cleaned up temporary files');

    console.log('\n✨ Conversion complete!');
    console.log(`📄 PDF ready at: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error converting manifesto:', error);
    process.exit(1);
  }
}

// Run conversion
convertManifestToPDF();
