import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    price: { type: String, default: '' },
    owner: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, default: 'Product Design' },
  },
  { timestamps: true }
)

export default mongoose.model('Service', serviceSchema)
