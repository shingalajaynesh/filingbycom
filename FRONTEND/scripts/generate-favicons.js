/* global process */
import { Jimp } from 'jimp';
import fs from 'fs';

async function generate() {
  console.log('Reading public/logo1.png...');
  const image = await Jimp.read('public/logo1.png');
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  const size = Math.min(width, height);
  const x = Math.floor((width - size) / 2);
  const y = Math.floor((height - size) / 2);
  
  console.log(`Cropping square of size ${size} at (${x}, ${y}) from original ${width}x${height}...`);
  
  const cropped = image.clone().crop({ x, y, w: size, h: size });
  
  // Generate 16x16
  const img16 = cropped.clone().resize({ w: 16, h: 16 });
  await img16.write('public/favicon-16x16.png');
  console.log('Generated public/favicon-16x16.png');

  // Generate 32x32
  const img32 = cropped.clone().resize({ w: 32, h: 32 });
  await img32.write('public/favicon-32x32.png');
  console.log('Generated public/favicon-32x32.png');

  // Generate 180x180 apple-touch-icon
  const imgApple = cropped.clone().resize({ w: 180, h: 180 });
  await imgApple.write('public/apple-touch-icon.png');
  console.log('Generated public/apple-touch-icon.png');

  // Copy 32x32 PNG to favicon.ico (modern browsers handle PNG buffers for .ico)
  fs.copyFileSync('public/favicon-32x32.png', 'public/favicon.ico');
  console.log('Copied favicon-32x32.png to public/favicon.ico successfully!');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
