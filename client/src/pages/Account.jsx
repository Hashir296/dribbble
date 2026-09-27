import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DesignCard from '../components/DesignCard'
import { useStore } from '../store'

function when(ms) {
  if (!ms) return ''
  const min = Math.round((Date.now() - ms) / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h`
  return `${Math.round(hr / 24)}d`
}

function personFor(item, user, users) {
  if (item.fromId === user.id) {
    const person = users.find((entry) => entry.username === item.to)
    return {
      key: item.to || item.id,
      name: person?.name || item.to || 'Designer',
      username: item.to,
      avatar: person?.avatar || '',
    }
  }
  const person = users.find((entry) => entry.id === item.fromId)
  return {
    key: person?.username || item.fromId,
    name: item.fromName || person?.name || 'Designer',
    username: person?.username || '',
    avatar: person?.avatar || '',
  }
}

export function MessagesPage() {
  const { user, messages, users, addMessage } = useStore()
  const [picked, setPicked] = useState('')
  const [text, setText] = useState('')

  const threads = useMemo(() => {
    const map = new Map()
    messages.forEach((item) => {
      const person = personFor(item, user, users)
      const current = map.get(person.key) || { ...person, items: [] }
      current.items.push(item)
      if (item.createdAt > (current.latest || 0)) current.latest = item.createdAt
      map.set(person.key, current)
    })
    return [...map.values()].sort((a, b) => b.latest - a.latest)
  }, [messages, user, users])

  const active = threads.find((item) => item.key === (picked || threads[0]?.key))

  function send(event) {
    event.preventDefault()
    if (!active?.username || !text.trim()) return
    addMessage({ type: 'message', to: active.username, title: 'Message', text: text.trim() })
    setText('')
  }

  return (
    <div className="inbox-page">
      <aside className="inbox-side">
        <header><h1>Messages</h1></header>
        {threads.length === 0 && <p className="empty-center">No messages yet.</p>}
        {threads.map((thread) => (
          <button
            type="button"
            key={thread.key}
            className={active?.key === thread.key ? 'thread-btn is-on' : 'thread-btn'}
            onClick={() => setPicked(thread.key)}
          >
            <img src={thread.avatar || user.avatar} alt="" />
            <span>
              <strong>{thread.name}</strong>
              <small>{thread.items[0]?.text}</small>
            </span>
            <em>{when(thread.latest)}</em>
          </button>
        ))}
      </aside>
      <section className="inbox-main">
        {!active && (
          <div className="empty-center">
            <h2>No messages yet</h2>
            <p>When you contact a designer, the conversation shows up here.</p>
          </div>
        )}
        {active && (
          <>
            <header className="thread-head">
              <img src={active.avatar || user.avatar} alt="" />
              <div>
                <strong>{active.name}</strong>
                {active.username && <Link to={`/u/${active.username}`}>View profile</Link>}
              </div>
            </header>
            <div className="thread-log">
              {[...active.items].sort((a, b) => a.createdAt - b.createdAt).map((item) => (
                <article className={item.fromId === user.id ? 'bubble mine' : 'bubble'} key={item.id}>
                  {item.title && item.title !== 'Message' && <strong>{item.title}</strong>}
                  <p>{item.text}</p>
                  <time>{when(item.createdAt)}</time>
                </article>
              ))}
            </div>
            <form className="inbox-compose" onSubmit={send}>
              <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message" aria-label="Write a message" />
              <button className="btn-dark" type="submit">Send</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

const defaultNotes = [
  ['Education', 'Design workshops and education resources for your career'],
  ['Insider', 'The latest design news and community highlights'],
  ['Jumpshot', 'Shots and inspiration from the community'],
  ['Product news', 'Announcements and product updates'],
  ['Account activity', 'Important notes about you or activity you missed'],
  ['Project briefs', 'A weekly look at new briefs that match your work'],
  ['Meetups', 'Events posted close to your location'],
  ['Marketing', 'Products, promotions, and offers you can turn off any time'],
  ['Comments', 'Notifications about comments on your shots'],
  ['Mentions', 'Notifications when someone mentions you'],
  ['Follows', 'Notifications when someone follows you'],
]

export function NotificationsPage() {
  const { user, designs, comments, messages, users } = useStore()
  const [filter, setFilter] = useState('all')

  const notes = useMemo(() => {
    if (!user) return []
    const rows = []
    comments.forEach((item) => {
      const shot = designs.find((design) => design.id === item.designId && design.author?.id === user.id)
      if (!shot || item.userId === user.id) return
      rows.push({
        id: `c-${item.id}`,
        kind: 'comment',
        name: item.name,
        avatar: item.avatar,
        text: `commented on ${shot.title}`,
        detail: item.text,
        image: shot.image,
        to: `/shots/${shot.id}`,
        time: item.createdAt,
      })
    })
    designs.forEach((design) => {
      if (design.author?.id !== user.id) return
      design.likedBy.forEach((id) => {
        if (id === user.id) return
        const person = users.find((entry) => entry.id === id)
        if (!person) return
        rows.push({
          id: `l-${design.id}-${id}`,
          kind: 'like',
          name: person.name,
          avatar: person.avatar,
          text: `liked ${design.title}`,
          image: design.image,
          to: `/shots/${design.id}`,
          time: design.createdAt,
        })
      })
    })
    messages.forEach((item) => {
      if (item.fromId === user.id) return
      const person = users.find((entry) => entry.id === item.fromId)
      rows.push({
        id: `m-${item.id}`,
        kind: 'message',
        name: item.fromName || person?.name || 'Someone',
        avatar: person?.avatar || '',
        text: item.title || 'sent you a message',
        detail: item.text,
        to: '/messages',
        time: item.createdAt,
      })
    })
    return rows.sort((a, b) => b.time - a.time)
  }, [comments, designs, messages, user, users])

  const visible = filter === 'all' ? notes : notes.filter((item) => item.kind === filter)

  return (
    <div className="note-live">
      <div className="note-live-inner">
        <h1>Default Notifications</h1>
        <p>By default you are subscribed to the announcement and activity notes below. Change what you see from account settings any time.</p>
        {user && (
          <div className="note-filters">
            {[
              ['all', 'All'],
              ['like', 'Likes'],
              ['comment', 'Comments'],
              ['message', 'Messages'],
            ].map(([id, label]) => (
              <button key={id} type="button" className={filter === id ? 'is-on' : ''} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
        )}
        {user && visible.length === 0 && <p className="note-empty">You're all caught up.</p>}
        {user && visible.map((item) => (
          <Link className="note-row" to={item.to} key={item.id}>
            <img src={item.avatar || user.avatar} alt="" />
            <span>
              <strong>{item.name}</strong> {item.text}
              {item.detail && <small>{item.detail}</small>}
            </span>
            {item.image ? <img className="note-shot" src={item.image} alt="" /> : <em>{when(item.time)}</em>}
          </Link>
        ))}
        <ul className="default-notes">
          {defaultNotes.map(([label, text]) => (
            <li key={label}><strong>{label}:</strong> {text}</li>
          ))}
        </ul>
        <p className="note-foot">No spam ever. Unsubscribe any time.</p>
      </div>
    </div>
  )
}

export function LikesPage() {
  const { user, designs } = useStore()
  const [tab, setTab] = useState('likes')
  const likes = designs.filter((item) => item.likedBy.includes(user.id))
  const saved = designs.filter((item) => item.savedBy.includes(user.id))
  const list = tab === 'likes' ? likes : saved

  return (
    <div className="page-wrap">
      <div className="note-head">
        <h1>{tab === 'likes' ? 'Likes' : 'Saves'}</h1>
        <div className="note-filters">
          <button type="button" className={tab === 'likes' ? 'is-on' : ''} onClick={() => setTab('likes')}>Likes</button>
          <button type="button" className={tab === 'saves' ? 'is-on' : ''} onClick={() => setTab('saves')}>Saves</button>
        </div>
      </div>
      {list.length === 0 && <p className="empty-center">{tab === 'likes' ? 'Shots you like will show up here.' : 'Saved shots will show up here.'}</p>}
      {list.length > 0 && (
        <section className="shot-grid page-grid">
          {list.map((design) => <DesignCard key={design.id} design={design} />)}
        </section>
      )}
    </div>
  )
}

export function FollowingPage() {
  const { user, users, toggleFollow } = useStore()
  const people = (user.following || []).map((username) => users.find((item) => item.username === username)).filter(Boolean)

  return (
    <div className="page-wrap">
      <div className="note-head"><h1>Following</h1></div>
      {people.length === 0 && <p className="empty-center">Designers you follow will show up here.</p>}
      <div className="stack">
        {people.map((person) => (
          <article className="list-card" key={person.username}>
            <Link className="follow-person" to={`/u/${person.username}`}>
              <img src={person.avatar} alt="" />
              <span>
                <strong>{person.name}</strong>
                <small>{person.location || 'Available for work'}</small>
              </span>
            </Link>
            <button type="button" className="btn-ghost" onClick={() => toggleFollow(person.username)}>Following</button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function SettingsPage() {
  const { user, updateProfile } = useStore()
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    avatar: user.avatar || '',
  })
  const [saved, setSaved] = useState(false)

  function set(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    updateProfile({ name: form.name.trim(), bio: form.bio.trim(), location: form.location.trim(), avatar: form.avatar })
    setSaved(true)
  }

  return (
    <div className="page-wrap narrow">
      <div className="note-head"><h1>Account settings</h1></div>
      <form className="dash-form" onSubmit={submit}>
        {saved && <p className="muted">Saved.</p>}
        <label className="field">Name<input value={form.name} onChange={set('name')} required /></label>
        <label className="field">Location<input value={form.location} onChange={set('location')} /></label>
        <label className="field">Bio<textarea value={form.bio} onChange={set('bio')} /></label>
        <label className="field">Avatar URL<input value={form.avatar} onChange={set('avatar')} /></label>
        <p className="muted">Signed in as {user.email || user.username}</p>
        <button className="btn-dark" type="submit">Save changes</button>
      </form>
    </div>
  )
}
