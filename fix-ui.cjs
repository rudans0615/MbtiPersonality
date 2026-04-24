const fs = require('fs');
['src/components/ui/toaster.tsx', 'src/components/ui/toast.tsx', 'src/components/ui/use-toast.ts', 'src/hooks/use-toast.ts'].forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(f, '"use client";\n' + content, 'utf8');
      console.log('Fixed ' + f);
    }
  }
});
