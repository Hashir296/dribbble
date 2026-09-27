import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { exploreCategories } from '../data/sample'
import { useStore } from '../store'
import Logo from './Logo'

const scopes = [
  { id: 'shots', label: 'Shots' },
  { id: 'designers', label: 'Designers' },
  { id: 'services', label: 'Services' },
]

const menus = [
  {
    label: 'Explore',
    to: '/shots',
    kind: 'list',
    items: [
      { icon: 'trend', label: 'Popular', to: '/shots', bold: true },
      { icon: 'spark', label: 'New and Noteworthy', to: '/shots?sort=new', bold: true },
      { icon: 'people', label: 'Following', to: '/shots?sort=following', bold: true },
      { rule: true },
      ...exploreCategories.map((label) => ({ label, to: `/shots?cat=${encodeURIComponent(label)}` })),
    ],
  },
  {
    label: 'Hire Talent',
    to: '/designers',
    kind: 'split',
    main: [
      { icon: 'brief', label: 'Start Project Brief', note: 'Get recommendations and proposals', to: '/briefs' },
      { icon: 'people', label: 'Browse Profiles', note: 'Find and message talent directly', to: '/designers' },
      { icon: 'bag', label: 'Explore Services', note: 'Hire quickly with pre-packaged services', to: '/services' },
    ],
    side: [
      { label: 'Browse Design Agencies', to: '/agencies' },
      { label: 'Post a Full-Time Job', to: '/jobs?post=1' },
    ],
    learn: { label: 'Learn more about how hiring works on Dribbble', to: '/hiring' },
  },
  {
    label: 'Get Hired',
    to: '/briefs',
    kind: 'split get-hired',
    main: [
      { icon: 'brief', label: 'Browse Project Briefs', note: 'Pitch clients ready to hire now', to: '/briefs' },
      { icon: 'bag', label: 'Add Service', note: 'Let clients purchase your services', to: '/services?add=1' },
      { icon: 'spark', label: 'Send Outbound Proposal', note: 'Send proposals to any client', to: '/proposals', badge: 'New' },
    ],
    side: [
      { label: 'Full-Time Jobs', to: '/jobs' },
      { label: 'Upgrade to Pro', to: '/pro' },
      { label: 'Advertise with Us', to: '/advertise' },
    ],
    learn: { label: 'Learn more about getting hired on Dribbble', to: '/for-designers' },
  },
  {
    label: 'Community',
    to: '/blog',
    kind: 'community',
    main: [
      { icon: 'blog', label: 'Blog', note: 'Design inspiration, stories, and tips', to: '/blog' },
      { icon: 'play', label: 'Playoffs', note: 'Join creative challenges and show your skills', to: '/playoffs' },
      { icon: 'help', label: 'Help Center', note: 'Get quick answers and learn how to use Dribbble', to: '/help' },
    ],
  },
]

function flatLinks(item) {
  return [...(item.items || []), ...(item.main || []), ...(item.side || []), ...(item.learn ? [item.learn] : [])].filter((entry) => entry.to)
}

export default function Navbar() {
  const { user, logout, messages, comments, designs } = useStore()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState('')
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('shots')
  const [scopeOpen, setScopeOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenu('')
  }, [location.pathname])

  const notes = user
    ? comments.filter((item) => designs.some((design) => design.id === item.designId && design.author.id === user.id && item.userId !== user.id)).slice(0, 5)
    : []

  function goSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    params.set('type', scope)
    navigate(`/search?${params.toString()}`)
    setQuery('')
    setOpen(false)
  }

  return (
    <header className="nav">
      <div className="nav-bar">
        <Link to="/" className="logo" aria-label="Dribbble" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        {location.pathname !== '/' && (
          <form className="nav-find" onSubmit={goSearch}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" aria-label="Search" />
            <div className="scope">
              <button type="button" onClick={() => setScopeOpen((value) => !value)}>
                {scopes.find((item) => item.id === scope).label}<Caret />
              </button>
              {scopeOpen && (
                <div className="scope-menu">
                  {scopes.map((item) => (
                    <button key={item.id} type="button" className={scope === item.id ? 'is-active' : ''} onClick={() => { setScope(item.id); setScopeOpen(false) }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="search-go" type="submit" aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </form>
        )}
        <nav className="nav-links" onMouseLeave={() => setMenu('')}>
          {menus.map((item) => (
            <div className="nav-item" key={item.label} onMouseEnter={() => setMenu(item.label)}>
              <Link to={item.to} aria-expanded={menu === item.label} onClick={() => setMenu('')}>
                {item.label}<Caret />
              </Link>
              <div className={menu === item.label ? `nav-menu ${item.kind} is-open` : `nav-menu ${item.kind}`}>
                {item.kind === 'list' && item.items.map((entry) => (
                  entry.rule ? <div className="nav-divider" key={`${item.label}-rule`} /> : (
                    <Link className={entry.bold ? 'nav-row bold' : 'nav-row'} to={entry.to} key={entry.label} onClick={() => setMenu('')}>
                      {entry.icon && <Mark name={entry.icon} />}
                      {entry.label}
                    </Link>
                  )
                ))}
                {item.kind.startsWith('split') && (
                  <div className="nav-split">
                    <div className="nav-split-main">
                      {item.main.map((entry) => (
                        <Link className="nav-feature" to={entry.to} key={entry.label} onClick={() => setMenu('')}>
                          <Mark name={entry.icon} />
                          <span>
                            <strong>{entry.label}{entry.badge && <em className="nav-new">{entry.badge}</em>}</strong>
                            <small>{entry.note}</small>
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="nav-split-side">
                      {item.side.map((entry) => (
                        <Link className="nav-side-link" to={entry.to} key={entry.label} onClick={() => setMenu('')}>
                          {entry.label}<span aria-hidden="true">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {item.kind.startsWith('split') && item.learn && (
                  <>
                    <div className="nav-divider" />
                    <Link className="nav-learn" to={item.learn.to} onClick={() => setMenu('')}>
                      <Mark name="book" />
                      {item.learn.label}<span aria-hidden="true">→</span>
                    </Link>
                  </>
                )}
                {item.kind === 'community' && (
                  <>
                    {item.main.map((entry) => (
                      <Link className="nav-feature" to={entry.to} key={entry.label} onClick={() => setMenu('')}>
                        <Mark name={entry.icon} />
                        <span>
                          <strong>{entry.label}</strong>
                          <small>{entry.note}</small>
                        </span>
                      </Link>
                    ))}
                    <div className="nav-divider" />
                    <div className="nav-follow">
                      <span>Follow Us</span>
                      <a href="https://instagram.com/dribbble" target="_blank" rel="noreferrer" aria-label="Instagram"><Mark name="ig" /></a>
                      <a href="https://x.com/dribbble" target="_blank" rel="noreferrer" aria-label="X"><Mark name="x" /></a>
                      <a href="https://www.pinterest.com/dribbble/" target="_blank" rel="noreferrer" aria-label="Pinterest"><Mark name="pin" /></a>
                      <a href="https://www.youtube.com/dribbble/" target="_blank" rel="noreferrer" aria-label="YouTube"><Mark name="yt" /></a>
                      <a href="https://www.tiktok.com/@dribbble.com" target="_blank" rel="noreferrer" aria-label="TikTok"><Mark name="tt" /></a>
                      <a href="https://threads.com/dribbble" target="_blank" rel="noreferrer" aria-label="Threads"><Mark name="th" /></a>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </nav>
        <div className="nav-auth">
          {user ? (
            <>
              <Link className="nav-brief-live" to="/briefs">
                <Mark name="doc" />
                Start Project Brief
              </Link>
              <div
                className="nav-item"
                onMouseEnter={() => setMenu('inbox')}
                onMouseLeave={() => setMenu((current) => (current === 'inbox' ? '' : current))}
              >
                <Link className={location.pathname === '/messages' ? 'nav-icon is-on' : 'nav-icon'} to="/messages" aria-label="Messages">
                  <Mark name="chat" />
                </Link>
                <div className={menu === 'inbox' ? 'nav-menu nav-panel is-open' : 'nav-menu nav-panel'}>
                  <strong className="nav-panel-title">Messages</strong>
                  {messages.slice(0, 4).map((item) => (
                    <Link to="/messages" key={item.id} onClick={() => setMenu('')}>
                      <strong>{item.title || 'Message'}</strong>
                      <small>{item.text}</small>
                    </Link>
                  ))}
                  {messages.length === 0 && <p className="nav-panel-empty">No messages yet.</p>}
                  <Link className="nav-panel-all" to="/messages" onClick={() => setMenu('')}>Open messages</Link>
                </div>
              </div>
              <div
                className="nav-item"
                onMouseEnter={() => setMenu('bell')}
                onMouseLeave={() => setMenu((current) => (current === 'bell' ? '' : current))}
              >
                <Link className={location.pathname === '/notifications' ? 'nav-icon is-on' : 'nav-icon'} to="/notifications" aria-label="Notifications">
                  <Mark name="bell" />
                </Link>
                <div className={menu === 'bell' ? 'nav-menu nav-panel is-open' : 'nav-menu nav-panel'}>
                  <strong className="nav-panel-title">Notifications</strong>
                  {notes.length === 0 && <p className="nav-panel-empty">You're all caught up.</p>}
                  {notes.slice(0, 4).map((item) => (
                    <Link to="/notifications" key={item.id} onClick={() => setMenu('')}>
                      <strong>{item.name}</strong>
                      <small>{item.text}</small>
                    </Link>
                  ))}
                  <Link className="nav-panel-all" to="/notifications" onClick={() => setMenu('')}>Open notifications</Link>
                </div>
              </div>
              <div
                className="nav-item"
                onMouseEnter={() => setMenu('account')}
                onMouseLeave={() => setMenu((current) => (current === 'account' ? '' : current))}
              >
                <button type="button" className="avatar-btn" aria-label="Account" onClick={() => setMenu('account')}><img src={user.avatar} alt="" /></button>
                <div className={menu === 'account' ? 'nav-menu nav-menu-right is-open' : 'nav-menu nav-menu-right'}>
                  <Link to={`/u/${user.username}`}>Profile</Link>
                  <Link to="/messages">Messages</Link>
                  <Link to="/notifications">Notifications</Link>
                  <Link to="/likes">Likes</Link>
                  <Link to="/following">Following</Link>
                  <Link to="/upload">Upload</Link>
                  <Link to="/settings">Account settings</Link>
                  <button type="button" onClick={logout}>Log out</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link className="signup" to="/register">Sign up</Link>
              <Link className="login" to="/login">Log in</Link>
            </>
          )}
        </div>
        <button type="button" className="burger" aria-label="Menu" onClick={() => setOpen((value) => !value)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="nav-drawer">
          <form className="nav-search nav-search-mobile" onSubmit={goSearch}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search" />
          </form>
          {menus.map((menu) => (
            <div key={menu.label}>
              <Link to={menu.to} onClick={() => setOpen(false)}>{menu.label}</Link>
              {flatLinks(menu).map((item) => (
                <Link to={item.to} key={item.label} onClick={() => setOpen(false)}>{item.label}</Link>
              ))}
            </div>
          ))}
          <div className="nav-drawer-auth">
            {user ? (
              <>
                <Link to="/messages" onClick={() => setOpen(false)}>Messages</Link>
                <Link to="/notifications" onClick={() => setOpen(false)}>Notifications</Link>
                <Link to="/settings" onClick={() => setOpen(false)}>Account settings</Link>
                <button type="button" className="signup" onClick={() => { logout(); setOpen(false) }}>Log out</button>
              </>
            ) : (
              <>
                <Link className="signup" to="/register" onClick={() => setOpen(false)}>Sign up</Link>
                <Link className="login" to="/login" onClick={() => setOpen(false)}>Log in</Link>
                <Link className="nav-brief" to="/briefs" onClick={() => setOpen(false)}>Start Project Brief</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function Mark({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'trend') return <svg {...common}><path d="M4 16l5-5 3 3 8-8" /><path d="M14 6h6v6" /></svg>
  if (name === 'spark') return <svg {...common}><path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" /></svg>
  if (name === 'brief') return <svg {...common}><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /><rect x="4" y="7" width="16" height="13" rx="2" /><path d="M4 12h16" /></svg>
  if (name === 'people') return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><circle cx="17" cy="9" r="2.2" /><path d="M16.2 19a4 4 0 0 1 4.3-3" /></svg>
  if (name === 'bag') return <svg {...common}><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /></svg>
  if (name === 'blog') return <svg {...common}><path d="M5 5h10a2 2 0 0 1 2 2v12H7a2 2 0 0 0-2 2V5z" /><path d="M5 19a2 2 0 0 1 2-2h10" /></svg>
  if (name === 'play') return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M10 9l6 3-6 3V9z" /></svg>
  if (name === 'help') return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M9.5 9a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.8-1.2 1.6" /><path d="M12 17h.01" /></svg>
  if (name === 'x') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M9.3 7.1 14.4 1.5h-1.2L8.8 6.3 5.2 1.5H1.4l5.4 7.8L1.4 14.5h1.2l4.7-5.4 3.8 5.4h3.8L9.3 7.1Z" /></svg>
  if (name === 'ig') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="8" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
  if (name === 'pin') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.5c1.6 0 2.6 1 2.6 2.4 0 1.8-1 3-2 3-.4 0-.7-.3-.6-.8l.4-1.5c.1-.3 0-.4-.2-.4-.5 0-1 .6-1 1.5 0 .5.2.8.2.8L6.5 12" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
  if (name === 'yt') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="4" width="13" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M7 6.5v3l3-1.5-3-1.5z" fill="currentColor" /></svg>
  if (name === 'tt') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M10.2 2c.3 1.6 1.3 2.8 2.8 3.2v1.8c-1 0-1.9-.3-2.7-.8v4.2A4.4 4.4 0 1 1 6.4 6v1.9a2.6 2.6 0 1 0 1.9 2.5V2h1.9z" /></svg>
  if (name === 'th') return <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M6.2 7.4c1.2-.1 2.1-.7 2.6-1.8l.4-1.1h1.5l-.3 1.2c-.4 1.2-.2 2.1.5 2.7.6.5 1.4.7 2.3.6l.8-.1-.2 1.5c-.7.2-1.4.1-2-.2-.6-.3-1-.8-1.2-1.4-.2 1.6-1.2 2.7-2.7 3.1-1.6.4-3.2-.2-4-1.6S3.2 7.6 4.5 6.6c.8-.6 1.6-.7 1.7.8z" /></svg>
  if (name === 'book') return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5V19" /></svg>
  if (name === 'doc') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>
  if (name === 'chat') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3.5V6.5z" /></svg>
  if (name === 'bell') return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2H4.5L6 16z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>
  return null
}

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
