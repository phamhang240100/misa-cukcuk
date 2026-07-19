const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// Let's print lines 1830 to 1950 of App.tsx
for (let i = 1830; i <= 1950; i++) {
  console.log(`${i}: ${lines[i-1]}`);
}
