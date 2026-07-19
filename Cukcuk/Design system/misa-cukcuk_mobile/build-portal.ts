import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.copyFileSync(
  path.resolve(process.cwd(), 'portal/index.html'),
  path.resolve(distDir, 'index.html')
);

console.log('Portal copied successfully to dist/index.html');
