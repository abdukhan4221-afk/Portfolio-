import { getSupabase, requireAdmin } from '../../lib/server.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getSupabase();
    if (req.method === 'GET') {
      const { data, error } = await db.from('contact_messages').select('id,name,email,subject,message,status,created_at').order('created_at', { ascending: false }).limit(200);
      if (error) throw error;
      return res.status(200).json(data || []);
    }
    if (req.method === 'PATCH') {
      const { id, status } = req.body || {};
      if (typeof id !== 'string' || !['new', 'read', 'archived'].includes(status)) return res.status(400).json({ error: 'Invalid message update.' });
      const { error } = await db.from('contact_messages').update({ status }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid message ID.' });
      const { error } = await db.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Contact inbox operation failed:', error.message);
    return res.status(503).json({ error: 'Could not access the contact inbox. Check your Supabase setup.' });
  }
}
