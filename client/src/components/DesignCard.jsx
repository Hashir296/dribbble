import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { compact } from '../data/sample'
import { useStore } from '../store'

export default function DesignCard({ design }) {
  const { user, toggleLike, toggleSave, addMessage } = useStore()
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const liked = !!user && design.likedBy.includes(user.id)
  const saved = !!user && design.savedBy.includes(user.id)
  const likes = design.likes + design.likedBy.length

  function act(event, run) {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    run(design.id)
  }

  return (
    <article className="shot">
      <div className="shot-media">
        <Link to={`/shots/${design.id}`} className="shot-link" aria-label={design.title}>
          <img src={design.image} alt="" referrerPolicy="no-referrer" />
        </Link>
        <div className="shot-overlay">
          <div className="shot-copy">
            <p className="shot-title">{design.title}</p>
            <button type="button" className="touch" onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (!user) navigate('/login'); else setOpen(true) }}>Get in touch</button>
          </div>
          <div className="shot-actions">
            <button type="button" className={liked ? 'icon-btn is-on' : 'icon-btn'} aria-label="Like" onClick={(event) => act(event, toggleLike)}>
              <Heart filled={liked} />
            </button>
            <button type="button" className={saved ? 'icon-btn is-on' : 'icon-btn'} aria-label="Save" onClick={(event) => act(event, toggleSave)}>
              <Bookmark filled={saved} />
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <form className="modal-card" onClick={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); addMessage({ type: 'contact', to: design.author.username, title: design.title, text: note }); setSent(true) }}>
            <h3>Message {design.author.name}</h3>
            {sent ? <p>Sent. They can read it from their dashboard.</p> : (
              <>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Say what you need" required />
                <button className="btn-dark" type="submit">Send</button>
              </>
            )}
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Close</button>
          </form>
        </div>
      )}
      <div className="shot-meta">
        <Link className="shot-user" to={`/u/${design.author.username}`}>
          <img src={design.author.avatar} alt="" referrerPolicy="no-referrer" />
          <span>{design.author.name}</span>
          {design.author.pro && <em>PRO</em>}
        </Link>
        <div className="shot-stats">
          <button type="button" className={liked ? 'stat-btn is-on' : 'stat-btn'} aria-label="Like" onClick={(event) => act(event, toggleLike)}>
            <Heart filled={liked} />{compact(likes)}
          </button>
          <span><Eye />{compact(design.views)}</span>
        </div>
      </div>
    </article>
  )
}

export function Heart({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function Bookmark({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3.2L6 20V5a1 1 0 0 1 1-1z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function Eye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  )
}
