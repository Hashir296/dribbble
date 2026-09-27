import dns from 'dns'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

if (!process.env.VERCEL) dns.setServers(['8.8.8.8', '1.1.1.1'])

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const file = path.join(root, '.env')

if (fs.existsSync(file)) {
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const split = trimmed.indexOf('=')
    if (split === -1) continue
    const key = trimmed.slice(0, split).trim()
    const value = trimmed.slice(split + 1).trim().replace(/^["']|["']$/g, '')
    if (key && process.env[key] === undefined) process.env[key] = value
  }
}
