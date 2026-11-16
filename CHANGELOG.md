# Changelog

## Unreleased

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
