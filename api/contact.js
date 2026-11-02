import { getSupabase } from '../lib/server.js';

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const name = clean(req.body?.name, 100);
    const email = clean(req.body?.email, 200).toLowerCase();
    const subject = clean(req.body?.subject, 160);
    const message = clean(req.body?.message, 4000);
    const honeypot = clean(req.body?.website, 200);
    if (honeypot) return res.status(200).json({ success: true });
    if (!name || !email || !message) return res.status(400).json({ error: 'Please complete your name, email and message.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });

    const db = getSupabase();
    const { error } = await db.from('contact_messages').insert({ name, email, subject, message });
    if (error) throw error;
    return res.status(201).json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact submission failed:', error.message);
    return res.status(503).json({ error: 'Your message could not be saved right now. Please email me directly.' });
  }
}
