import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { exploreCategories } from '../data/sample'
import { useStore } from '../store'

export default function Designers() {
  const { designs, users } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  useEffect(() => {
    setQuery(params.get('q') || '')
  }, [params])
  const map = new Map()
  designs.forEach((item) => {
    if (!map.has(item.author.username)) {
      map.set(item.author.username, { ...item.author, shots: [] })
    }
    const person = map.get(item.author.username)
    if (person.shots.length < 3) person.shots.push(item)
  })
  users.forEach((item) => {
    if (!map.has(item.username)) map.set(item.username, { ...item, pro: false, shots: [] })
  })
  const people = [...map.values()].filter((person) => {
    const hay = `${person.name} ${person.location || ''} ${person.username}`.toLowerCase()
    return hay.includes(query.trim().toLowerCase())
  })

  return (
    <div className="page-wrap">
      <div className="hire-hero">
        <h1>Hire Freelancers: Top Designers & Developers</h1>
        <p>Search talent by name or skill, then message them directly.</p>
        <form className="search" onSubmit={(event) => { event.preventDefault(); navigate(`/search?type=designers&q=${encodeURIComponent(query)}`) }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search designers" aria-label="Search designers" />
          <button className="search-go" type="submit" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </form>
      </div>
      <h2 className="section-title">Search Talent by Category</h2>
      <div className="explore-bar">
        {exploreCategories.map((item) => (
          <Link key={item} to={`/shots?cat=${encodeURIComponent(item)}`}>{item}</Link>
        ))}
      </div>
      <h2 className="section-title">Discover more Freelance Designers and Developers</h2>
      <section className="designer-grid page-grid">
        {people.map((person) => (
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
    </div>
  )
}
