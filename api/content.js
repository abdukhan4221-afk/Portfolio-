import { getSupabase } from '../lib/server.js';
import { defaultContent } from '../lib/default-content.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const db = getSupabase();
    const { data, error } = await db.from('site_content').select('content').eq('id', 'main').maybeSingle();
    if (error) throw error;
    return res.status(200).json(data?.content || defaultContent);
  } catch (error) {
    console.error('Public content read failed:', error.message);
    return res.status(503).json({ error: 'Website content is temporarily unavailable. Check the database setup.' });
  }
}
