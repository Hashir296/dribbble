import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      x: { type: String, default: '' },
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pro: { type: Boolean, default: false },
    agency: { type: Boolean, default: false },
    followers: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
