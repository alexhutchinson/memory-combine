// Vercel serverless function — api/sheets.ts
// Handles both GET (fetch leaderboard) and POST (submit score)

import crypto from 'node:crypto';

const SHEETS_ID = process.env.GOOGLE_SHEETS_ID!;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const SHEET_NAME = 'Leaderboard';

function b64url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }));

  const signingInput = `${header}.${payload}`;
  const signer = crypto.createSign('SHA256');
  signer.update(signingInput);
  const sig = signer.sign(PRIVATE_KEY, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signingInput}.${sig}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const tokenData = await tokenRes.json() as { access_token: string; error?: string };
  if (tokenData.error) throw new Error(`Token error: ${tokenData.error}`);
  return tokenData.access_token;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// Vercel handler signature
export default async function handler(req: any, res: any) {
  // CORS preflight
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!SHEETS_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    return res.status(503).json({ error: 'Google Sheets not configured. Set GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY env vars.' });
  }

  try {
    const token = await getAccessToken();
    const encodedRange = encodeURIComponent(`${SHEET_NAME}!A:D`);
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}`;

    if (req.method === 'GET') {
      const response = await fetch(`${baseUrl}/values/${encodedRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json() as { values?: string[][] };
      const rows = (data.values || []).slice(1); // skip header row
      const entries = rows
        .filter(r => r[0] && r[1])
        .map(row => ({
          name: row[0] || '',
          score: parseFloat(row[1]) || 0,
          date: row[2] || '',
          roundDetail: row[3] || '',
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      return res.status(200).json({ entries });
    }

    if (req.method === 'POST') {
      const { name, score, date, roundDetail } = req.body as {
        name: string; score: number; date: string; roundDetail: string;
      };
      await fetch(`${baseUrl}/values/${encodedRange}:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [[name, String(score), date, roundDetail]] }),
      });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[sheets]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
