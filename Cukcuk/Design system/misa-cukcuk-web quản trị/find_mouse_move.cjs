const fs = require('fs');
const content = fs.readFileSync('src/components/views/WorkspaceView.tsx', 'utf8');
const lines = content.split('\n');

let found = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('handleCanvasMouseMove')) {
    console.log(`Starts at line ${i+1}`);
    found = true;
    for (let j = i; j < i + 100; j++) {
      console.log(`${j+1}: ${lines[j]}`);
      if (lines[j].trim() === '};' && j > i + 10) {
        console.log(`Ends at line ${j+1}`);
        break;
      }
    }
  }
}
