import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DesignCard from '../components/DesignCard'
import { services, slug } from '../data/sample'
import { useStore } from '../store'

const scopes = [
  { id: 'shots', label: 'Shots' },
  { id: 'designers', label: 'Designers' },
  { id: 'services', label: 'Services' },
]

export default function SearchPage() {
  const { designs } = useStore()
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const type = params.get('type') || 'shots'
  const [text, setText] = useState(initial)
  const q = initial.trim().toLowerCase()

  const shots = designs.filter((item) => {
    const blob = `${item.title} ${item.description} ${item.author.name} ${item.tags.join(' ')} ${item.category}`.toLowerCase()
    return !q || blob.includes(q)
  })
  const people = []
  const seen = new Set()
  designs.forEach((item) => {
    if (seen.has(item.author.username)) return
    const blob = `${item.author.name} ${item.author.username} ${item.author.location || ''} ${item.author.bio || ''}`.toLowerCase()
    if (!q || blob.includes(q)) {
      seen.add(item.author.username)
      people.push(item.author)
    }
  })
  const offers = services.filter((item) => !q || `${item.title} ${item.owner}`.toLowerCase().includes(q))

  function submit(event) {
    event.preventDefault()
    const next = { type }
    if (text.trim()) next.q = text.trim()
    setParams(next)
  }

  return (
    <div className="page-wrap">
      <form className="search search-page" onSubmit={submit}>
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Search designs, tags, or designers" aria-label="Search" />
      </form>
      <div className="tags" style={{ marginBottom: 18 }}>
        {scopes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={type === item.id ? 'is-active' : ''}
            onClick={() => {
              const next = { type: item.id }
              if (initial) next.q = initial
              setParams(next)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {type === 'shots' && (
        <>
          <h2 className="section-title">{shots.length} shot{shots.length === 1 ? '' : 's'}</h2>
          {shots.length ? <section className="shot-grid page-grid">{shots.map((item) => <DesignCard key={item.id} design={item} />)}</section> : <p className="empty">No shots match.</p>}
        </>
      )}

      {type === 'designers' && (
        <>
          <h2 className="section-title">{people.length} designer{people.length === 1 ? '' : 's'}</h2>
          <div className="people-list">
            {people.map((person) => (
              <Link key={person.username} to={`/u/${person.username}`} className="people-row">
                <img src={person.avatar} alt="" />
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.location || `@${person.username}`}</span>
                </div>
              </Link>
            ))}
            {!people.length && <p className="empty">No designers match.</p>}
          </div>
        </>
      )}

      {type === 'services' && (
        <>
          <h2 className="section-title">{offers.length} service{offers.length === 1 ? '' : 's'}</h2>
          <section className="service-grid page-grid">
            {offers.map((item) => (
              <Link className="service card-block" to={`/u/${slug(item.owner)}`} key={item.id}>
                <img src={item.image || designs[0]?.image} alt="" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.owner}</p>
                  <strong>{item.price}</strong>
                </div>
              </Link>
            ))}
          </section>
          {!offers.length && <p className="empty">No services match.</p>}
        </>
      )}
    </div>
  )
}
