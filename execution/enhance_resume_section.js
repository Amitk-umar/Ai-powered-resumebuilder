/**
 * execution/enhance_resume_section.js
 * -------------------------------------
 * Calls Google Gemini to enhance a resume section with AI.
 *
 * Inputs (env):
 *   GEMINI_API_KEY  — required
 *
 * Inputs (CLI flags):
 *   --section   summary | experience | skills | education
 *   --text      Raw section text (quoted)
 *   --job       (Optional) Target job description for tailoring
 *
 * Outputs:
 *   Prints enhanced text to stdout
 *   Writes .tmp/enhanced_section.json
 *
 * Usage:
 *   node execution/enhance_resume_section.js \
 *     --section experience \
 *     --text "Managed a team of 5 developers" \
 *     --job "Senior Software Engineer at Google"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.join(__dirname, '..', '.tmp');
fs.mkdirSync(TMP_DIR, { recursive: true });

// ── CLI arg parsing (no external deps needed) ────────────────────────────────
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

const section = getArg('--section');
const text    = getArg('--text');
const job     = getArg('--job') ?? null;

const VALID_SECTIONS = ['summary', 'experience', 'skills', 'education'];
if (!section || !VALID_SECTIONS.includes(section)) {
  console.error(`❌  --section must be one of: ${VALID_SECTIONS.join(', ')}`);
  process.exit(1);
}
if (!text) {
  console.error('❌  --text is required');
  process.exit(1);
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY env var not set.');
  process.exit(1);
}

// ── Prompt templates ─────────────────────────────────────────────────────────
const MAX_CHARS = 8000;
const PROMPTS = {
  experience: (t, _j) =>
    `Rewrite the following work experience bullet points using strong action verbs and quantifiable results. Return ONLY the improved bullet points, no explanation.\n\n${t}`,
  summary: (t, j) =>
    `Write a 3-sentence professional summary for the following content. ${j ? `Target role: ${j.slice(0, 500)}. ` : ''}Return ONLY the summary, no explanation.\n\n${t}`,
  skills: (t, j) =>
    `Group and prioritize the following skills by category, highlighting those most relevant to the role. ${j ? `Target role: ${j.slice(0, 500)}. ` : ''}Return ONLY the organized skill list, no explanation.\n\n${t}`,
  education: (t, _j) =>
    `Enhance the following education section to highlight relevant coursework, achievements, and GPA if notable. Return ONLY the improved text.\n\n${t}`,
};

// ── Gemini API call with exponential backoff ──────────────────────────────────
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt, retries = 2) {
  const url = `${GEMINI_URL}?key=${GEMINI_API_KEY}`;
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(30_000),
    });

    if (res.status === 429 && attempt < retries) {
      const wait = 2 ** (attempt + 1) * 1000;
      console.warn(`⚠️  Rate limited. Waiting ${wait / 1000}s…`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }

    if (!res.ok) throw new Error(`Gemini API error: HTTP ${res.status} — ${await res.text()}`);

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
  return '';
}

// ── Main ──────────────────────────────────────────────────────────────────────
if (!text.trim()) {
  console.warn('⚠️  Empty input — returning original text.');
  const result = { section, enhanced: text, skipped: true };
  fs.writeFileSync(path.join(TMP_DIR, 'enhanced_section.json'), JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log(`🚀  Enhancing [${section}] section…`);
const prompt = PROMPTS[section](text.slice(0, MAX_CHARS), job);

try {
  const enhanced = await callGemini(prompt);
  const result = { section, enhanced, skipped: false };

  console.log('\n--- Enhanced Output ---');
  console.log(enhanced);
  console.log('----------------------');

  const outPath = path.join(TMP_DIR, 'enhanced_section.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`\n📄  Written to ${outPath}`);
} catch (err) {
  console.error(`❌  ${err.message}`);
  process.exit(1);
}
