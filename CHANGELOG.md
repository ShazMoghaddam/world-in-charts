# Changelog

World in Charts uses date versions: `vYYYY.MM` for each release, with a third number (`vYYYY.MM.1`) for a further release in the same month.

## Unreleased

### Added

- A 3-minute narrated film of four of the top tens, made with Bezel Film, in `film/`, with a preview near the top of the README.

### Tooling

- Bezel Charts is updated to 1.11.0, which gives the same SVG every time it draws the same chart. The build's own workaround for random ids is gone.
- Goal labels (Everest, Burj Khalifa) now have a light outline, so they stay readable where they cross the dashed line.
- The total in the middle of the largest lakes donut is sized to fit the ring.

## v2026.11.1 (16 November 2026)

Two more categories, both held back from the first release until reliable figures were found. That makes 23 categories and 227 entries.

### Nature

- **Largest ice caps and icefields:** columns coloured by Antarctic, Arctic or mountain icefield, from a 2022 Journal of Glaciology study that measured every glacier complex the same way. This replaces the planned "largest glaciers", which has no reliable top 10.

### Human-made

- **Oldest continuously inhabited cities:** bars running from each city's most cautious date to the earliest date anyone claims, so the disagreement between sources is visible. Every entry is marked disputed.

### Also

- The banner and social preview are redrawn with both new categories.
- The "still to come" line is gone from the README contents.

## v2026.11 (16 November 2026)

The first release: 21 categories of researched world facts, 207 entries in all, each drawn with [Bezel Charts](https://github.com/ShazMoghaddam/bezel-charts).

### Nature

- **Oldest living individual trees:** stacked bars, with ring-counted ages solid and estimates striped.
- **Longest rivers:** ranked bars, all ten from Britannica, with the Nile and Amazon marked disputed.
- **Deepest lakes:** bars hanging down from the surface, with Lake Vostok corrected to about 800 m from seismic mapping.
- **Highest mountains:** height beside prominence, showing Lhotse is barely separate from Everest.
- **Largest lakes by area:** a donut showing the Caspian Sea is almost half of the top 10's surface.
- **Largest deserts:** bars coloured by type, showing the two biggest deserts are polar ice.
- **Tallest waterfalls:** columns with the Burj Khalifa as a dashed line; all ten are taller.
- **Highest active volcanoes:** Smithsonian data, split by whether the last eruption is dated.
- **Deepest ocean trenches:** modern sonar and crewed-dive depths, replacing 1950s soundings; Everest's height as a dashed line.
- **Longest cave systems:** columns with Mammoth Cave highlighted.
- **Largest islands:** ranked bars with Greenland highlighted.
- **Tallest trees by species:** columns coloured by continent, with current heights.
- **Largest tropical rainforests:** a donut in forest greens, from 2020 satellite data.
- **Longest-living animals:** columns with a colour each, from the AnAge longevity database.
- **Largest impact craters:** a scatter of size against age, from the Earth Impact Database.
- **Deepest canyons:** hanging columns in rock colours, every figure marked estimated.
- **Countries with the most coral reef:** bars from coral pink to lagoon blue, from the UN's World Atlas of Coral Reefs.
- **Temperature records by continent:** bars from each record low to record high, from the WMO's official archive.

### Human-made

- **Tallest buildings:** a skyline of columns, to the CTBUH standard.
- **Longest bridges:** ranked bars split into rail and road.
- **Most visited museums:** 2025 visitor counts from The Art Newspaper's annual survey.

### Transparency

- Every entry has a source, a note and a "how sure" label: verified, measured, estimated or disputed.
- Every category says exactly how its ranking is measured, and where a source gives a range, the lower end is used.
- A highlighted note in the README says the research dates from November 2026 and some figures will change.

### Tooling

- `npm run build` draws every chart from its data file, with stable output so unchanged data never changes the SVGs.
- `npm run banner` draws the README banner and social preview from the real data.
- `npm run check` checks every data file, and a GitHub Actions workflow runs it on every push and pull request, along with a check that the charts and banner match the data. A badge in the README shows the result.
- Dependabot keeps npm packages and the workflow's actions up to date.
