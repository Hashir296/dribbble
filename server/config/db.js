import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import './env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function connectDB() {
  const uri = process.env.MONGO_URI || (process.env.VERCEL ? '' : 'mongodb://127.0.0.1:27017/pintra')
  if (process.env.VERCEL && !process.env.MONGO_URI) {
    const error = new Error('Set MONGO_URI in Vercel to a MongoDB Atlas connection string.')
    error.status = 500
    throw error
  }
  const atlas = Boolean(process.env.MONGO_URI)
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: atlas ? 20000 : 2000 })
    console.log(atlas ? 'MongoDB Atlas connected' : 'MongoDB connected')
    return
  } catch (error) {
    if (atlas || process.env.VERCEL) throw error
    console.log('Local MongoDB is not running. Starting an embedded database.')
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const dbPath = path.join(__dirname, '..', 'data')
  fs.mkdirSync(dbPath, { recursive: true })
  const memory = await MongoMemoryServer.create({
    instance: {
      dbName: 'pintra',
      dbPath: path.join(__dirname, '..', 'data'),
      storageEngine: 'wiredTiger',
    },
  })
  await mongoose.connect(memory.getUri(), { dbName: 'pintra' })
  console.log('Embedded MongoDB ready')
}
