# Changelog

## Unreleased

Largest islands and tallest trees by species.

- Largest islands: ranked bars with Greenland highlighted. All ten figures from Britannica; Australia counts as a continent.
- Tallest trees by species: columns coloured by continent, with current heights, including the 2023 Tibetan cypress and Centurion's height after the 2019 fire.
- Largest deserts and largest islands now show thousands of km², since the short form for millions ("2.2m") read like metres.
- Banner and social preview redrawn: 12 categories, 120 facts.

Deepest ocean trenches and longest cave systems.

- Deepest ocean trenches: columns with Everest's height as a dashed line; nine of the ten are deeper. Depths from modern sonar surveys and crewed dives, replacing 1950s soundings that some lists still repeat. The Kuril–Kamchatka Trench is 9,604 m, not 10,542 m, and the Japan Trench drops out.
- Longest cave systems: columns with Mammoth Cave highlighted, 144 km ahead of the next.
- Banner and social preview redrawn: 10 categories, 100 facts.

Tallest waterfalls, highest active volcanoes and automatic checks.

- Tallest waterfalls: columns with the Burj Khalifa (828 m) as a dashed line; all ten are taller.
- Highest active volcanoes: from the Smithsonian's Global Volcanism Program, split by whether the last eruption is dated.
- `npm run check` checks every data file, and a GitHub Actions workflow runs it on every pull request, along with a check that the charts and banner match the data.
- Dependabot now keeps the workflow's actions up to date too.

Largest lakes by area and largest deserts.

- Largest lakes by area: a donut of the top 10's combined surface, showing the Caspian Sea is almost half of it. All ten figures from Britannica.
- Largest deserts: ranked bars coloured by desert type, showing the two biggest deserts are polar ice. The Great Australian Desert is marked disputed, since it's a group of deserts counted as one.
- The banner and social preview now include both categories.

Banner and social preview.

- A colourful README banner and a GitHub social preview, drawn from the real data: each colour is one category and each bar is one figure.
- `npm run banner` redraws them, so they grow as categories are added.

Better sources for lakes and mountains.

- Deepest lakes: Crater Lake now uses the National Park Service's 2000 sonar survey (592 m, verified), and Baikal is verified by Guinness World Records.
- Lake Vostok corrected to about 800 m, from seismic mapping of its southern basin. The 510 to 900 m range is now described correctly, as different estimates of its deepest point, so it moves from 4th to 5th.
- Everest now cites the 2020 China and Nepal announcement directly.

Deepest lakes and highest mountains.

- Deepest lakes: ten lakes by maximum depth, drawn as bars hanging down from the surface. Includes the Caspian Sea and Lake Vostok under the Antarctic ice, with notes on both.
- Highest mountains: height above sea level beside prominence, so it's clear that Lhotse is barely separate from Everest while Nanga Parbat stands almost alone.
- Builds are stable: each chart's random pattern ID is swapped for a fixed one, so rebuilding unchanged data leaves the SVGs unchanged.

First two categories.

- Oldest living individual trees: ten trees, with ring-counted ages shown solid and estimates striped, so it's clear how much of each age is confirmed.
- Longest rivers: the top ten from Britannica, all measured the same way, with the Nile and Amazon marked as disputed.
- Every entry has a source, a note and a "how sure" label: verified, measured, estimated or disputed.
- `npm run build` redraws every chart from the data files with Bezel Charts.
