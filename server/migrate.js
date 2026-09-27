import { execSync } from 'child_process'
import { MongoClient } from 'mongodb'
import './config/env.js'

function localUri() {
  if (process.env.SOURCE_MONGO_URI) return process.env.SOURCE_MONGO_URI
  if (process.platform === 'win32') {
    try {
      const out = execSync(
        'powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like \'*mongod*\' -and $_.CommandLine -like \'*server\\data*\' } | Select-Object -ExpandProperty CommandLine"',
        { encoding: 'utf8' },
      )
      const port = out.match(/--port\s+(\d+)/)
      if (port) return `mongodb://127.0.0.1:${port[1]}/pintra`
    } catch {
      // Fall through to the default local port.
    }
  }
  return 'mongodb://127.0.0.1:27017/pintra'
}

const targetUri = process.env.MONGO_URI
if (!targetUri) {
  console.error('MONGO_URI is missing. Put the Atlas connection string in the root .env file.')
  process.exit(1)
}

const sourceUri = localUri()
const source = new MongoClient(sourceUri)
const target = new MongoClient(targetUri)

await source.connect()
await target.connect()

const sourceDb = source.db('pintra')
const targetDb = target.db('pintra')
const names = (await sourceDb.listCollections().toArray())
  .map((item) => item.name)
  .filter((name) => !name.startsWith('system.'))

for (const name of names) {
  const docs = await sourceDb.collection(name).find({}).toArray()
  const collection = targetDb.collection(name)
  await collection.deleteMany({})
  if (docs.length) await collection.insertMany(docs, { ordered: false })
  const indexes = await sourceDb.collection(name).indexes()
  for (const index of indexes) {
    if (index.name === '_id_') continue
    const options = { name: index.name }
    if (index.unique) options.unique = true
    if (index.sparse) options.sparse = true
    await collection.createIndex(index.key, options)
  }
  console.log(`${name}: ${docs.length}`)
}

await source.close()
await target.close()
console.log('Atlas database pintra is up to date.')
