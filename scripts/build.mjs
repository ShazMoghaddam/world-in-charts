// Renders every chart in charts/ from the data files, using Bezel Charts.
import { readFileSync, writeFileSync } from 'node:fs';
import { toSVG } from 'bezel-charts';

const load = (id) => JSON.parse(readFileSync(new URL(`../data/${id}.json`, import.meta.url)));
const save = (id, svg) => writeFileSync(new URL(`../charts/${id}.svg`, import.meta.url), svg);
const WIDTH = 720;

// Each chart is chosen to suit its data. See the README for why.
const charts = {
  // Stacked bars: the solid part is ring-counted, the striped part is only estimated.
  'oldest-trees': (d) => toSVG('bars', {
    heading: `${d.title} · years`,
    labels: d.entries.map((e) => e.name.replace(/ \(.*\)$/, '')),
    values: [d.entries.map((e) => e.verified), d.entries.map((e) => e.value - e.verified)],
    series: ['Ring-counted', 'Estimated only'],
    patterns: 'solid,stripes',
    horizontal: true, stacked: true, width: WIDTH, theme: 'light',
  }),
  // Plain ranked bars: one consistent source, one measure.
  'longest-rivers': (d) => toSVG('bars', {
    heading: `${d.title} · km`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value),
    horizontal: true, 'show-values': true, width: WIDTH, theme: 'light',
  }),
};

for (const [id, draw] of Object.entries(charts)) {
  save(id, draw(load(id)));
  console.log(`charts/${id}.svg`);
}
