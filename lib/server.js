import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are not configured.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

const COOKIE_NAME = 'g1yrex_admin';
const SESSION_SECONDS = 60 * 60 * 8;

function sign(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters.');
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function createSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = String(expires);
  return `${value}.${sign(value)}`;
}

export function isAuthenticated(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookie = cookieHeader.split(';').map(v => v.trim()).find(v => v.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return false;
  const token = decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1));
  const [expires, signature, extra] = token.split('.');
  if (!expires || !signature || extra || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = sign(expires);
  const a = Buffer.from(signature, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
}

export function requireAdmin(req, res) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Please sign in again.' });
    return false;
  }
  return true;
}

export function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}
