const { execSync } = require('child_process');

function getDbUrl() {
  const out = execSync('railway variables --service Postgres', {
    encoding: 'utf8',
    timeout: 10000,
    cwd: __dirname
  });

  const lines = out.split('\n');
  let capturing = false;
  let urlParts = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('DATABASE_PUBLIC_URL')) capturing = true;
    if (capturing) {
      if (line.includes('──') || (i > 0 && !lines[i].includes('│'))) break;
      const pieces = line.split('│');
      if (pieces.length >= 2) {
        const part = pieces[1].replace('║', '').replace(/^\s+|\s+$/g, '');
        if (part) urlParts.push(part);
      }
    }
  }

  const url = urlParts.join('');
  if (!url || !url.startsWith('postgresql://')) {
    throw new Error('Could not parse DATABASE_PUBLIC_URL');
  }
  return url;
}

try {
  process.stdout.write(getDbUrl());
} catch (e) {
  process.stderr.write(e.message);
  process.exit(1);
}
