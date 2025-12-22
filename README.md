# MBTI Personality Test (Vercel Static Setup)

This project now targets a static deployment on Vercel.

## Vercel settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (uses the checked-in `package-lock.json`)

Client-side routing is handled by Vercel rewrites (see `vercel.json`) so all routes serve `index.html`.
