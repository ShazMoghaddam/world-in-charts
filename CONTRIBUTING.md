# Contributing to World in Charts

Thanks for helping. Corrections matter most here, since accuracy is the whole point.

## Correcting a figure

Open an issue or a pull request with:

1. The category and entry, such as "Longest rivers, Congo".
2. The figure you think is right.
3. A source for it. Official bodies (USGS, NASA, UNESCO, national surveys), peer-reviewed papers, Britannica and Guinness World Records are best. Wikipedia is a fine place to start, but please link the source it cites.

If sources genuinely disagree, the entry is marked **disputed** and the note explains both sides, rather than picking a winner.

## Changing the data

Each category lives in `data/<category>.json`. Every entry has:

| Field | Holds |
| --- | --- |
| `rank`, `name`, `location`, `country` | where it sits and what it is |
| `value` | the figure used for ranking (the lower end of a range) |
| `valueHigh` | the upper end, when the source gives a range |
| `confidence` | `verified`, `measured`, `estimated` or `disputed` |
| `note` | anything a reader should know about the figure |
| `source` | where the figure comes from |

Then redraw the charts and update the matching table in the README:

```sh
npm install
npm run build
```

## Suggesting a category

Ideas are welcome. A good category has a clear measure, such as height, length or age, and at least ten entries that reliable sources agree on.
