// Consumes the config the way a repo does: installed under node_modules and extended by package
// name. Prettier-style code (the org style before Biome) must pass unchanged; anything else must
// come out in that style, imports sorted.
import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const biome = join(root, 'node_modules', '.bin', 'biome')
const dir = mkdtempSync(join(tmpdir(), 'biome-config-'))
let failed = false

mkdirSync(join(dir, 'node_modules', '@thinkhuman'), { recursive: true })
symlinkSync(root, join(dir, 'node_modules', '@thinkhuman', 'biome-config'))
writeFileSync(
  join(dir, 'biome.json'),
  JSON.stringify({ extends: ['@thinkhuman/biome-config/biome'] }),
)
writeFileSync(join(dir, '.gitignore'), 'node_modules\n')
cpSync(join(root, 'test', 'cases'), join(dir, 'src'), { recursive: true })
execFileSync('git', ['init', '-q'], { cwd: dir })

const run = (args) => {
  try {
    return {
      ok: true,
      out: execFileSync(biome, args, { cwd: dir, encoding: 'utf8', stdio: 'pipe' }),
    }
  } catch (error) {
    return { ok: false, out: `${error.stdout}${error.stderr}` }
  }
}
const expect = (name, condition, detail = '') => {
  console.log(`${condition ? 'ok  ' : 'FAIL'} ${name}`)
  if (!condition) {
    failed = true
    if (detail) console.log(detail)
  }
}

const styled = run(['check', 'src/org-style.ts'])
expect('Prettier-style code passes check unchanged', styled.ok, styled.out)

const unformatted = run(['check', 'src/unformatted.ts'])
expect('unformatted code fails check', !unformatted.ok)

run(['check', '--write', 'src/unformatted.ts'])
const written = readFileSync(join(dir, 'src', 'unformatted.ts'), 'utf8')
const expected = readFileSync(join(dir, 'src', 'unformatted.expected.ts'), 'utf8')
expect('check --write produces the org style', written === expected, `got:\n${written}`)

const docs = run(['check', 'src/compact-table.md'])
expect('Markdown is left as written (compact tables stay compact)', docs.ok, docs.out)

process.exit(failed ? 1 : 0)
