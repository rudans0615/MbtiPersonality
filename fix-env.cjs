const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let orig = content;
      
      content = content.replace(/import\.meta\.env\.DEV/g, "process.env.NODE_ENV !== 'production'");
      content = content.replace(/import\.meta\.env/g, "process.env");
      
      if (content !== orig) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated env in ' + fullPath);
      }
    }
  }
}
processDir('src');
