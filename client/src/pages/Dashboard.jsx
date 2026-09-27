import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'

export default function Dashboard() {
  const { user, designs, updateProfile, deleteDesign, messages, briefs } = useStore()
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    avatar: user.avatar,
  })
  const [saved, setSaved] = useState(false)
  const mine = designs.filter((item) => item.author.id === user.id)
  const savedShots = designs.filter((item) => item.savedBy.includes(user.id))

  function set(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    updateProfile({ name: form.name.trim(), bio: form.bio.trim(), location: form.location.trim(), avatar: form.avatar })
    setSaved(true)
  }

  return (
    <div className="page-wrap dash">
      <div className="page-head">
        <h1>Dashboard</h1>
        <Link className="btn-pink" to="/upload">Upload</Link>
      </div>

      <h2 className="section-title">Your shots</h2>
      {mine.length ? (
        <div className="dash-list">
          {mine.map((item) => (
            <div className="dash-row" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <Link to={`/shots/${item.id}`}><strong>{item.title}</strong></Link>
                <p className="muted">{item.likes + item.likedBy.length} likes · {item.views} views</p>
              </div>
              <div className="detail-actions">
                <Link className="btn-ghost" to={`/shots/${item.id}/edit`}>Edit</Link>
                <button type="button" className="btn-ghost" onClick={() => deleteDesign(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="muted">You have not published a shot yet.</p>}

      <h2 className="section-title">Saved</h2>
      {savedShots.length ? (
        <div className="dash-list">
          {savedShots.map((item) => (
            <Link className="dash-row" to={`/shots/${item.id}`} key={item.id}>
              <img src={item.image} alt="" />
              <strong>{item.title}</strong>
            </Link>
          ))}
        </div>
      ) : <p className="muted">Save shots from the heart and bookmark buttons.</p>}

      <h2 className="section-title">Messages</h2>
      {messages.filter((item) => item.fromId === user.id || item.to === user.username).length ? (
        <div className="stack">
          {messages.filter((item) => item.fromId === user.id || item.to === user.username).map((item) => (
            <article className="list-card" key={item.id}><div><h3>{item.title}</h3><p>{item.text}</p></div></article>
          ))}
        </div>
      ) : <p className="muted">No messages yet.</p>}

      <h2 className="section-title">Briefs you posted</h2>
      {briefs.filter((item) => item.userId === user.id).length ? (
        <div className="stack">
          {briefs.filter((item) => item.userId === user.id).map((item) => (
            <article className="list-card" key={item.id}><div><h3>{item.title}</h3><p>{item.budget}</p></div></article>
          ))}
        </div>
      ) : <p className="muted">You have not posted a brief. <Link to="/briefs">Post one</Link></p>}

      <h2 className="section-title">Edit profile</h2>
      <form className="dash-form" onSubmit={submit}>
        {saved && <p className="muted">Profile saved.</p>}
        <label className="field">Name<input value={form.name} onChange={set('name')} /></label>
        <label className="field">Location<input value={form.location} onChange={set('location')} /></label>
        <label className="field">Avatar URL<input value={form.avatar} onChange={set('avatar')} /></label>
        <label className="field">Bio<textarea value={form.bio} onChange={set('bio')} /></label>
        <button className="btn-dark" type="submit">Save profile</button>
      </form>
    </div>
  )
}
