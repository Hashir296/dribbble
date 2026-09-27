import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DesignCard from '../components/DesignCard'
import { useStore } from '../store'

export default function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { designs, users, user, toggleFollow, addMessage } = useStore()
  const [tab, setTab] = useState('work')
  const account = users.find((item) => item.username === username)
  const shots = designs.filter((item) => item.author.username === username)
  const person = account || shots[0]?.author

  if (!person) {
    if (designs.length === 0 && users.length === 0) return null
    return <div className="page-wrap"><h1>Designer not found</h1><Link to="/designers">Browse designers</Link></div>
  }

  const followers = (person.followers || 0) + users.filter((item) => item.following?.includes(username)).length
  const following = !!user && user.following.includes(username)
  const mine = user?.username === username
  const liked = account ? designs.filter((item) => item.likedBy.includes(account.id)) : []
  const saved = account ? designs.filter((item) => item.savedBy.includes(account.id)) : []
  const visible = tab === 'liked' ? liked : tab === 'saved' ? saved : shots

  return (
    <div>
      <header className="profile-head">
        <img src={person.avatar} alt="" />
        <div>
          <h1>{person.name} {person.pro && <em className="pro">PRO</em>}</h1>
          <p className="handle">@{person.username}</p>
          <p className="detail-desc">{person.bio || 'Product designer'}</p>
          <p className="muted">{person.location || 'Remote'}</p>
          <span className="avail">Available for work</span>
          <div className="stats">
            <span><b>{shots.length}</b> shots</span>
            <span><b>{followers}</b> followers</span>
            <span><b>{account?.following?.length || 0}</b> following</span>
          </div>
        </div>
        <div className="detail-actions">
          {mine ? (
            <Link className="btn-dark" to="/settings">Edit profile</Link>
          ) : (
            <>
              <button type="button" className={following ? 'btn-dark' : 'btn-ghost'} onClick={() => { if (!user) navigate('/login'); else toggleFollow(username) }}>
                {following ? 'Following' : 'Follow'}
              </button>
              <button
                type="button"
                className="btn-pink"
                onClick={() => {
                  if (!user) {
                    navigate('/login')
                    return
                  }
                  addMessage({ type: 'contact', to: username, title: `Message for ${person.name}`, text: `Hi ${person.name}, I'd like to talk about a project.` })
                  navigate('/messages')
                }}
              >
                Get in touch
              </button>
            </>
          )}
        </div>
      </header>

      <div className="tabs-line">
        <button type="button" className={tab === 'work' ? 'is-active' : ''} onClick={() => setTab('work')}>Work</button>
        <button type="button" className={tab === 'liked' ? 'is-active' : ''} onClick={() => setTab('liked')}>Liked</button>
        {mine && <button type="button" className={tab === 'saved' ? 'is-active' : ''} onClick={() => setTab('saved')}>Saved</button>}
      </div>

      {visible.length ? (
        <section className="shot-grid">{visible.map((item) => <DesignCard key={item.id} design={item} />)}</section>
      ) : <p className="empty">Nothing here yet.</p>}
    </div>
  )
}
