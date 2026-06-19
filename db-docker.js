const { execSync } = require('child_process');

function getDbUrl() {
  const out = execSync('railway variables --service Postgres', {
    encoding: 'utf8', timeout: 10000, cwd: __dirname
  });
  const lines = out.split('\n');
  let capturing = false;
  const parts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('DATABASE_PUBLIC_URL')) capturing = true;
    if (capturing) {
      if (line.includes('──') || (i > 0 && !lines[i].includes('│'))) break;
      const pieces = line.split('│');
      if (pieces.length >= 2) {
        const part = pieces[1].replace('║', '').replace(/^\s+|\s+$/g, '');
        if (part) parts.push(part);
      }
    }
  }
  return parts.join('');
}

const url = getDbUrl();
const m = url.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
if (!m) { console.error('Failed to parse URL'); process.exit(1); }

const [, user, pass, host, port, db] = m;

console.log(`Connecting to ${host}:${port}/${db} as ${user}...`);
console.log('Type \\q to exit, \\dt to list tables.\n');

const cmd = `docker run --rm -it -e PGHOST=${host} -e PGPORT=${port} -e PGUSER=${user} -e PGPASSWORD=${pass} -e PGDATABASE=${db} postgres:16-alpine psql`;
execSync(cmd, { stdio: 'inherit' });
