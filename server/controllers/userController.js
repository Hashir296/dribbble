import User from '../models/User.js'
import { presentUser } from '../utils/present.js'

async function namesFor(user) {
  const populated = await User.findById(user._id).populate('following', 'username')
  return (populated.following || []).map((item) => item.username)
}

export async function listUsers(_req, res) {
  const users = await User.find().populate('following', 'username')
  res.json(users.map((user) => presentUser(user, { following: (user.following || []).map((item) => item.username) })))
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).populate('following', 'username')
  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json(presentUser(user, { following: (user.following || []).map((item) => item.username) }))
}

export async function updateUser(req, res) {
  if (String(req.user._id) !== req.params.id) return res.status(403).json({ message: 'You can only edit your profile.' })
  const fields = ['name', 'bio', 'location', 'avatar', 'socialLinks']
  fields.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key]
  })
  await req.user.save()
  res.json(presentUser(req.user, { email: true, following: await namesFor(req.user) }))
}

export async function followUser(req, res) {
  const target = await User.findOne({ username: req.body.username })
  if (!target) return res.status(404).json({ message: 'Designer not found.' })
  if (String(target._id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot follow yourself.' })
  const has = req.user.following.some((id) => String(id) === String(target._id))
  req.user.following = has
    ? req.user.following.filter((id) => String(id) !== String(target._id))
    : [...req.user.following, target._id]
  await req.user.save()
  res.json(presentUser(req.user, { email: true, following: await namesFor(req.user) }))
}
