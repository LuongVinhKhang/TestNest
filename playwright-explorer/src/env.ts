import * as fs from 'fs';
import * as path from 'path';

export function loadEnv(envPath = path.join(__dirname, '../.env')) {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!key) continue;
    const value = rest.join('=');
    if (!(key in process.env)) process.env[key] = value;
  }
}
