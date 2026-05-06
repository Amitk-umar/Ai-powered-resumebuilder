/**
 * execution/health_check.js
 * --------------------------
 * Verifies the Express API server is reachable and healthy.
 *
 * Inputs (env):  API_BASE_URL  (default: http://localhost:5000)
 * Outputs:       Prints status to stdout; writes .tmp/health_status.json
 *
 * Usage:
 *   node execution/health_check.js
 *   API_BASE_URL=https://my-api.onrender.com node execution/health_check.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.join(__dirname, '..', '.tmp');
fs.mkdirSync(TMP_DIR, { recursive: true });

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:5000';

async function checkHealth() {
  const url = `${API_BASE}/api/health`;
  const result = { url, checked_at: new Date().toISOString(), ok: false };

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    result.ok = data.status === 'ok';
    result.server_timestamp = data.timestamp;
    console.log(`✅  API healthy — server time: ${data.timestamp}`);
  } catch (err) {
    result.error = err.message;
    if (err.cause?.code === 'ECONNREFUSED') {
      console.error('❌  Connection refused — is the server running?');
    } else {
      console.error(`❌  ${err.message}`);
    }
  }

  const outPath = path.join(TMP_DIR, 'health_status.json');
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`📄  Result written to ${outPath}`);
  return result.ok;
}

const ok = await checkHealth();
process.exit(ok ? 0 : 1);
