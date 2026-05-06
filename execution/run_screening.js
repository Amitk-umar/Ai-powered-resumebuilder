/**
 * execution/run_screening.js
 * ---------------------------
 * Runs an AI job-screening check for a resume against a job description.
 * POSTs to /api/screen and stores the result in .tmp/
 *
 * Inputs (env):
 *   API_BASE_URL      — default: http://localhost:5000
 *   FIREBASE_ID_TOKEN — required (user's Firebase auth token)
 *
 * Inputs (CLI flags):
 *   --resume-id   MongoDB ObjectId of the resume
 *   --job         Job description text OR path to a .txt file
 *
 * Outputs:
 *   Prints score + summary to stdout
 *   Writes .tmp/screening_result_{resumeId}.json
 *
 * Usage:
 *   FIREBASE_ID_TOKEN=xxx node execution/run_screening.js \
 *     --resume-id 6641abc123... \
 *     --job "Senior Full Stack Engineer at Stripe..."
 *
 *   # Or point to a file:
 *   FIREBASE_ID_TOKEN=xxx node execution/run_screening.js \
 *     --resume-id 6641abc123... \
 *     --job ./job_description.txt
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.join(__dirname, '..', '.tmp');
fs.mkdirSync(TMP_DIR, { recursive: true });

// ── CLI arg parsing ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

const resumeId = getArg('--resume-id');
const jobArg   = getArg('--job');

if (!resumeId) { console.error('❌  --resume-id is required'); process.exit(1); }
if (!jobArg)   { console.error('❌  --job is required');       process.exit(1); }

const FIREBASE_ID_TOKEN = process.env.FIREBASE_ID_TOKEN;
if (!FIREBASE_ID_TOKEN) {
  console.error('❌  FIREBASE_ID_TOKEN env var not set.');
  process.exit(1);
}

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:5000';
const MAX_JD_CHARS = 3000;

// ── Load job description (text or .txt file) ──────────────────────────────────
function loadJobDescription(arg) {
  let text = arg;
  if (arg.endsWith('.txt') && fs.existsSync(arg)) {
    text = fs.readFileSync(arg, 'utf-8');
    console.log(`📄  Loaded job description from ${arg} (${text.length} chars)`);
  }
  if (text.length > MAX_JD_CHARS) {
    console.warn(`⚠️  Job description truncated from ${text.length} → ${MAX_JD_CHARS} chars`);
    text = text.slice(0, MAX_JD_CHARS);
  }
  return text;
}

// ── API call ──────────────────────────────────────────────────────────────────
async function runScreening(resumeId, jobDescription) {
  const url = `${API_BASE}/api/screen`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIREBASE_ID_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeId, jobDescription }),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    if (err.cause?.code === 'ECONNREFUSED') {
      console.error('❌  Connection refused — is the server running?');
    } else if (err.name === 'TimeoutError') {
      console.error('❌  Request timed out after 45s. Retry or check Gemini service.');
    } else {
      console.error(`❌  ${err.message}`);
    }
    process.exit(1);
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`❌  HTTP ${res.status}: ${body}`);
    process.exit(1);
  }

  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────
const jobDescription = loadJobDescription(jobArg);
console.log(`🚀  Running screening for resume ${resumeId}…`);

const result = await runScreening(resumeId, jobDescription);

// Pretty-print key fields
const { score, gaps = [], suggestions = [], matchedSkills = [] } = result;
console.log(`\n✅  Match Score: ${score ?? 'N/A'}/100`);
if (gaps.length)        console.log(`⚠️  Gaps (${gaps.length}): ${gaps.slice(0, 3).join(', ')}${gaps.length > 3 ? '…' : ''}`);
if (matchedSkills.length) console.log(`🎯  Matched Skills: ${matchedSkills.slice(0, 5).join(', ')}`);
if (suggestions.length) console.log(`💡  Top Suggestion: ${suggestions[0]}`);

const outPath = path.join(TMP_DIR, `screening_result_${resumeId}.json`);
fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`\n📄  Full result written to ${outPath}`);
