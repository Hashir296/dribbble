import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    company: { type: String, default: '' },
    place: { type: String, default: 'Remote' },
    type: { type: String, default: 'Full-time' },
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
