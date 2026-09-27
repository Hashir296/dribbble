import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'
import { presentUser } from '../utils/present.js'

async function withFollowing(user) {
  const populated = await User.findById(user._id).populate('following', 'username')
  const names = (populated.following || []).map((item) => item.username)
  return presentUser(populated, { email: true, following: names })
}

export async function register(req, res) {
  const name = String(req.body.name || '').trim()
  const username = String(req.body.username || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  if (!name || !username || !email || password.length < 4) {
    return res.status(400).json({ message: 'Fill in every field. Password needs at least 4 characters.' })
  }
  if (await User.findOne({ email })) return res.status(400).json({ message: 'That email is already registered.' })
  if (await User.findOne({ username })) return res.status(400).json({ message: 'That username is taken.' })
  const user = await User.create({
    name,
    username,
    email,
    password: await bcrypt.hash(password, 10),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1AA05A&color=fff`,
  })
  res.status(201).json({ token: signToken(user), user: await withFollowing(user) })
}

export async function login(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase()
  const password = String(req.body.password || '')
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email or password is incorrect.' })
  }
  res.json({ token: signToken(user), user: await withFollowing(user) })
}

export async function me(req, res) {
  res.json(await withFollowing(req.user))
}
