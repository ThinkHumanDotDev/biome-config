# @thinkhuman/biome-config

ThinkHuman's shared [Biome](https://biomejs.dev) configuration: one formatter style and one
lint preset for every repo.

- **Style:** 2 spaces, 100 columns, single quotes (JS and YAML), no semicolons, trailing commas. This is the
  Prettier style the repos used before Biome, so moving a Prettier repo changes very little.
- **Lint:** Biome's `recommended` preset; imports sorted by the organize-imports assist.
- **Files:** respects `.gitignore`; unknown file types are skipped. Markdown is not formatted: the
  repos' docs use compact `| --- |` tables, which Biome's Markdown formatter pads.

## Use it

```bash
pnpm add -D -E @biomejs/biome@2.6.4 github:ThinkHumanDotDev/biome-config#v1.2.0
```

`biome.json` at the repo root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.6.4/schema.json",
  "extends": ["@thinkhuman/biome-config/biome"]
}
```

Add only what the repo needs on top (generated files in `files.includes`, a rule turned down with
the reason next to it). CI runs it through the org's reusable workflow,
`ThinkHumanDotDev/.github/.github/workflows/biome.yml`.

## Release

Change `biome.json`, bump `version` in `package.json`, merge, then tag `vX.Y.Z` on main. Repos
pin a tag; Renovate opens the bump PRs. `npm test` checks the config the way a repo consumes it.
