const fs = require('fs');
const content = fs.readFileSync('src/components/LoginFlow.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.toLowerCase().includes('chào mừng') || line.toLowerCase().includes('misa cukcuk') || line.toLowerCase().includes('trả lời')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
}
