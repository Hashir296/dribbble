import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DesignCard, { Bookmark, Heart } from '../components/DesignCard'
import { compact } from '../data/sample'
import { useStore } from '../store'

function palette(seed) {
  let n = 0
  for (const ch of seed) n = (n * 33 + ch.charCodeAt(0)) >>> 0
  return [0, 40, 90, 160, 210].map((shift, index) => {
    const hue = (n + shift) % 360
    const light = index === 0 ? 12 : 28 + index * 12
    return hslToHex(hue, 46, light)
  })
}

function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const hex = (v) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`.toUpperCase()
}

export default function ShotDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { designs, comments, user, toggleLike, toggleSave, toggleFollow, addComment, addMessage, bumpView } = useStore()
  const design = designs.find((item) => item.id === id)
  const [text, setText] = useState('')

  useEffect(() => {
    if (design) bumpView(design.id)
  }, [design?.id])

  if (!design) {
    if (designs.length === 0) return null
    return <div className="page-wrap"><h1>Shot not found</h1><Link to="/shots">Back to shots</Link></div>
  }

  const liked = !!user && design.likedBy.includes(user.id)
  const saved = !!user && design.savedBy.includes(user.id)
  const likes = design.likes + design.likedBy.length
  const thread = comments.filter((item) => item.designId === design.id)
  const more = designs.filter((item) => item.id !== design.id && item.author.username === design.author.username).slice(0, 4)
  const related = designs.filter((item) => item.id !== design.id && item.tags.some((tag) => design.tags.includes(tag)) && item.author.username !== design.author.username).slice(0, 4)
  const following = !!user && user.following.includes(design.author.username)
  const mine = user && design.author.id === user.id

  function requireUser(run) {
    if (!user) {
      navigate('/login')
      return
    }
    run()
  }

  function contact() {
    requireUser(async () => {
      await addMessage({ type: 'contact', to: design.author.username, title: design.title, text: `Hi ${design.author.name}, I'm interested in ${design.title}.` })
      navigate('/messages')
    })
  }

  const colors = palette(design.title)

  return (
    <div>
      <article className="detail">
        <header className="detail-top">
          <Link className="detail-user" to={`/u/${design.author.username}`}>
            <img src={design.author.avatar} alt="" />
            <div>
            <strong>{design.author.name} {design.author.pro && <em className="pro">PRO</em>}</strong>
            <span className="avail">Available for work</span>
          </div>
        </Link>
        <div className="detail-actions">
          {mine ? (
            <Link className="btn-ghost" to={`/shots/${design.id}/edit`}>Edit</Link>
          ) : (
            <>
              <button type="button" className={following ? 'btn-dark' : 'btn-ghost'} onClick={() => requireUser(() => toggleFollow(design.author.username))}>
                {following ? 'Following' : 'Follow'}
              </button>
              <button type="button" className="btn-pink" onClick={contact}>Get in touch</button>
            </>
          )}
            <button type="button" className={liked ? 'btn-pink' : 'btn-ghost'} onClick={() => requireUser(() => toggleLike(design.id))}>
              <Heart filled={liked} /> {liked ? 'Liked' : 'Like'} {compact(likes)}
            </button>
            <button type="button" className={saved ? 'icon-btn is-on saved-btn' : 'icon-btn saved-btn'} aria-label="Save" onClick={() => requireUser(() => toggleSave(design.id))}>
              <Bookmark filled={saved} />
            </button>
          </div>
        </header>

        <img className="detail-image" src={design.image} alt={design.title} />
        <h1>{design.title}</h1>
        <p className="detail-desc">{design.description}</p>
        <div className="palette">
          {colors.map((color) => (
            <div className="swatch" key={color}>
              <i style={{ background: color }} />
              <span>{color}</span>
            </div>
          ))}
        </div>
        <div className="detail-tags">
          {design.tags.map((tag) => <Link key={tag} to={`/shots?tag=${encodeURIComponent(tag)}`}>{tag}</Link>)}
        </div>
        <p className="detail-views">{compact(design.views)} views</p>

        <section className="comments">
          <h2>{thread.length} comment{thread.length === 1 ? '' : 's'}</h2>
          {user ? (
            <form className="comment-form" onSubmit={(event) => { event.preventDefault(); addComment(design.id, text); setText('') }}>
              <img src={user.avatar} alt="" />
              <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a comment…" />
              <button className="btn-dark" type="submit">Post</button>
            </form>
          ) : (
            <p className="muted"><Link to="/login">Sign in</Link> to leave a comment.</p>
          )}
          {thread.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={comment.avatar} alt="" />
              <div>
                <strong>{comment.name}</strong>
                <time>{new Date(comment.createdAt).toLocaleDateString()}</time>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </section>
      </article>

      {more.length > 0 && (
        <section className="page-wrap">
          <h2 className="section-title">More by {design.author.name}</h2>
          <div className="shot-grid page-grid">{more.map((item) => <DesignCard key={item.id} design={item} />)}</div>
        </section>
      )}
      {related.length > 0 && (
        <section className="page-wrap">
          <h2 className="section-title">You might also like</h2>
          <div className="shot-grid page-grid">{related.map((item) => <DesignCard key={item.id} design={item} />)}</div>
        </section>
      )}
    </div>
  )
}
