import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { secret, project } = body;

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!project || !project.id || !project.title) {
    return res.status(400).json({ error: 'project.id and project.title are required' });
  }

  try {
    let projects = [];
    try {
      const { blobs } = await list({ prefix: 'data/projects.json' });
      if (blobs.length > 0) {
        // Query param busts the Blob CDN cache so we read the latest version
        const r = await fetch(`${blobs[0].url}?t=${Date.now()}`);
        if (r.ok) projects = await r.json();
      }
    } catch {
      // First save — start empty
    }

    // Remove existing entry with same id (allows updates)
    projects = projects.filter(p => p.id !== project.id);

    // Prepend so newest appears first
    projects = [project, ...projects];

    await put('data/projects.json', JSON.stringify(projects, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });

    return res.json({ success: true, id: project.id });
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
