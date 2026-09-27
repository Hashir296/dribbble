import { jobs as sampleJobs, services as sampleServices } from '../../client/src/data/sample.js'
import Brief from '../models/Brief.js'
import Design from '../models/Design.js'
import Job from '../models/Job.js'
import Message from '../models/Message.js'
import Service from '../models/Service.js'
import User from '../models/User.js'
import { presentDesign } from '../utils/present.js'

function serviceCategory(title) {
  const text = String(title || '').toLowerCase()
  if (text.includes('brand')) return 'Branding'
  if (text.includes('mobile')) return 'Mobile'
  if (text.includes('illustrat')) return 'Illustration'
  if (text.includes('animat')) return 'Animation'
  if (text.includes('landing') || text.includes('portfolio') || text.includes('web')) return 'Web Design'
  return 'Product Design'
}

export async function search(req, res) {
  const q = String(req.query.q || '').trim()
  if (!q) return res.json({ designs: [], users: [] })
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  const designs = await Design.find({ $or: [{ title: regex }, { description: regex }, { tags: regex }] }).populate('user').limit(24)
  const users = await User.find({ $or: [{ name: regex }, { username: regex }, { location: regex }] }).limit(12)
  res.json({
    designs: designs.map(presentDesign),
    users: users.map((user) => ({
      id: String(user._id),
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      location: user.location,
    })),
  })
}

export async function listBriefs(_req, res) {
  const briefs = await Brief.find().populate('user', 'name').sort({ createdAt: -1 })
  res.json(briefs.map((item) => ({
    id: String(item._id),
    userId: String(item.user?._id || item.user),
    name: item.user?.name || 'Client',
    title: item.title,
    budget: item.budget,
    description: item.description,
    createdAt: new Date(item.createdAt).getTime(),
  })))
}

export async function createBrief(req, res) {
  const title = String(req.body.title || '').trim()
  if (!title) return res.status(400).json({ message: 'Add a title.' })
  const brief = await Brief.create({
    user: req.user._id,
    title,
    budget: req.body.budget || '',
    description: req.body.description || '',
  })
  res.status(201).json({
    id: String(brief._id),
    userId: String(req.user._id),
    name: req.user.name,
    title: brief.title,
    budget: brief.budget,
    description: brief.description,
    createdAt: Date.now(),
  })
}

function presentService(item) {
  return {
    id: String(item._id),
    title: item.title,
    price: item.price,
    owner: item.owner,
    image: item.image,
    category: item.category,
  }
}

export async function listServices(_req, res) {
  if ((await Service.countDocuments()) === 0) {
    await Service.insertMany(sampleServices.map((item) => ({
      title: item.title,
      price: item.price,
      owner: item.owner,
      image: item.image,
      category: serviceCategory(item.title),
    })))
  }
  const rows = await Service.find().sort({ createdAt: -1 })
  res.json(rows.map(presentService))
}

export async function createService(req, res) {
  const title = String(req.body.title || '').trim()
  if (!title) return res.status(400).json({ message: 'Add a service title.' })
  const service = await Service.create({
    user: req.user._id,
    title,
    price: req.body.price || '',
    owner: req.user.name,
    image: req.body.image || '',
    category: req.body.category || serviceCategory(title),
  })
  res.status(201).json(presentService(service))
}

function presentJob(item) {
  return {
    id: String(item._id),
    title: item.title,
    company: item.company,
    place: item.place,
    type: item.type,
  }
}

export async function listJobs(_req, res) {
  if ((await Job.countDocuments()) === 0) {
    await Job.insertMany(sampleJobs.map((item) => ({
      title: item.title,
      company: item.company,
      place: item.place,
      type: item.type,
    })))
  }
  const rows = await Job.find().sort({ createdAt: -1 })
  res.json(rows.map(presentJob))
}

export async function createJob(req, res) {
  const title = String(req.body.title || '').trim()
  if (!title) return res.status(400).json({ message: 'Add a job title.' })
  const job = await Job.create({
    user: req.user._id,
    title,
    company: req.user.name,
    place: req.body.place || 'Remote',
    type: req.body.type || 'Full-time',
  })
  res.status(201).json(presentJob(job))
}

export async function listMessages(req, res) {
  const messages = await Message.find({
    $or: [{ from: req.user._id }, { toUsername: req.user.username }],
  }).populate('from', 'name').sort({ createdAt: -1 })
  res.json(messages.map(presentMessage))
}

export async function createMessage(req, res) {
  const message = await Message.create({
    from: req.user._id,
    toUsername: req.body.to || '',
    type: req.body.type || 'contact',
    title: req.body.title || '',
    text: req.body.text || '',
  })
  const populated = await message.populate('from', 'name')
  res.status(201).json(presentMessage(populated))
}

function presentMessage(item) {
  return {
    id: String(item._id),
    fromId: String(item.from?._id || item.from),
    fromName: item.from?.name || '',
    to: item.toUsername,
    type: item.type,
    title: item.title,
    text: item.text,
    createdAt: new Date(item.createdAt).getTime(),
  }
}
