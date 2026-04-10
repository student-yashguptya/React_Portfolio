const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const importRegex = /from\s+['"]([^'"]+)['"]/g;

allFiles.forEach(file => {
  if (!file.endsWith('.js') && !file.endsWith('.jsx')) return;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const dir = path.dirname(file);
      const parts = importPath.split('/');
      let currentDir = dir;
      
      for (const part of parts) {
        if (part === '.') continue;
        if (part === '..') {
          currentDir = path.dirname(currentDir);
          continue;
        }
        
        const items = fs.readdirSync(currentDir);
        // Look for exact match
        if (items.includes(part)) {
          currentDir = path.join(currentDir, part);
        } else {
          // Look for case-insensitive match (potential error)
          const ciMatch = items.find(i => i.toLowerCase() === part.toLowerCase());
          if (ciMatch) {
             console.log(`CASE MISMATCH in ${path.relative(process.cwd(), file)}:`);
             console.log(`  Expected: ${part}`);
             console.log(`  Actual:   ${ciMatch}`);
             currentDir = path.join(currentDir, ciMatch);
          } else {
            // Check for file extensions
            const withExt = items.find(i => {
                const base = path.basename(i, path.extname(i));
                return base === part; // exact case match for base name
            });
            const ciWithExt = items.find(i => {
                const base = path.basename(i, path.extname(i));
                return base.toLowerCase() === part.toLowerCase(); // case insensitive
            });

            if (withExt) {
                // Correct case, just missing extension in import
                break; 
            } else if (ciWithExt) {
                console.log(`CASE MISMATCH (extension) in ${path.relative(process.cwd(), file)}:`);
                console.log(`  Imported: ${part}`);
                console.log(`  Actual:   ${path.basename(ciWithExt, path.extname(ciWithExt))}`);
                break;
            }
          }
        }
      }
    }
  }
});
