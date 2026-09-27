import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'

export default function Upload() {
  const { id } = useParams()
  const { designs, user, addDesign, updateDesign } = useStore()
  const existing = id ? designs.find((item) => item.id === id) : null
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: existing?.title || '',
    description: existing?.description || '',
    image: existing?.image || '',
    tags: existing?.tags?.join(', ') || '',
  })
  const [error, setError] = useState('')

  if (existing && existing.author.id !== user?.id) {
    return <div className="page-wrap"><h1>You can only edit your own shots.</h1></div>
  }

  function set(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  function onFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, image: reader.result }))
    reader.readAsDataURL(file)
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.image) {
      setError('Add a title and an image.')
      return
    }
    const tags = form.tags.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
    const payload = { title: form.title.trim(), description: form.description.trim(), image: form.image, tags }
    if (existing) {
      await updateDesign(existing.id, payload)
      navigate(`/shots/${existing.id}`)
      return
    }
    const nextId = await addDesign(payload)
    navigate(`/shots/${nextId}`)
  }

  return (
    <section className="auth upload">
      <h1>{existing ? 'Edit shot' : 'Upload a shot'}</h1>
      <p className="lead">What are you working on?</p>
      <form onSubmit={submit}>
        {error && <p className="form-error">{error}</p>}
        <label className="field">Image
          <input type="file" accept="image/*" onChange={onFile} />
        </label>
        <label className="field">Or image URL
          <input value={form.image.startsWith('data:') ? '' : form.image} onChange={set('image')} placeholder="https://" />
        </label>
        {form.image && <img className="upload-preview" src={form.image} alt="" />}
        <label className="field">Title
          <input value={form.title} onChange={set('title')} required />
        </label>
        <label className="field">Description
          <textarea value={form.description} onChange={set('description')} />
        </label>
        <label className="field">Tags
          <input value={form.tags} onChange={set('tags')} placeholder="mobile app, dashboard" />
        </label>
        <button className="btn-pink btn-block" type="submit">{existing ? 'Save changes' : 'Publish'}</button>
      </form>
    </section>
  )
}
