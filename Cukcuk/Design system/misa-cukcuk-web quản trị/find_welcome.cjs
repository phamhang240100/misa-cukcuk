const fs = require('fs');

function findInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log(`--- ${filePath} ---`);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Chào mừng') || line.includes('MISA CukCuk') || line.includes('MISA CukCUk') || line.includes('Trả lời vài câu hỏi')) {
      console.log(`Line ${i+1}: ${line.trim()}`);
    }
  }
}

findInFile('src/components/LoginFlow.tsx');
findInFile('src/App.tsx');
