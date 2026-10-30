import { readFile } from 'node:fs/promises'

import type { Config } from './types'

export async function load(path: string, fallback: Config = { name: 'default', retries: 3 }) {
  const text = await readFile(path, 'utf8').catch(() => '')
  return text ? (JSON.parse(text) as Config) : fallback
}
