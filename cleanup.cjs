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
      
      content = content.replace(/import \{ Link \} from "wouter";?/g, 'import Link from "next/link";');
      content = content.replace(/import \{ Link \} from 'wouter';?/g, 'import Link from "next/link";');
      content = content.replace(/import \{ useLocation \} from "wouter";?/g, 'import { usePathname, useRouter } from "next/navigation";');
      content = content.replace(/import \{ useLocation \} from 'wouter';?/g, 'import { usePathname, useRouter } from "next/navigation";');
      content = content.replace(/import \{ Link, useLocation \} from "wouter";?/g, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
      content = content.replace(/import \{ Link, useLocation \} from 'wouter';?/g, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
      content = content.replace(/import \{ useLocation, Link \} from "wouter";?/g, 'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');
      
      content = content.replace(/const \[.*,\s*setLocation\s*\] = useLocation\(\);?/g, 'const router = useRouter();');
      content = content.replace(/const \[\s*location\s*\] = useLocation\(\);?/g, 'const location = usePathname();');
      content = content.replace(/setLocation\(/g, 'router.push(');
      
      if (content !== orig) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}
processDir('src');
