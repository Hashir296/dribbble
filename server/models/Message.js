import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUsername: { type: String, default: '' },
    type: { type: String, default: 'contact' },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)
