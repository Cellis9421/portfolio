const glob = require('glob');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
(async () => {

    console.log('Compressing images...');
    // Normally next/image would handle this, but since we are not using hosting on Vercel, we need to manually compress the images on build
    // recuresively compress all images in the docs/img directory and sub directories
    const PUBLIC_IMAGES_DIR = './public/img/**/*.{jpg,png}';
    const OUTPUT_DIR = './public/imgthumb/';
    // Loop over all images in the public directory and sub directories and compress them

    const imagePaths = glob.sync(PUBLIC_IMAGES_DIR);
    console.log(`Found ${imagePaths.length} images to compress`);

    // makesure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        console.log(`Creating output directory "${OUTPUT_DIR}"`);
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const imagePath of imagePaths) {
        // replace "\img\" with "\imgthumb\" in the path
        const output = imagePath.replace('\\img\\', '\\imgthumb\\');
        console.log(`Compressing image in "${imagePath}" to "${output}"`)

        try {
            // Create image buffer
            let imageBuffer = await sharp(imagePath)
                .resize(500, 240, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toBuffer();

            // Check file size of image
            const fileSize = imageBuffer.length / 1024;

            // If its still over 20kb, compress further
            if (fileSize > 10) {
                console.log(`Image is still over 20kb (${fileSize.toFixed(2)}kb), compressing further`);
                imageBuffer = await sharp(imageBuffer)
                    .webp({ quality: 50 })
                    .toBuffer();
                console.log(`New file size: ${imageBuffer.length / 1024}kb`);
            }

            // makesure the output directory exists
            const outputDir = path.dirname(output);
            if (!fs.existsSync(outputDir)) {
                console.log(`Creating output directory "${outputDir}"`);
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(output, imageBuffer);
        } catch (error) {
            console.error('Error compressing image', error);
        }
    }


    console.log('Successfully compressed images');
})();