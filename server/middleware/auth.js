import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const secret = process.env.JWT_SECRET || 'pintra-dev-secret'

export function signToken(user) {
  return jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Sign in required.' })
  try {
    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.id)
    if (!user) return res.status(401).json({ message: 'Sign in required.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Sign in required.' })
  }
}
