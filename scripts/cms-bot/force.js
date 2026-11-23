// Manual import of reviewed JSON. Uses the same v2 quality gate and safe DB writer as the bot.
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
import { injectCode } from './developerAgent.js';

dotenv.config();

const args = process.argv.slice(2);
const publish = args.includes('--publish');
const allowOverwrite = args.includes('--overwrite');
const file = args.find((a) => !a.startsWith('--'));
if (!file) throw new Error('Usage: node force.js reviewed-test.json [--publish] [--overwrite]');

const data = JSON.parse(readFileSync(file, 'utf8'));
const res = await injectCode(data, { publish, allowOverwrite });
console.log(JSON.stringify({ testId: res.testId, isAvailable: res.isAvailable, displayOrder: res.displayOrder, auditReport: res.auditReport }, null, 2));
