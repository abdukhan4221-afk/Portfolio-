import { getSupabase, requireAdmin } from '../../lib/server.js';
import { defaultContent } from '../../lib/default-content.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  try {
    const db = getSupabase();
    if (req.method === 'GET') {
      const { data, error } = await db.from('site_content').select('content').eq('id', 'main').maybeSingle();
      if (error) throw error;
      return res.status(200).json(data?.content || defaultContent);
    }
    if (req.method === 'PUT') {
      const content = req.body;
      if (!content || typeof content !== 'object' || Array.isArray(content)) return res.status(400).json({ error: 'Invalid content payload.' });
      const { error } = await db.from('site_content').upsert({ id: 'main', content, updated_at: new Date().toISOString() });
      if (error) throw error;
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Admin content operation failed:', error.message);
    return res.status(503).json({ error: 'Could not access saved website content. Check your Supabase setup.' });
  }
}
