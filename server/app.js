import cors from 'cors'
import express from 'express'
import { connectDB } from './config/db.js'
import routes from './routes/index.js'
import { seedIfEmpty } from './seed.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '8mb' }))

let ready
function prepare() {
  if (!ready) {
    ready = connectDB().then(() => seedIfEmpty()).catch((error) => {
      ready = null
      throw error
    })
  }
  return ready
}

app.use(async (req, res, next) => {
  try {
    await prepare()
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api', routes)
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(error.status || 500).json({ message: error.message || 'Server error' })
})

export { app, prepare }
