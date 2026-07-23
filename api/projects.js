import { createRequire } from 'module';
import { list } from '@vercel/blob';

const require = createRequire(import.meta.url);

let staticProjects = [];
try {
  staticProjects = require('../src/data/projects.json');
} catch {
  // File not bundled — dynamic projects only
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  let dynamicProjects = [];
  try {
    const { blobs } = await list({ prefix: 'data/projects.json' });
    if (blobs.length > 0) {
      const r = await fetch(blobs[0].url);
      if (r.ok) dynamicProjects = await r.json();
    }
  } catch {
    // Blob not configured yet — fall through to static data
  }

  // Dynamic projects take priority; deduplicate by id
  const seen = new Set(dynamicProjects.map(p => p.id));
  const dedupedStatic = staticProjects.filter(p => !seen.has(p.id));

  res.setHeader('Cache-Control', 'no-store');
  return res.json([...dynamicProjects, ...dedupedStatic]);
}
