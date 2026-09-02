import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { ingestCatalog, ingestManifest } from './video-ingestion'

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function main() {
  const manifest = argument('--manifest')
  const catalog = argument('--catalog')
  const output = argument('--out')
  const inputRoot = argument('--input-root')
  if ((!manifest && !catalog) || (manifest && catalog) || !output) {
    throw new Error('Usage: npm run ingest:videos -- --manifest <file> --out <file> [--input-root <dir>] | --catalog <file> --out <file>')
  }

  const documents = catalog
    ? await ingestCatalog(resolve(catalog))
    : await ingestManifest(resolve(manifest!), { inputRoot })
  await mkdir(dirname(resolve(output)), { recursive: true })
  await writeFile(resolve(output), `${documents.map((document) => JSON.stringify(document)).join('\n')}\n`, 'utf8')
  process.stdout.write(`Wrote ${documents.length} video document(s) to ${resolve(output)}\n`)
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
