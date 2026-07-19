const fs = require('fs');
const content = fs.readFileSync('src/components/views/WorkspaceView.tsx', 'utf8');
const lines = content.split('\n');

function findFunction(name) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const ' + name) || lines[i].includes('function ' + name)) {
      start = i;
      break;
    }
  }
  if (start === -1) return;
  console.log(`\n=== Function: ${name} (around line ${start+1}) ===`);
  let openBraces = 0;
  let closed = false;
  for (let i = start; i < lines.length && i < start + 150; i++) {
    console.log(`${i+1}: ${lines[i]}`);
    const matchesOpen = lines[i].match(/{/g);
    const matchesClose = lines[i].match(/}/g);
    if (matchesOpen) openBraces += matchesOpen.length;
    if (matchesClose) openBraces -= matchesClose.length;
    if (openBraces === 0 && i > start) {
      break;
    }
  }
}

findFunction('handleOpenAddArea');
findFunction('handleOpenEditStep5Area');
findFunction('handleOpenDesigner');
findFunction('handleSaveArea');
findFunction('handleSaveDesigner');
