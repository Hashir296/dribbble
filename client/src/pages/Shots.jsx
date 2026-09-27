import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DesignCard from '../components/DesignCard'
import { exploreCategories, tags } from '../data/sample'
import { useStore } from '../store'

const sorts = [
  { id: 'popular', label: 'Popular' },
  { id: 'new', label: 'New' },
  { id: 'liked', label: 'Most liked' },
]

export default function Shots() {
  const { designs, user } = useStore()
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag') || ''
  const cat = params.get('cat') || ''
  const sort = params.get('sort') || 'popular'
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [open])

  const list = useMemo(() => {
    let rows = designs.filter((item) => (!tag || item.tags.includes(tag)) && (!cat || item.category === cat))
    if (sort === 'following') {
      const names = new Set(user?.following || [])
      rows = rows.filter((item) => names.has(item.author?.username))
    }
    if (sort === 'new') rows = [...rows].sort((a, b) => b.createdAt - a.createdAt)
    if (sort === 'liked') rows = [...rows].sort((a, b) => (b.likes + b.likedBy.length) - (a.likes + a.likedBy.length))
    return rows
  }, [designs, tag, cat, sort, user])

  function setTag(next) {
    const value = next === tag ? '' : next
    const query = {}
    if (value) query.tag = value
    if (cat) query.cat = cat
    if (sort !== 'popular') query.sort = sort
    setParams(query)
  }

  function setSort(next) {
    const query = {}
    if (tag) query.tag = tag
    if (cat) query.cat = cat
    if (next !== 'popular') query.sort = next
    setParams(query)
    setOpen(false)
  }

  return (
    <div className="page-wrap">
      <div className="explore-bar">
        <Link className={!cat && sort !== 'new' && sort !== 'following' && sort !== 'discover' ? 'is-on' : ''} to="/shots">Popular</Link>
        <Link className={sort === 'new' && !cat ? 'is-on' : ''} to="/shots?sort=new">New & Noteworthy</Link>
        <Link className={sort === 'following' && !cat ? 'is-on' : ''} to="/shots?sort=following">Following</Link>
        <Link className={sort === 'discover' && !cat ? 'is-on' : ''} to="/shots?sort=discover">Discover</Link>
        {exploreCategories.map((item) => (
          <Link key={item} className={cat === item ? 'is-on' : ''} to={`/shots?cat=${encodeURIComponent(item)}`}>{item}</Link>
        ))}
        <button type="button" onClick={() => setFilters((value) => !value)}>Filters</button>
      </div>
      {filters && (
        <div className="tag-row">
          <div className="tags">
            {tags.map((item) => (
              <button key={item} type="button" className={tag === item ? 'is-active' : ''} onClick={() => setTag(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="sort">
            <button type="button" onClick={(event) => { event.stopPropagation(); setOpen((value) => !value) }}>
              {sorts.find((item) => item.id === sort)?.label || 'Popular'}
              <Caret />
            </button>
            {open && (
              <div className="sort-menu">
                {sorts.map((item) => (
                  <button key={item.id} type="button" className={sort === item.id ? 'is-active' : ''} onClick={() => setSort(item.id)}>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {list.length ? (
        <section className="shot-grid page-grid">
          {list.map((design) => <DesignCard key={design.id} design={design} />)}
        </section>
      ) : (
        <p className="empty">
          {sort === 'following' && !user && <>Sign in to see shots from designers you follow. <Link to="/login">Log in</Link></>}
          {sort === 'following' && user && 'Follow designers to see their latest shots here.'}
          {sort !== 'following' && 'No designs in this filter.'}
        </p>
      )}
    </div>
  )
}

function Caret() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
