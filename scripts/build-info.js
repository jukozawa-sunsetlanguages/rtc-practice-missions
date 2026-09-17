import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const commit = process.env.COMMIT_REF || execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
writeFileSync('build-info.json', JSON.stringify({commit, context:process.env.CONTEXT || 'local', deployedAt:new Date().toISOString()}, null, 2));
