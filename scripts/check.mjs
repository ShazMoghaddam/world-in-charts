// Checks every data file, so a mistake fails the build instead of reaching the README.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../data/', import.meta.url);
const LEVELS = ['verified', 'measured', 'estimated', 'disputed'];
const problems = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const say = (msg) => problems.push(`${file}: ${msg}`);
  let d;
  try {
    d = JSON.parse(readFileSync(new URL(file, dir), 'utf8'));
  } catch (err) {
    say(`isn't valid JSON (${err.message})`);
    continue;
  }
  if (d.id !== file.replace('.json', '')) say(`id "${d.id}" doesn't match the file name`);
  for (const key of ['title', 'measure', 'unit', 'checked']) if (!d[key]) say(`missing "${key}"`);
  if (!Array.isArray(d.entries) || d.entries.length !== 10) say('should have exactly 10 entries');
  (d.entries ?? []).forEach((e, i) => {
    const at = `entry ${i + 1} (${e.name ?? 'no name'})`;
    if (e.rank !== i + 1) say(`${at} has rank ${e.rank}, expected ${i + 1}`);
    if (typeof e.value !== 'number' || !(e.value > 0)) say(`${at} needs a positive number as its value`);
    if (!LEVELS.includes(e.confidence)) say(`${at} has confidence "${e.confidence}", expected one of ${LEVELS.join(', ')}`);
    if (!e.source) say(`${at} has no source`);
    if (i > 0 && e.value > d.entries[i - 1].value) say(`${at} is bigger than the entry above it, so the ranking is out of order`);
  });
}

if (problems.length) {
  console.error(`Found ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('All data files look right.');
