# Stygian Damage Lab

An interactive, unofficial Genshin Impact damage calculator and team builder.

## Features

- Three editable battle presets, plus searchable character, weapon and artifact catalogs.
- Editable levels, constellations, refinements, artifact stats, buffs, attacks and rotations.
- Four-piece and two-piece artifact combinations shown on character cards.
- Named team saves in browser storage, with JSON import/export for backups.
- Side-by-side chart comparison for up to three active or saved teams.
- Slot-specific artifact main stats, rarity and level tables, legal substat roll values, and roll-budget checks.
- Opening-energy estimates starting from zero, with configurable skill, Favonius, boss particle/orb and flat-energy events.
- A bundled Stygian 7.1 boss snapshot with N5/N6 HP and selectable resistance windows.
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

This is an editable theorycrafting workbench, not a complete automatic combat simulator. Example stats and multipliers must be replaced with verified values. Levels, talents, constellations and refinements are recorded; their numeric effects and equipment passives must be configured explicitly. Energy starts at zero and is estimated only from events entered by the user; it does not simulate event timing, cooldowns, aura application, shield checks or boss phase transitions. Boss data is a dated snapshot sourced from public Stygian guide data, not a live API feed. Saved teams are browser-local, not account-synced.

## Data and credits

Character, weapon and artifact metadata/artwork use [genshin-db](https://github.com/theBowja/genshin-db) and its API. Artifact main/substat tables are sourced from [Genshin Optimizer](https://github.com/frzyc/genshin-optimizer). Formula and energy references are linked in the app, including [KQM Theorycrafting Library](https://library.keqingmains.com/). Stygian boss reference data is from [Stygian.moe](https://www.stygian.moe/). Genshin Impact and game artwork belong to HoYoverse and their respective owners. This project is unofficial and unaffiliated.
