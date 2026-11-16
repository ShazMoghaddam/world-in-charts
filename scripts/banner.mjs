// Draws the README banner and the GitHub social preview from the real data.
// Each coloured group of bars is one category, so the banner is made of the facts it advertises.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = new URL('../data/', import.meta.url);
const ORDER = ['oldest-trees', 'longest-rivers', 'deepest-lakes', 'highest-mountains', 'largest-lakes', 'largest-deserts'];
const files = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
const ids = [...ORDER.filter((id) => files.includes(id)), ...files.filter((id) => !ORDER.includes(id)).sort()];
const groups = ids.map((id) => JSON.parse(readFileSync(new URL(`${id}.json`, dir))));

const COLOURS = ['#FF6B6B', '#FFB443', '#3DDC97', '#4CC9F0', '#A78BFA', '#FF7AC6', '#FFE45E', '#7CF0D6'];

function draw({ width, height, titleSize, pad, barZone, stack = false }) {
  const bars = [];
  const gap = 6, groupGap = 22;
  const n = groups.reduce((s, g) => s + g.entries.length, 0);
  const barW = (width - pad * 2 - groupGap * (groups.length - 1) - gap * (n - groups.length)) / n;
  let x = pad;
  groups.forEach((g, gi) => {
    const max = Math.max(...g.entries.map((e) => e.value));
    g.entries.forEach((e, i) => {
      const h = Math.max(10, (e.value / max) * barZone);
      bars.push(`<rect x="${x.toFixed(1)}" y="${(height - h).toFixed(1)}" width="${barW.toFixed(1)}" height="${(h + 12).toFixed(1)}" rx="${(barW / 2).toFixed(1)}" fill="${COLOURS[gi % COLOURS.length]}" opacity="${(1 - i * 0.045).toFixed(2)}"/>`);
      x += barW + gap;
    });
    x += groupGap - gap;
  });
  const count = groups.length;
  const font = 'font-family="Inter, Helvetica, Arial, sans-serif"';
  const facts = `${count} CATEGORIES · ${n} FACTS · MADE WITH BEZEL CHARTS`;
  // Top right on the wide banner.
  const metaRight = () => `<text x="${width - pad}" y="${pad + titleSize * 0.2}" text-anchor="end" ${font} font-size="${(titleSize * 0.2).toFixed(1)}" fill="#FFFFFF"><tspan font-weight="700">Shaz Moghaddam</tspan><tspan dx="${(titleSize * 0.06).toFixed(1)}" fill="#D9D3FF" font-weight="500">· London</tspan></text>
  <text x="${width - pad}" y="${pad + titleSize * 0.48}" text-anchor="end" ${font} font-weight="500" font-size="${(titleSize * 0.18).toFixed(1)}" fill="#4CC9F0">shazmoghaddam.github.io</text>
  <text x="${width - pad}" y="${pad + titleSize * 0.76}" text-anchor="end" ${font} font-weight="600" font-size="${(titleSize * 0.15).toFixed(1)}" fill="#8F86C9" letter-spacing="1.5">${facts}</text>`;
  // Under the tagline on the social preview, where the title takes the full width.
  const metaBelow = () => {
    const y = pad + titleSize * 0.82 + titleSize * 0.42 + titleSize * 0.36;
    return `<text x="${pad + 3}" y="${y.toFixed(1)}" ${font} font-size="${(titleSize * 0.19).toFixed(1)}" fill="#FFFFFF"><tspan font-weight="700">Shaz Moghaddam</tspan><tspan dx="${(titleSize * 0.06).toFixed(1)}" fill="#D9D3FF" font-weight="500">· London ·</tspan><tspan dx="${(titleSize * 0.06).toFixed(1)}" fill="#4CC9F0" font-weight="500">shazmoghaddam.github.io</tspan></text>
  <text x="${width - pad}" y="${y.toFixed(1)}" text-anchor="end" ${font} font-weight="600" font-size="${(titleSize * 0.13).toFixed(1)}" fill="#8F86C9" letter-spacing="1.5">${facts}</text>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1240"/><stop offset="1" stop-color="#2B0F3A"/></linearGradient>
    <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFB443"/><stop offset=".5" stop-color="#FF6B6B"/><stop offset="1" stop-color="#FF7AC6"/></linearGradient>
    <radialGradient id="glow" cx=".85" cy=".1" r=".6"><stop offset="0" stop-color="#4CC9F0" stop-opacity=".28"/><stop offset="1" stop-color="#4CC9F0" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  ${bars.join('\n  ')}
  <text x="${pad}" y="${pad + titleSize * 0.82}" font-family="Inter Display, Inter, Helvetica, Arial, sans-serif" font-weight="900" font-size="${titleSize}" letter-spacing="-${(titleSize * 0.03).toFixed(1)}" fill="#FFFFFF">World in <tspan fill="url(#ink)">Charts</tspan></text>
  <text x="${pad + 3}" y="${pad + titleSize * 0.82 + titleSize * 0.42}" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="500" font-size="${(titleSize * 0.26).toFixed(1)}" fill="#D9D3FF">The world's top 10s, researched properly. Every figure sourced.</text>
  ${stack ? metaBelow() : metaRight()}
</svg>
`;
}

const out = (name, svg) => writeFileSync(new URL(`../assets/${name}`, import.meta.url), svg);
out('banner.svg', draw({ width: 1280, height: 400, titleSize: 92, pad: 56, barZone: 150 }));
out('social-preview.svg', draw({ width: 1280, height: 640, titleSize: 112, pad: 72, barZone: 250, stack: true }));
console.log('assets/banner.svg\nassets/social-preview.svg');
