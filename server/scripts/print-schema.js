import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
console.log(fs.readFileSync(schemaPath, 'utf8'));
