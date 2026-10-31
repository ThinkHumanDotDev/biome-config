# @thinkhuman/biome-config

ThinkHuman's shared [Biome](https://biomejs.dev) configuration: one formatter style and one
lint preset for every repo.

- **Style:** 2 spaces, 100 columns, single quotes (JS, CSS and YAML), no semicolons, trailing commas. This is the
  Prettier style the repos used before Biome, so moving a Prettier repo changes very little.
- **Lint:** Biome's `recommended` preset; imports sorted by the organize-imports assist.
- **Files:** respects `.gitignore`; unknown file types are skipped. Markdown is not formatted: the
  repos' docs use compact `| --- |` tables, which Biome's Markdown formatter pads.

## Use it

Install Biome and this config as dev dependencies, both pinned. The config comes from a tag on this
repo rather than the npm registry; use the full `@thinkhuman/biome-config@github:...` form, which
every package manager accepts.

```bash
# bun
bun add -d --exact @biomejs/biome@2.6.4 @thinkhuman/biome-config@github:ThinkHumanDotDev/biome-config#v1.3.0

# npm
npm install --save-dev --save-exact @biomejs/biome@2.6.4 @thinkhuman/biome-config@github:ThinkHumanDotDev/biome-config#v1.3.0

# yarn
yarn add --dev --exact @biomejs/biome@2.6.4 @thinkhuman/biome-config@github:ThinkHumanDotDev/biome-config#v1.3.0

# pnpm
pnpm add --save-dev --save-exact @biomejs/biome@2.6.4 @thinkhuman/biome-config@github:ThinkHumanDotDev/biome-config#v1.3.0
```

Yarn 2 and later: Biome finds the extended config in `node_modules`, so set `nodeLinker: node-modules`
in `.yarnrc.yml` (Plug'n'Play has no `node_modules`). Yarn 1 needs nothing extra.

Then a `biome.json` at the repo root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.6.4/schema.json",
  "extends": ["@thinkhuman/biome-config/biome"]
}
```

And the scripts, so every repo runs the same commands (`bun run lint`, `npm run lint`, `yarn lint`,
`pnpm lint`):

```json
{
  "scripts": {
    "lint": "biome check",
    "lint:fix": "biome check --write"
  }
}
```

Add only what the repo needs on top: generated files in `files.includes`, or a rule turned down with
the reason next to it (use `biome.jsonc` for comments).

## CI

Call the org's reusable job, which picks bun, npm, yarn or pnpm from the lockfile:

```yaml
jobs:
  biome:
    uses: ThinkHumanDotDev/.github/.github/workflows/biome.yml@<sha>
```

Pin it to a commit SHA; Renovate's shared preset bumps it.

## Release

Change `biome.json`, bump `version` in `package.json`, merge, then tag `vX.Y.Z` on main. Repos
pin a tag; Renovate opens the bump PRs. `npm test` checks the config the way a repo consumes it.
