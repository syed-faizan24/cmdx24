const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Installing sharp and png-to-ico...');
execSync('npm install sharp png-to-ico --no-save', { stdio: 'inherit' });

const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#1e2128"/>
  <path d="M140 160 L280 256 L140 352" stroke="#00d1ff" stroke-width="48" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="300" y1="360" x2="400" y2="360" stroke="#00d1ff" stroke-width="48" stroke-linecap="round"/>
</svg>
`;

const iconsDir = path.join(__dirname, '../src-tauri/icons');
const publicDir = path.join(__dirname, '../public');

async function generate() {
  console.log('Generating base PNGs from SVG...');
  
  // 32x32
  await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(iconsDir, '32x32.png'));
  // 128x128
  await sharp(Buffer.from(svg)).resize(128, 128).png().toFile(path.join(iconsDir, '128x128.png'));
  // 256x256 (128x128@2x)
  await sharp(Buffer.from(svg)).resize(256, 256).png().toFile(path.join(iconsDir, '128x128@2x.png'));
  // icon.png (512x512)
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(iconsDir, 'icon.png'));
  // public logo
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(publicDir, 'logo.png'));
  
  console.log('Generating ICO...');
  const buf = await pngToIco(path.join(iconsDir, 'icon.png'));
  fs.writeFileSync(path.join(iconsDir, 'icon.ico'), buf);
  
  // Since we are on Windows, we can't easily generate a valid .icns file using simple node tools.
  // We will just copy the icon.png as a placeholder for icns or skip it.
  fs.copyFileSync(path.join(iconsDir, 'icon.png'), path.join(iconsDir, 'icon.icns'));
  
  console.log('All icons generated successfully!');
}

generate().catch(console.error);
