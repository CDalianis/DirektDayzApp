import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resDir = path.join(__dirname, '../android/app/src/main/res');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 108 108">
  <rect width="108" height="108" fill="#FFF4D6"/>
  <rect width="108" height="108" fill="#E8B84A" opacity="0.35"/>
  <path fill="#C8860A" d="M38,32h32c2,0 4,2 4,4v4H34v-4c0,-2 2,-4 4,-4z"/>
  <path fill="#9A6608" d="M36,40h36v38c0,6 -5,10 -11,10H47c-6,0 -11,-4 -11,-10z"/>
  <path fill="#F5D78E" d="M40,52h28v18c0,3 -2,5 -5,5H47c-3,0 -5,-2 -5,-5z"/>
  <path fill="#E8B84A" d="M42,32h24v3H42z"/>
  <path fill="#FFF8E8" fill-opacity="0.9" d="M48,58l4,-2.3 4,2.3v4.6l-4,2.3 -4,-2.3z"/>
  <path fill="#FFF8E8" fill-opacity="0.7" d="M56,62l4,-2.3 4,2.3v4.6l-4,2.3 -4,-2.3z"/>
  <path fill="#2D2416" d="M68,28c3,0 5,2 5,4.5c0,2 -1.5,3.5 -3.5,4.2l1.5,5.3h-2.2l-1.2,-4.2c-0.3,0 -0.6,0 -0.9,0s-0.6,0 -0.9,0l-1.2,4.2h-2.2l1.5,-5.3c-2,-0.7 -3.5,-2.2 -3.5,-4.2c0,-2.5 2,-4.5 5,-4.5z"/>
  <path fill="#F5D78E" d="M66.5,30.5h3v2.5h-3z"/>
  <path fill="#F5D78E" d="M66.5,34.5h3v2h-3z"/>
</svg>`;

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

for (const [folder, size] of Object.entries(sizes)) {
  const dir = path.join(resDir, folder);
  const png = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  for (const name of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
    fs.writeFileSync(path.join(dir, name), png);
  }
}

console.log('Android launcher PNGs updated.');
