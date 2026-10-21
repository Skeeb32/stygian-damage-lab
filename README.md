# Stygian Damage Lab

An interactive, unofficial Genshin Impact damage calculator and team builder.

## Features

- Three editable battle presets, plus searchable character, weapon and artifact catalogs.
- Editable levels, constellations, refinements, artifact stats, buffs, attacks and rotations.
- Four-piece and two-piece artifact combinations shown on character cards.
- Named team saves in browser storage, with JSON import/export for backups.
- Damage breakdowns and comparison baselines.

## Run locally

From this directory:

```sh
python3 -m http.server 8766 --directory dist
```

Open http://localhost:8766. No build step or package installation is required.

## Verify formulas

Requires Node.js:

```sh
node test.mjs
```

## Model limitations

This is an editable theorycrafting workbench, not a complete automatic combat simulator. Example stats and multipliers must be replaced with verified values. Levels, talents, constellations and refinements are recorded; their numeric effects and equipment passives must be configured explicitly. It does not simulate aura application, energy, cooldowns or boss phases. Saved teams are browser-local, not account-synced.

## Data and credits

Character, weapon and artifact metadata/artwork use [genshin-db](https://github.com/theBowja/genshin-db) and its API. Formula references are linked in the app, including [KQM Theorycrafting Library](https://library.keqingmains.com/). Genshin Impact and game artwork belong to HoYoverse and their respective owners. This project is unofficial and unaffiliated.
