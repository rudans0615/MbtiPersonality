import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config({ path: '../../.env' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateScores() {
  const dataDir = path.join(process.cwd(), '../../src/data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('Types.ts'));

  let totalUpdated = 0;

  for (const file of files) {
    const testId = file.replace('Types.ts', '');
    const modulePath = `file:///${path.join(dataDir, file).replace(/\\/g, '/')}`;
    
    let mod;
    try {
      mod = await import(modulePath);
    } catch (e) {
      console.warn(`Failed to load ${file}:`, e);
      continue;
    }

    // Find calculate function
    const calculateKey = Object.keys(mod).find(key => key.startsWith('calculate') && typeof mod[key] === 'function');
    if (!calculateKey) continue; // Not a score-based test

    const calculateLevel = mod[calculateKey];
    const boundaries = {}; // { [resultCode]: { min: number, max: number } }

    // Evaluate scores from 0 to 200 (sufficient for most tests)
    for (let score = 0; score <= 200; score++) {
      const resultCode = calculateLevel(score);
      if (!resultCode) continue;

      if (!boundaries[resultCode]) {
        boundaries[resultCode] = { min: score, max: score };
      } else {
        boundaries[resultCode].max = score;
      }
    }

    console.log(`[${testId}] Found boundaries:`, boundaries);

    // Update Supabase
    for (const [code, range] of Object.entries(boundaries)) {
      // Sometimes max goes up to 200 just because the logic is `return "CODE"` at the end
      // Let's set 999 as effectively infinity if max is 200
      let maxScore = range.max === 200 ? 999 : range.max;
      
      const { error } = await supabase
        .from('result_types')
        .update({ min_score: range.min, max_score: maxScore })
        .eq('test_id', testId)
        .eq('code', code);

      if (error) {
        console.error(`Failed to update ${testId} - ${code}:`, error);
      } else {
        totalUpdated++;
      }
    }
  }

  console.log(`Migration complete! Updated ${totalUpdated} result types.`);
}

migrateScores().catch(console.error);
