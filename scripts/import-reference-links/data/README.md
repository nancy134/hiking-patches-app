# Import data

Inputs and snapshots for the reference-link import. All of it is public catalogue
data — patch and trail ids, names, public URLs and the "how to get this patch"
text the site already serves through its public API key. No user data.

| file | what it is |
|---|---|
| `patch-links-enriched.csv` | 93 patches with reference URLs extracted from their `howToGet` prose. The `Other Links (review)` column holds 5 rows never triaged. `AllTrails URL` was never filled. |
| `trail-links-enriched.csv` | 67 trails with TrailLink URLs. `AllTrails URL` was never filled. |
| `patch-howtoget-export.csv` | Raw export of every patch's `howToGet` text, taken before the enrichment. |
| `prod-howtoget-backup.json` | Snapshot of all 93 prod patches' `howToGet` text taken 2026-09-26, immediately before they were rewritten into prose by hand. The only copy of the pre-rewrite wording. |

The two enriched CSVs are the importer's inputs; see `../index.js`. The other two
are history, kept because the rewrite was not reversible from anything else.

## The CSVs are a 2026-07-04 snapshot and have since drifted from prod

Four rows were edited in prod afterwards and no longer match the CSV:

| patch | prod | CSV |
|---|---|---|
| Moriah Challenge | `…lakechamplainregion.com/hiking/…` | double slash `…com//hiking/…` |
| Outside Chronicles WNY Winter | `…/challenges/winter/` | `…/event/winter-adirondack-mountain-adventure/` |
| Inlet Outdoor Family Challenge | `…/things-do/inlet-outdoor-family-challenge-0` | `…/inlet/inlet-outdoor-family-challenge` |
| Massachusetts Rail Trail Challenge | `websiteUrl` cleared | TrailLink search URL |

In every case prod is correct and the CSV is not. A normal run skips them as
conflicts and reports each one, so this is safe by default — but **`--overwrite`
would revert all four**. Don't use that flag against prod without re-checking
this list first.
