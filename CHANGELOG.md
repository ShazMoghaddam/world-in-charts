# Changelog

## Unreleased

Deepest lakes and highest mountains.

- Deepest lakes: ten lakes by maximum depth, drawn as bars hanging down from the surface. Includes the Caspian Sea and Lake Vostok under the Antarctic ice, with notes on both.
- Highest mountains: height above sea level beside prominence, so it's clear that Lhotse is barely separate from Everest while Nanga Parbat stands almost alone.
- Builds are stable: each chart's random pattern ID is swapped for a fixed one, so rebuilding unchanged data leaves the SVGs unchanged.

First two categories.

- Oldest living individual trees: ten trees, with ring-counted ages shown solid and estimates striped, so it's clear how much of each age is confirmed.
- Longest rivers: the top ten from Britannica, all measured the same way, with the Nile and Amazon marked as disputed.
- Every entry has a source, a note and a "how sure" label: verified, measured, estimated or disputed.
- `npm run build` redraws every chart from the data files with Bezel Charts.
