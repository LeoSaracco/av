const { Client } = require('pg');
const { execSync } = require('child_process');

const query = process.argv[2];
if (!query) { console.log('Usage: node db.js "SQL query"'); process.exit(1); }

function getDbUrl() {
  try {
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
      if (line.includes('DATABASE_PUBLIC_URL')) {
        capturing = true;
      }
      if (capturing) {
        if (line.includes('──') || (i > 0 && !lines[i].includes('│'))) {
          capturing = false;
          break;
        }
        const pieces = line.split('│');
        if (pieces.length >= 2) {
          const part = pieces[1].replace('║', '').replace(/^\s+|\s+$/g, '');
          if (part) urlParts.push(part);
        }
      }
    }

    const url = urlParts.join('');
    if (!url || !url.startsWith('postgresql://')) {
      throw new Error('Could not parse DATABASE_PUBLIC_URL from Railway output');
    }
    return url;
  } catch (e) {
    console.error('Failed to get DATABASE_PUBLIC_URL from Railway:', e.message);
    console.error('Make sure railway CLI is installed and you are linked to the av project.');
    process.exit(1);
  }
}

(async () => {
  const dbUrl = getDbUrl();
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    const res = await client.query(query);

    if (res.rows.length === 0) {
      console.log('(0 rows)');
    } else {
      const cols = res.fields.map(f => f.name);
      console.log(cols.join(' | '));
      console.log('-'.repeat(cols.join(' | ').length));

      for (const row of res.rows.slice(0, 50)) {
        console.log(cols.map(c => row[c] === null ? 'NULL' : String(row[c]).replace(/\n/g, ' ')).join(' | '));
      }

      if (res.rows.length > 50) {
        console.log('... (%d more rows)', res.rows.length - 50);
      }

      console.log('(%d row%s)', res.rows.length, res.rows.length === 1 ? '' : 's');
    }

    await client.end();
  } catch (e) {
    console.error('Error:', e.message);
    try { await client.end(); } catch {}
    process.exit(1);
  }
})();
