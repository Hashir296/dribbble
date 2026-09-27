import Design from '../models/Design.js'
import Comment from '../models/Comment.js'
import { presentComment, presentDesign } from '../utils/present.js'

async function load(id) {
  return Design.findById(id).populate('user')
}

export async function listDesigns(_req, res) {
  const designs = await Design.find().populate('user').sort({ createdAt: -1 })
  res.json(designs.map(presentDesign))
}

export async function getDesign(req, res) {
  const design = await load(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  res.json(presentDesign(design))
}

export async function createDesign(req, res) {
  const { title, description, image, tags, category } = req.body
  if (!title || !image) return res.status(400).json({ message: 'Add a title and an image.' })
  const design = await Design.create({
    title: title.trim(),
    description: description || '',
    image,
    tags: tags || [],
    category: category || 'Product Design',
    user: req.user._id,
  })
  res.status(201).json(presentDesign(await load(design._id)))
}

export async function updateDesign(req, res) {
  const design = await Design.findById(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  if (String(design.user) !== String(req.user._id)) return res.status(403).json({ message: 'You can only edit your own shots.' })
  const { title, description, image, tags } = req.body
  if (title) design.title = title
  if (description !== undefined) design.description = description
  if (image) design.image = image
  if (tags) design.tags = tags
  await design.save()
  res.json(presentDesign(await load(design._id)))
}

export async function deleteDesign(req, res) {
  const design = await Design.findById(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  if (String(design.user) !== String(req.user._id)) return res.status(403).json({ message: 'You can only delete your own shots.' })
  await Comment.deleteMany({ design: design._id })
  await design.deleteOne()
  res.json({ ok: true })
}

function toggle(list, userId) {
  const id = String(userId)
  const has = list.some((item) => String(item) === id)
  return has ? list.filter((item) => String(item) !== id) : [...list, userId]
}

export async function likeDesign(req, res) {
  const design = await Design.findById(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  design.likes = toggle(design.likes, req.user._id)
  await design.save()
  res.json(presentDesign(await load(design._id)))
}

export async function saveDesign(req, res) {
  const design = await Design.findById(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  design.saves = toggle(design.saves, req.user._id)
  await design.save()
  res.json(presentDesign(await load(design._id)))
}

export async function viewDesign(req, res) {
  const design = await Design.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('user')
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  res.json(presentDesign(design))
}

export async function listComments(req, res) {
  const comments = await Comment.find(req.params.id ? { design: req.params.id } : {}).populate('user').sort({ createdAt: 1 })
  res.json(comments.map(presentComment))
}

export async function addComment(req, res) {
  const text = String(req.body.text || '').trim()
  if (!text) return res.status(400).json({ message: 'Write a comment.' })
  const design = await Design.findById(req.params.id)
  if (!design) return res.status(404).json({ message: 'Shot not found.' })
  const comment = await Comment.create({ design: design._id, user: req.user._id, text })
  const populated = await comment.populate('user')
  res.status(201).json(presentComment(populated))
}
