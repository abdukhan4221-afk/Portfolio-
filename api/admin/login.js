import { createSession, setSessionCookie } from '../../lib/server.js';
import { timingSafeEqual } from 'node:crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const configured = process.env.ADMIN_PASSWORD;
  const supplied = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!configured) return res.status(503).json({ error: 'Admin login is not configured on the server.' });
  const a = Buffer.from(supplied);
  const b = Buffer.from(configured);
  const valid = a.length === b.length && timingSafeEqual(a, b);
  if (!valid) return res.status(401).json({ error: 'Incorrect password.' });
  try {
    setSessionCookie(res, createSession());
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Admin session creation failed:', error.message);
    return res.status(500).json({ error: 'Could not create a secure session. Check server configuration.' });
  }
}
