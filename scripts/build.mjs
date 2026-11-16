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
      heading: `${d.title} · thousand km²`,
      labels: d.entries.map((e) => e.name),
      values: types.map((t) => d.entries.map((e) => (e.type === t ? e.value / 1000 : 0))),
      series: types,
      patterns: 'solid,stripes,dots',
      horizontal: true, stacked: true, decimals: 0, width: WIDTH, theme: 'light',
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
  // Columns with Everest's height as a dashed line: nine of the ten trenches are deeper than it is tall.
  'deepest-trenches': (d) => toSVG('bars', {
    heading: `${d.title} · metres below sea level`,
    labels: d.entries.map((e) => e.name.replace(' Trench', '')),
    values: d.entries.map((e) => e.value),
    goal: 8849, 'goal-label': 'Everest',
    'angle-labels': true, highlight: 'none', height: 240, width: WIDTH, theme: 'light',
  }),
  // Columns with the longest one highlighted: Mammoth Cave is far ahead.
  'longest-caves': (d) => toSVG('bars', {
    heading: `${d.title} · km of surveyed passages`,
    labels: d.entries.map((e) => e.name.replace('Sistema del ', '')),
    values: d.entries.map((e) => e.value),
    decimals: 0, 'show-values': true, 'angle-labels': true, height: 220, width: WIDTH, theme: 'light',
  }),
  // Ranked bars with the biggest highlighted: Greenland is in a league of its own.
  // Shown in thousands, since the short form for millions ("2.2m") reads like metres.
  'largest-islands': (d) => toSVG('bars', {
    heading: `${d.title} · thousand km²`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value / 1000),
    horizontal: true, 'show-values': true, decimals: 0, width: WIDTH, theme: 'light',
  }),
  // Columns coloured by continent: one series per continent, so the legend explains the colours.
  'tallest-trees': (d) => {
    const regions = [...new Set(d.entries.map((e) => e.type))];
    return toSVG('bars', {
      heading: `${d.title} · metres`,
      labels: d.entries.map((e) => e.name),
      values: regions.map((r) => d.entries.map((e) => (e.type === r ? e.value : 0))),
      series: regions,
      patterns: 'solid,stripes,dots,grid',
      stacked: true, 'show-values': true, decimals: 0, 'angle-labels': true, height: 240, width: WIDTH, theme: 'light',
    });
  },
  // A donut in forest greens: the Amazon alone is more than half of the top 10.
  'largest-rainforests': (d) => toSVG('donut', {
    heading: `${d.title} · share of the top 10's primary forest`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value / 1000),
    color: '#0B6E4F,#2E9E5B,#6CC04A,#B5D334,#F2C14E,#8A9A5B',
    decimals: 0, 'center-label': 'thousand km² in all', height: 220, width: WIDTH, theme: 'light',
  }),
  // Columns with a colour each, like a row of different creatures.
  'longest-living-animals': (d) => toSVG('bars', {
    heading: `${d.title} · years`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value),
    color: '#E63946,#F4A261,#E9C46A,#2A9D8F,#264653,#8AB17D,#6D597A,#B56576,#355070,#E76F51',
    'show-values': true, 'angle-labels': true, height: 240, width: WIDTH, theme: 'light',
  }),
  // A scatter of age against size: the biggest craters are also some of the oldest.
  'largest-craters': (d) => toSVG('scatter', {
    heading: `${d.title} · diameter against age`,
    x: d.entries.map((e) => e.ageMa),
    y: d.entries.map((e) => e.value),
    labels: d.entries.map((e) => e.name),
    'x-label': 'Age (million years)', 'y-label': 'Diameter (km)',
    notes: 'Vredefort:Vredefort;Chicxulub:Chicxulub;Sudbury:Sudbury;Popigai:Popigai',
    color: '#FF6B35', zero: true, height: 260, width: WIDTH, theme: 'light',
  }),
  // Columns hanging down in canyon-rock colours, darkest for the deepest.
  'deepest-canyons': (d) => toSVG('bars', {
    heading: `${d.title} · metres deep`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => -e.value),
    color: '#67000D,#7F2704,#A63603,#C44103,#D94801,#E8590C,#F16913,#FD8D3C,#FDAE6B,#FDD0A2',
    'angle-labels': true, highlight: 'none', height: 240, width: WIDTH, theme: 'light',
  }),
  // Ranked bars in reef colours, from coral pink to lagoon blue.
  'coral-reef-countries': (d) => toSVG('bars', {
    heading: `${d.title} · km² of reef`,
    labels: d.entries.map((e) => e.name),
    values: d.entries.map((e) => e.value),
    color: '#FF5A5F,#FF7B6B,#FF9A76,#FFB385,#FFC857,#9BE564,#3DDC97,#2EC4B6,#1B9AAA,#3A86FF',
    horizontal: true, 'show-values': true, width: WIDTH, theme: 'light',
  }),
};

for (const [id, draw] of Object.entries(charts)) {
  save(id, draw(load(id)));
  console.log(`charts/${id}.svg`);
}
