// Renders every chart in charts/ from the data files, using Bezel Charts.
import { readFileSync, writeFileSync } from 'node:fs';
import { toSVG } from 'bezel-charts';

const load = (id) => JSON.parse(readFileSync(new URL(`../data/${id}.json`, import.meta.url)));

// Bezel Charts gives patterns and gradients a random ID each time it draws.
// Swap each one for a fixed ID, so rebuilding unchanged data leaves the SVG unchanged.
const stable = (id, svg) => {
  const ids = [...new Set(svg.match(/\bbzc[a-z0-9]+\b/g) ?? [])];
  return ids.reduce((s, old, n) => s.replaceAll(old, `${id}-${n + 1}`), svg);
};
const save = (id, svg) => writeFileSync(new URL(`../charts/${id}.svg`, import.meta.url), stable(id, svg));
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
  // Bars hanging below zero, like the lakes themselves.
  'deepest-lakes': (d) => toSVG('bars', {
    heading: `${d.title} · metres below the surface`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => -e.value),
    'show-values': true, 'angle-labels': true, highlight: 'none', suffix: ' m', height: 220, width: WIDTH, theme: 'light',
  }),
  // Grouped bars: height next to prominence shows which peaks stand alone.
  'highest-mountains': (d) => toSVG('bars', {
    heading: `${d.title} · metres`,
    labels: d.entries.map((e) => e.name),
    values: [d.entries.map((e) => e.value), d.entries.map((e) => e.prominence)],
    series: ['Height above sea level', 'Prominence'],
    patterns: 'solid,stripes',
    horizontal: true, width: WIDTH, theme: 'light',
  }),
  // A donut: how the top 10's combined surface splits. The Caspian alone is about half.
  'largest-lakes': (d) => toSVG('donut', {
    heading: `${d.title} · share of the top 10's combined area`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value),
    compact: true, 'center-label': 'km² in all', height: 220, width: WIDTH, theme: 'light',
  }),
  // Ranked bars coloured by desert type: one series per type, so the legend explains the colours.
  'largest-deserts': (d) => {
    const types = [...new Set(d.entries.map((e) => e.type))];
    return toSVG('bars', {
      heading: `${d.title} · km²`,
      labels: d.entries.map((e) => e.name),
      values: types.map((t) => d.entries.map((e) => (e.type === t ? e.value : 0))),
      series: types,
      patterns: 'solid,stripes,dots',
      horizontal: true, stacked: true, compact: true, width: WIDTH, theme: 'light',
    });
  },
  // Columns with the Burj Khalifa as a dashed line: every one of them is taller.
  'tallest-waterfalls': (d) => toSVG('bars', {
    heading: `${d.title} · metres`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value),
    goal: 828, 'goal-label': 'Burj Khalifa',
    'angle-labels': true, highlight: 'none', height: 240, width: WIDTH, theme: 'light',
  }),
  // Bars split by evidence: a dated eruption, or active but with no eruption on record.
  'highest-volcanoes': (d) => toSVG('bars', {
    heading: `${d.title} · metres`,
    labels: d.entries.map((e) => e.name),
    values: [d.entries.map((e) => (e.dated ? e.value : 0)), d.entries.map((e) => (e.dated ? 0 : e.value))],
    series: ['Last eruption dated', 'No dated eruption'],
    patterns: 'solid,stripes',
    horizontal: true, stacked: true, width: WIDTH, theme: 'light',
  }),
};

for (const [id, draw] of Object.entries(charts)) {
  save(id, draw(load(id)));
  console.log(`charts/${id}.svg`);
}
