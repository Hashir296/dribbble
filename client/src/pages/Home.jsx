import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DesignCard from '../components/DesignCard'
import { services, slug, tags } from '../data/sample'
import { useStore } from '../store'

const words = ['web design', 'mobile design', 'motion design', 'product design', 'brand design', 'UX/UI design']
const hiredLines = ['Share your work', 'Offer your services', 'Send proposals', 'Create your profile', 'Browse client briefs']
const tabs = [
  { id: 'shots', label: 'Shots', placeholder: 'What type of design are you interested in?' },
  { id: 'designers', label: 'Designers', placeholder: 'Search designers' },
  { id: 'services', label: 'Services', placeholder: 'Search services' },
]
const sorts = [
  { id: 'popular', label: 'Popular' },
  { id: 'new', label: 'New' },
  { id: 'liked', label: 'Most liked' },
]

export default function Home() {
  const { designs, ready, user } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('shots')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState('popular')
  const [sortOpen, setSortOpen] = useState(false)
  const [word, setWord] = useState(0)
  const [hiredWord, setHiredWord] = useState(0)
  const [mode, setMode] = useState('hire')
  const [promo, setPromo] = useState(true)
  const [adsOn, setAdsOn] = useState(true)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setWord((n) => (n + 1) % words.length)
      setHiredWord((n) => (n + 1) % hiredLines.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (paused || designs.length === 0) return undefined
    const timer = setInterval(() => setSlide((n) => (n + 1) % designs.length), 2400)
    return () => clearInterval(timer)
  }, [paused, designs.length])

  useEffect(() => {
    if (!sortOpen) return
    const close = () => setSortOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [sortOpen])

  const active = tabs.find((item) => item.id === tab)
  const q = query.trim().toLowerCase()

  const shots = useMemo(() => {
    let list = designs.filter((item) => {
      const text = `${item.title} ${item.author.name} ${item.tags.join(' ')}`.toLowerCase()
      return (!q || text.includes(q)) && (!tag || item.tags.includes(tag))
    })
    if (sort === 'liked') list = [...list].sort((a, b) => (b.likes + b.likedBy.length) - (a.likes + a.likedBy.length))
    if (sort === 'new') list = [...list].sort((a, b) => b.createdAt - a.createdAt)
    return list
  }, [designs, q, tag, sort])

  const designers = useMemo(() => {
    const map = new Map()
    designs.forEach((item) => {
      const key = item.author.name
      if (!map.has(key)) map.set(key, { ...item.author, shots: [] })
      if (map.get(key).shots.length < 3) map.get(key).shots.push(item)
    })
    return [...map.values()].filter((item) => !q || item.name.toLowerCase().includes(q))
  }, [designs, q])

  const serviceList = services.filter((item) => !q || `${item.title} ${item.owner}`.toLowerCase().includes(q))

  return (
    <div id="top">
      {promo && (
        <div className="promo">
          <div className="promo-inner">
            <p>
              <Gift />
              Get 20% off your first payment for design and development services on Dribbble. Use code WELCOME20 🎉
            </p>
            <Link to="/register">Get Started</Link>
            <button type="button" className="promo-close" aria-label="Close" onClick={() => setPromo(false)}>×</button>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-switch">
            <button type="button" className={mode === 'hire' ? 'is-on' : ''} onClick={() => setMode('hire')}>HIRE TALENT</button>
            <button type="button" className={mode === 'work' ? 'is-on' : ''} onClick={() => setMode('work')}>GET HIRED</button>
          </div>
          {mode === 'hire' ? (
            <>
              <h1>Work with the world’s<br />best in <span className="rotating">{words[word]}</span></h1>
              <ul>
                <li><Check /> Generate your brief and receive proposals–for free</li>
                <li><Check /> Browse real design and development work</li>
                <li><Check /> Hire top-rated freelancers and agencies</li>
              </ul>
              <Link className="cta" to="/briefs"><Spark /> Start Your Project Brief</Link>
            </>
          ) : (
            <>
              <h1>
                <span className="phrase-stack">
                  <span className="phrase-ghost">{hiredLines[(hiredWord + hiredLines.length - 1) % hiredLines.length]}</span>
                  <span className="rotating" key={hiredWord}>{hiredLines[hiredWord]}</span>
                </span>
                <br />
                and get hired
              </h1>
              <ul>
                <li><Check /> Join a community of world-class freelancers and agencies</li>
                <li><Check /> Get qualified leads and send proposals – for free</li>
                <li><Check /> Accept payments on Dribbble safely and easily</li>
              </ul>
              <div className="hero-actions">
                <Link className="cta" to={user ? '/upload' : '/register'}><ShotPlus /> Share Your Work</Link>
                <Link className="cta-line" to="/briefs">Browse Project Briefs</Link>
              </div>
            </>
          )}
        </div>
        {designs[slide] && (
          <div className="hero-art">
            <img className="art-main" src={designs[slide].image} alt="" referrerPolicy="no-referrer" />
            <Link className="reel-badge" to={`/u/${designs[slide].author.username}`}>{designs[slide].author.name}</Link>
            <button type="button" className="reel-pause" aria-label={paused ? 'Play media' : 'Pause media'} onClick={() => setPaused((value) => !value)}>
              {paused ? (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l8-4.5-8-4.5z" fill="currentColor" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.5h3v9H2zm5 0h3v9H7z" fill="currentColor" /></svg>
              )}
            </button>
          </div>
        )}
      </section>

      <section className="finder" id="feed">
        <div className="finder-tabs">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'is-active' : ''}
              onClick={() => { setTab(item.id); setTag('') }}
            >
              {item.id === 'shots' && <GridIcon />}
              {item.id === 'designers' && <PeopleIcon />}
              {item.id === 'services' && <BagIcon />}
              {item.label}
            </button>
          ))}
        </div>

          <form className="search" onSubmit={(e) => { e.preventDefault(); const params = new URLSearchParams(); if (query.trim()) params.set('q', query.trim()); params.set('type', tab); navigate(`/search?${params.toString()}`) }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={active.placeholder}
            aria-label="Search"
          />
          {q && tab === 'shots' && (
            <div className="search-suggest">
              {shots.slice(0, 5).map((item) => (
                <Link key={item.id} to={`/shots/${item.id}`}>{item.title}</Link>
              ))}
              <button type="submit">See all results</button>
            </div>
          )}
          <button className="search-go" type="submit" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        {tab === 'shots' && (
          <div className="tag-row">
            <span>Popular:</span>
            <div className="tags">
              {tags.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={tag === item ? 'is-active' : ''}
                  onClick={() => setTag(tag === item ? '' : item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="sort">
              <button type="button" onClick={(e) => { e.stopPropagation(); setSortOpen((v) => !v) }}>
                {sorts.find((item) => item.id === sort).label}
                <Caret />
              </button>
              {sortOpen && (
                <div className="sort-menu" onClick={(e) => e.stopPropagation()}>
                  {sorts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={sort === item.id ? 'is-active' : ''}
                      onClick={() => { setSort(item.id); setSortOpen(false) }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {tab === 'shots' && (
        shots.length ? (
          <section className="shot-grid">
            {shots.flatMap((design, index) => {
              const cells = [<DesignCard key={design.id} design={design} />]
              if (adsOn && (index === 2 || index === 8)) {
                cells.push(
                  <article className="shot ad-card" key={`ad-${index}`}>
                    <div className="shot-media ad-media">
                      <img src={designs[index]?.image || designs[0]?.image} alt="" referrerPolicy="no-referrer" />
                      <div className="ad-copy">
                        <p>Put your studio in front of people hiring designers.</p>
                        <div className="ad-actions">
                          <button type="button" onClick={() => setAdsOn(false)}>Hide ads</button>
                          <Link to="/advertise">Advertise</Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              }
              return cells
            })}
          </section>
        ) : <p className="empty">{ready ? 'No designs match that search.' : 'Loading shots…'}</p>
      )}

      {tab === 'designers' && (
        designers.length ? (
          <section className="designer-grid">
            {designers.map((person) => (
              <Link className="designer" to={`/u/${person.username}`} key={person.username}>
                <div className="designer-head">
                  <img src={person.avatar} alt="" />
                  <div>
                    <h3>{person.name} {person.pro && <em>PRO</em>}</h3>
                    <p>{person.location || 'Available for work'}</p>
                  </div>
                </div>
                <div className="designer-shots">
                  {person.shots.map((shot) => <img key={shot.id} src={shot.image} alt="" />)}
                </div>
              </Link>
            ))}
          </section>
        ) : <p className="empty">No designers match that search.</p>
      )}

      {tab === 'services' && (
        serviceList.length ? (
          <section className="service-grid">
            {serviceList.map((item) => (
              <Link className="service" to={`/u/${slug(item.owner)}`} key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.owner}</p>
                  <strong>{item.price}</strong>
                </div>
              </Link>
            ))}
          </section>
        ) : <p className="empty">No services match that search.</p>
      )}
    </div>
  )
}

function Gift() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13" fill="none" stroke="#EA4C89" strokeWidth="1.7" />
      <path d="M12 7c-2-4-6-2-4 .5M12 7c2-4 6-2 4 .5" fill="none" stroke="#EA4C89" strokeWidth="1.7" />
    </svg>
  )
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="8" fill="#FDE8F1" />
      <path d="M5 9.2 7.6 12 13 6.5" fill="none" stroke="#EA4C89" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ShotPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="7" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" />
      <path d="M5 17.5 8.2 14.4a1 1 0 0 1 1.3 0L12 16.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3v6M13 6h6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function Spark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5 9.2 6 13.5 8 9.2 10 8 14.5 6.8 10 2.5 8 6.8 6 8 1.5z" fill="currentColor" />
    </svg>
  )
}

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 18.5c.8-2.6 2.8-4 5.5-4s4.7 1.4 5.5 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.2 14.6c1.8.3 3.2 1.4 3.8 3.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}
