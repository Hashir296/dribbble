import bcrypt from 'bcryptjs'
import { designs as samples } from '../client/src/data/sample.js'
import Comment from './models/Comment.js'
import Design from './models/Design.js'
import User from './models/User.js'

export async function seedIfEmpty() {
  const password = await bcrypt.hash('pintra123', 10)
  const existingTitles = new Set((await Design.find().select('title')).map((item) => item.title))
  const byName = new Map()

  for (const user of await User.find()) {
    byName.set(user.username, user)
  }

  let added = 0
  for (const sample of samples) {
    const author = sample.author
    if (!byName.has(author.username)) {
      const user = await User.create({
        name: author.name,
        username: author.username,
        email: `${author.username}@pintra.test`,
        password,
        avatar: author.avatar,
        bio: author.bio || '',
        location: author.location || '',
        pro: !!author.pro,
        agency: !!author.agency,
        followers: author.followers || 0,
        socialLinks: { website: '', instagram: '', x: '' },
      })
      byName.set(author.username, user)
    }
    if (existingTitles.has(sample.title)) {
      await Design.updateOne({ title: sample.title }, { category: sample.category, tags: sample.tags, description: sample.description })
      continue
    }
    const user = byName.get(author.username)
    await Design.create({
      title: sample.title,
      description: sample.description,
      image: sample.image,
      tags: sample.tags,
      category: sample.category,
      user: user._id,
      baseLikes: sample.likes,
      views: sample.views,
      createdAt: new Date(sample.createdAt),
    })
    added += 1
  }

  if ((await Comment.countDocuments()) === 0) {
    const shots = await Design.find().limit(4)
    const users = [...byName.values()]
    const notes = [
      'The spacing on the hero is really clean.',
      'Would love to see the empty state for this flow.',
      'Color and type feel finished. Nice work.',
      'The onboarding step is the one I would hire for.',
    ]
    for (let i = 0; i < shots.length; i += 1) {
      const author = users[(i + 1) % users.length]
      if (!author) continue
      await Comment.create({ design: shots[i]._id, user: author._id, text: notes[i] })
    }
  }

  console.log(`Database ready. Added ${added} shots. Demo login: amina-shah@pintra.test / pintra123`)
}
