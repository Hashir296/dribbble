import mongoose from 'mongoose'

const briefSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    budget: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Brief', briefSchema)
