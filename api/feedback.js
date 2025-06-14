export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { filename, content, token } = req.body;

  if (token !== process.env.SECRET_TOKEN) {
    return res.status(403).send('Unauthorized');
  }

  if (!filename || !content) {
    return res.status(400).send('Missing filename or content');
  }

  try {
    const fs = require('fs');
    const path = require('path');

    const dir = path.join('/tmp', 'feedback');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const safeName = filename.replace(/[^a-z0-9_\-\.]/gi, '_');
    const filePath = path.join(dir, `${Date.now()}_${safeName}`);

    fs.writeFileSync(filePath, content);

    return res.status(200).json({ success: true, saved: filePath });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
