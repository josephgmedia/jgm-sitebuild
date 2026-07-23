import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { secret, base64, filename } = body;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!base64 || !filename) {
    return res.status(400).json({ error: 'base64 and filename required' });
  }

  try {
    const buffer = Buffer.from(base64, 'base64');
    const ext = filename.split('.').pop().toLowerCase();
    const mimeType = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg';
    const blobKey = `uploads/${filename}`;

    const blob = await put(blobKey, buffer, {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: true,
    });

    return res.json({ url: blob.url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
