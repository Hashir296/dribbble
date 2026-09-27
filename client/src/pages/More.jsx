import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { designs, exploreCategories, faqs, jobs, places, posts, services, slug } from '../data/sample'
import { useStore } from '../store'

function serviceCat(title) {
  const text = title.toLowerCase()
  if (text.includes('brand')) return 'Branding'
  if (text.includes('mobile')) return 'Mobile'
  if (text.includes('illustrat')) return 'Illustration'
  if (text.includes('animat')) return 'Animation'
  if (text.includes('landing') || text.includes('portfolio') || text.includes('web')) return 'Web Design'
  return 'Product Design'
}

function Page({ title, lead, children }) {
  return (
    <div className="page-wrap narrow">
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export function ServicesPage() {
  const { user, designs, services, addService } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [cat, setCat] = useState('All')
  const [form, setForm] = useState({ title: '', price: '', category: 'Product Design' })
  const [done, setDone] = useState(false)
  const cats = ['All', ...exploreCategories.slice(0, 6)]
  const shown = cat === 'All' ? services : services.filter((item) => (item.category || serviceCat(item.title)) === cat)

  async function submit(event) {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    await addService({ ...form, image: designs[0]?.image || '' })
    setDone(true)
    setForm({ title: '', price: '', category: 'Product Design' })
  }
  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Explore Services</h1>
        <p>Hire designers offering design services for your next project.</p>
      </div>
      <div className="explore-bar">
        {cats.map((item) => (
          <button key={item} type="button" className={cat === item ? 'is-on' : ''} onClick={() => setCat(item)}>{item}</button>
        ))}
      </div>
      <section className="service-grid page-grid">
        {shown.map((item) => (
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
      {shown.length === 0 && <p className="muted">No services in this category yet.</p>}
      <h2 className="section-title" id="add-service">Offer a service</h2>
      {params.get('add') && !user && <p className="muted">Sign in to list a service clients can buy.</p>}
      <form className="dash-form" onSubmit={submit}>
        {done && <p className="muted">Service listed. It is on the board above.</p>}
        <label className="field">Service title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label className="field">Price<input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="From $1,500" required /></label>
        <label className="field">Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {exploreCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="btn-pink" type="submit">Add service</button>
      </form>
    </div>
  )
}

export function JobsPage() {
  const { user, jobs, addMessage, addJob } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [post, setPost] = useState({ title: '', place: 'Remote', type: 'Full-time' })
  const [posted, setPosted] = useState(false)
  const query = (params.get('q') || '').toLowerCase()
  const [sent, setSent] = useState('')

  function apply(job) {
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    addMessage({ type: 'job', title: job.title, to: job.company, text: `${user.name} applied for ${job.title}.` })
    setSent(job.id)
  }

  const [kind, setKind] = useState('All')
  const kinds = ['All', 'Full-time', 'Contract', 'Freelance']
  const visible = jobs.filter((job) => {
    const typed = kind === 'All' || job.type === kind
    const hay = `${job.title} ${job.company} ${job.place} ${job.type}`.toLowerCase()
    return typed && (!query || hay.includes(query) || query[0] === job.title[0].toLowerCase())
  })

  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>The #1 Job Board for Graphic Design Jobs</h1>
        <p>Browse full-time roles and contracts from studios hiring designers.</p>
      </div>
      <div className="explore-bar">
        {kinds.map((item) => (
          <button key={item} type="button" className={kind === item ? 'is-on' : ''} onClick={() => setKind(item)}>{item}</button>
        ))}
      </div>
      <div className="stack">
        {visible.map((job) => (
          <article className="list-card job-card" key={job.id}>
            <div>
              <h3>{job.title}</h3>
              <p>{job.company} · {job.place}</p>
              <em>{job.type}</em>
            </div>
            <button type="button" className="btn-dark" onClick={() => apply(job)}>{sent === job.id ? 'Applied' : 'Apply'}</button>
          </article>
        ))}
        {visible.length === 0 && <p className="muted">No open roles match this filter. Browse the full board or post a brief.</p>}
      </div>
      {(params.get('post') || posted) && <h2 className="section-title">Post a full-time job</h2>}
      <form className="dash-form" onSubmit={async (event) => {
        event.preventDefault()
        if (!user) {
          navigate('/login', { state: { from: '/jobs?post=1' } })
          return
        }
        await addJob(post)
        setPosted(true)
        setPost({ title: '', place: 'Remote', type: 'Full-time' })
      }}>
        {posted && <p className="muted">Job posted. It is on the board above.</p>}
        <label className="field">Role<input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} required /></label>
        <label className="field">Location<input value={post.place} onChange={(e) => setPost({ ...post, place: e.target.value })} required /></label>
        <label className="field">Type
          <select value={post.type} onChange={(e) => setPost({ ...post, type: e.target.value })}>
            {kinds.filter((item) => item !== 'All').map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="btn-pink" type="submit">Post job</button>
      </form>
    </div>
  )
}

export function BriefsPage() {
  const { user, briefs, addBrief } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ title: '', budget: '', description: '' })
  const [done, setDone] = useState(false)
  const [cat, setCat] = useState('All')
  const [scope, setScope] = useState('All')
  const cats = ['All', 'Logo Design', 'Branding', 'Landing Page', 'Website Design', 'Mobile App', 'UI UX Design', 'Illustration']
  const scopes = ['All', 'Design only', 'Dev required']

  async function submit(event) {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    await addBrief(form)
    setDone(true)
    setForm({ title: '', budget: '', description: '' })
  }

  const visible = briefs.filter((brief) => {
    const category = brief.category || `${brief.title} ${brief.description}`
    const inCat = cat === 'All' || category.toLowerCase().includes(cat.toLowerCase().split(' ')[0])
    const briefScope = brief.scope || 'Design only'
    const inScope = scope === 'All' || briefScope === scope
    return inCat && inScope
  })

  return (
    <div className="page-wrap">
      <p className="muted">New Opportunities Daily</p>
      <div className="hire-hero">
        <h1>Project Briefs</h1>
        <p>Browse open projects from clients hiring top design and development talent on Dribbble.</p>
      </div>
      <div className="brief-stats">
        <div><strong>Last 30 days</strong><span>Updated daily</span></div>
        <div><strong>1,000+</strong><span>Briefs</span></div>
        <div><strong>$2.5M+</strong><span>Project Value</span></div>
      </div>
      <div className="explore-bar">
        {scopes.map((item) => (
          <button key={item} type="button" className={scope === item ? 'is-on' : ''} onClick={() => setScope(item)}>{item}</button>
        ))}
      </div>
      <div className="explore-bar">
        {cats.map((item) => (
          <button key={item} type="button" className={cat === item ? 'is-on' : ''} onClick={() => setCat(item)}>{item}</button>
        ))}
      </div>
      <div className="stack">
        {visible.map((brief) => (
          <article className="list-card" key={brief.id}>
            <div>
              <p className="brief-meta">{brief.category || 'Design'} · {brief.scope || 'Design only'}</p>
              <h3>{brief.title}</h3>
              <p>{brief.name} · {brief.budget}</p>
              <p>{brief.description}</p>
            </div>
            <Link className="btn-dark" to={`/proposals?title=${encodeURIComponent(brief.title)}`}>Send proposal</Link>
          </article>
        ))}
        {visible.length === 0 && <p className="muted">No open briefs in this category yet.</p>}
      </div>
      <h2 className="section-title">Post a brief</h2>
      <form className="dash-form" onSubmit={submit}>
        {done && <p className="muted">Brief posted. Designers can see it above.</p>}
        <label className="field">Project title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label className="field">Budget<input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="$2,000 – $4,000" required /></label>
        <label className="field">What do you need?<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
        <button className="btn-pink" type="submit">Post brief</button>
      </form>
    </div>
  )
}

export function AgenciesPage() {
  const { designs } = useStore()
  const map = new Map()
  designs.forEach((item) => {
    if (!item.author.agency) return
    if (!map.has(item.author.username)) map.set(item.author.username, { ...item.author, shots: [] })
    if (map.get(item.author.username).shots.length < 3) map.get(item.author.username).shots.push(item)
  })
  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Hire A Top Design Agency</h1>
        <p>Studios selected from the work they publish here. Open a profile, then get in touch.</p>
      </div>
      <h2 className="section-title">The Best Design Agencies</h2>
      <section className="designer-grid page-grid">
        {[...map.values()].map((person) => (
          <Link className="designer" to={`/u/${person.username}`} key={person.username}>
            <div className="designer-head">
              <img src={person.avatar} alt="" />
              <div>
                <h3>{person.name} {person.pro && <em className="pro">PRO</em>}</h3>
                <p>{person.location}</p>
                <div className="agency-meta">
                  <span>{person.shots.length} projects</span>
                  <span>From $5,000</span>
                </div>
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

export function BlogPage() {
  return (
    <div className="page-wrap">
      <div className="hire-hero">
        <p className="muted">Courtside</p>
        <h1>The Dribbble Blog</h1>
        <p>Design inspiration, stories, and tips.</p>
      </div>
      <div className="story-grid">
        {posts.map((post, index) => (
          <Link className="story-card" to={`/blog/${post.slug}`} key={post.slug}>
            <img src={designs[index % designs.length].image} alt="" referrerPolicy="no-referrer" />
            <span>Story</span>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BlogPost() {
  const { slug: id } = useParams()
  const post = posts.find((item) => item.slug === id)
  if (!post) return <Page title="Story not found" />
  const image = designs[posts.findIndex((item) => item.slug === id) % designs.length]?.image
  return (
    <Page title={post.title}>
      {image && <img className="story-hero" src={image} alt="" referrerPolicy="no-referrer" />}
      <p className="detail-desc">{post.excerpt} Read it as a working note, then publish a shot or post a brief when you are ready.</p>
      <Link className="btn-dark" to="/blog">All stories</Link>
    </Page>
  )
}

export function PlayoffsPage() {
  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Playoffs</h1>
        <p>A weekly prompt. One idea, finished.</p>
      </div>
      <article className="list-card playoff-card">
        <img src={designs[0].image} alt="" referrerPolicy="no-referrer" />
        <div>
          <h3>This week: a payment moment</h3>
          <p>Design one screen where someone pays, tips, or confirms. Mobile or desktop.</p>
        </div>
        <Link className="btn-pink" to="/upload">Enter</Link>
      </article>
    </div>
  )
}

export function HelpPage() {
  const [open, setOpen] = useState(0)
  return (
    <Page title="Help Center" lead="Short answers for the things people ask first.">
      <div className="stack">
        {faqs.map((item, index) => (
          <button type="button" className="faq" key={item.q} onClick={() => setOpen(open === index ? -1 : index)}>
            <strong>{item.q}</strong>
            {open === index && <p>{item.a}</p>}
          </button>
        ))}
      </div>
    </Page>
  )
}

export function AboutPage() {
  const values = [
    ['Own the work', 'Take the brief seriously, ship a clear result, and stand behind the shots you publish.'],
    ['Help people hire well', 'A short profile and a finished shot do more than a long promise.'],
    ['Finish what you start', 'One complete screen is more useful than a folder of sketches.'],
    ['Stay generous', 'Leave a useful comment. Follow the people whose work you actually use.'],
  ]
  const perks = [
    ['Remote first', 'Designers and clients work from wherever the project is.'],
    ['Open briefs', 'Post a project without a fee and review proposals in one place.'],
    ['A public portfolio', 'Shots stay on your profile so the next client can see the work.'],
    ['Direct messages', 'Get in touch from a shot, a profile, or a service.'],
  ]
  return (
    <div className="page-wrap about-page">
      <section className="about-hero">
        <p className="about-kicker">Discover the world’s top designers.</p>
        <h1>We’re here so designers can earn a living from work they are proud to show.</h1>
        <div className="about-stats">
          <div><strong>2009</strong><span>Founded</span></div>
          <div><strong>100%</strong><span>Remote</span></div>
          <div><strong>{designs.length}</strong><span>Shots in this build</span></div>
        </div>
        <Link className="btn-dark" to="/directories/jobs">Explore careers</Link>
      </section>
      <section className="about-story">
        <h2>Our story</h2>
        <p>This community started as a place to share work in progress. It is now where studios publish shots, clients post briefs, and designers get found from the work itself.</p>
      </section>
      <h2 className="section-title">Our values</h2>
      <div className="feature-grid about-values">
        {values.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </div>
      <h2 className="section-title">The good stuff</h2>
      <div className="feature-grid">
        {perks.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </div>
    </div>
  )
}

export function ProPage() {
  return (
    <div className="page-wrap">
      <section className="pro-banner">
        <h1>Get more leads, win more work</h1>
        <p>A PRO badge, services clients can buy, and outbound proposals that reach people hiring now.</p>
        <Link className="btn-pink" to="/register">Upgrade to Pro</Link>
      </section>
      <div className="price-row">
        <article className="list-card"><div><h3>Free</h3><p>Upload shots, like, comment, and follow designers.</p><strong>$0</strong></div></article>
        <article className="list-card"><div><h3>Pro</h3><p>PRO badge, packaged services, and proposal tools.</p><strong>$8 / month</strong></div><Link className="btn-pink" to="/register">Start Pro</Link></article>
      </div>
    </div>
  )
}

export function AdvertisePage() {
  const { user, addMessage } = useStore()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    addMessage({ type: 'ad', title: 'Advertise', text })
    setSent(true)
    setText('')
  }

  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Advertise with us</h1>
        <p>Put a campaign beside the shot grid so designers and clients see it while they browse.</p>
      </div>
      <h2 className="section-title">What advertisers use it for</h2>
      <div className="feature-grid">
        <article><h3>A product launch</h3><p>Show up next to shots in the category your buyers already open.</p></article>
        <article><h3>A hiring push</h3><p>Point designers at a role on the job board.</p></article>
        <article><h3>A tool for makers</h3><p>Reach people who are mid-project, not just scrolling.</p></article>
      </div>
      <h2 className="section-title">What are you waiting for?</h2>
      <form className="dash-form" onSubmit={submit}>
        {sent && <p className="muted">Request sent. We will reply on your account.</p>}
        <label className="field">What do you want to promote?<textarea value={text} onChange={(e) => setText(e.target.value)} required /></label>
        <button className="btn-dark" type="submit">Send request</button>
      </form>
    </div>
  )
}

const popularTags = [
  ['Illustration', 'illustration'],
  ['UI', 'dashboard'],
  ['Logo', 'logo'],
  ['UX', 'onboarding'],
  ['Graphic Design', 'branding'],
  ['Vector', 'illustration'],
  ['Branding', 'branding'],
  ['Typography', 'typography'],
  ['App', 'mobile app'],
  ['Animation', 'animation'],
  ['Icon', 'logo'],
  ['Website', 'landing page'],
]

const topCities = ['Dhaka', 'London', 'New York City', 'San Francisco', 'Moscow', 'Bangalore', 'Los Angeles', 'Kyiv', 'Berlin', 'Toronto', 'Austin', 'Seoul', 'Lisbon', 'Lagos', 'Warsaw', 'Tokyo', 'Amsterdam', 'Dubai', 'Paris', 'Sydney']
const topCountries = ['United States', 'India', 'Indonesia', 'Bangladesh', 'United Kingdom', 'Germany', 'Canada', 'Brazil', 'France', 'Japan', 'South Korea', 'Poland', 'Portugal', 'Nigeria', 'Netherlands']
const usStates = ['California', 'New York', 'Texas', 'Illinois', 'Washington', 'Massachusetts', 'Florida', 'Colorado', 'Georgia', 'Oregon']
const provinces = ['Alberta', 'British Columbia', 'Manitoba', 'Ontario', 'Quebec']

const resourceGroups = [
  {
    title: 'Agencies',
    items: [
      { title: 'How a studio presents a first proposal', excerpt: 'Lead with the outcome, then the shots that prove you can deliver it.', slug: 'hiring-without-the-noise', image: designs[1].image },
      { title: 'Picking three shots for a pitch', excerpt: 'A short set beats a long gallery when a client is comparing studios.', slug: 'building-a-profile', image: designs[4].image },
    ],
  },
  {
    title: 'Career',
    items: [
      { title: 'Building a profile people trust', excerpt: 'Three strong shots beat twenty unfinished ones.', slug: 'building-a-profile', image: designs[2].image },
      { title: 'What to put in a job application', excerpt: 'Name the role, link two relevant shots, and say when you can start.', slug: 'hiring-without-the-noise', image: designs[6].image },
    ],
  },
  {
    title: 'Freelance',
    items: [
      { title: 'Hiring without the noise', excerpt: 'A short brief gets better proposals than a long wishlist.', slug: 'hiring-without-the-noise', image: designs[7].image },
      { title: 'How to present a shot', excerpt: 'Crop, title, and the first line of your description do most of the work.', slug: 'how-to-present-a-shot', image: designs[0].image },
    ],
  },
  {
    title: 'Tips',
    items: [
      { title: 'What makes a good playoff entry', excerpt: 'Pick one idea and finish it. Judges notice restraint.', slug: 'weekly-playoff', image: designs[10].image },
      { title: 'Titles that get the shot opened', excerpt: 'Say what the screen is, not how hard it was to make.', slug: 'how-to-present-a-shot', image: designs[8].image },
    ],
  },
]

function shotFor(key, index) {
  return designs.find((item) => item.tags.some((tag) => tag.includes(key) || key.includes(tag))) || designs[index % designs.length]
}

export function TagsPage() {
  const names = [...new Map(
    [...popularTags.map(([name]) => name), ...designs.flatMap((item) => item.tags)].map((name) => [name.toLowerCase(), name.toLowerCase()]),
  ).values()]
  const groups = names.reduce((map, name) => {
    const letter = name[0].toUpperCase()
    if (!map[letter]) map[letter] = []
    map[letter].push(name)
    return map
  }, {})
  const letters = Object.keys(groups).sort()

  return (
    <div className="page-wrap tag-page">
      <h1>Popular tags</h1>
      <ol className="tag-grid">
        {popularTags.map(([name, key], index) => {
          const shot = shotFor(key, index)
          return (
            <li key={name}>
              <Link to={`/shots?tag=${encodeURIComponent(key)}`}>
                <img src={shot.image} alt="" />
                <h2>{name}</h2>
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="alpha-index">
        {letters.map((letter) => (
          <section key={letter}>
            <h2>{letter}</h2>
            <div>
              {groups[letter].map((name) => (
                <Link key={name} to={`/shots?tag=${encodeURIComponent(name.toLowerCase())}`}>{name.toLowerCase()}</Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function PlaceGroup({ title, items }) {
  return (
    <section className="place-group">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}><Link to={`/designers?q=${encodeURIComponent(item)}`}>{item}</Link></li>
        ))}
      </ul>
    </section>
  )
}

export function PlacesPage() {
  const extra = [...new Set([...topCities, ...Object.values(places)])]
  return (
    <div className="page-wrap place-page">
      <h1>Places on Dribbble</h1>
      <PlaceGroup title="Top Cities" items={extra} />
      <PlaceGroup title="Top Countries" items={topCountries} />
      <PlaceGroup title="U.S. States" items={usStates} />
      <PlaceGroup title="Canadian Provinces" items={provinces} />
    </div>
  )
}

export function ResourcesPage() {
  const featured = resourceGroups[0].items[0]
  const side = resourceGroups.flatMap((group) => group.items).slice(1, 4)
  return (
    <div className="page-wrap resource-page">
      <h1>Resources</h1>
      <p className="resource-lead">Guides and short notes on presenting work, hiring, and getting hired.</p>
      <div className="resource-feature">
        <Link className="resource-hero" to={`/blog/${featured.slug}`}>
          <img src={featured.image} alt="" />
          <div>
            <span>Agencies</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
          </div>
        </Link>
        <div className="resource-side">
          <h3>Newly published</h3>
          {side.map((item) => (
            <Link key={item.title} to={`/blog/${item.slug}`}>
              <img src={item.image} alt="" />
              <span>
                <strong>{item.title}</strong>
                <small>{item.excerpt}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
      {resourceGroups.map((group) => (
        <section className="resource-block" key={group.title}>
          <div className="resource-block-head">
            <h2>{group.title}</h2>
            <Link to="/blog">View all articles</Link>
          </div>
          <div className="resource-cards">
            {group.items.map((item) => (
              <Link key={item.title} to={`/blog/${item.slug}`}>
                <img src={item.image} alt="" />
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function JobsDirectoryPage() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const countries = ['Germany', 'Canada', 'United States', 'United Kingdom']
  const cities = ['San Francisco', 'Los Angeles', 'London', 'Berlin', 'New York City', 'Boston', 'Toronto', 'Austin', 'Seattle', 'Remote']
  const specialties = ['Motion Graphics Design', 'Brand & Graphic Design', 'Illustration', 'Mobile Design', 'UI & Visual Design', 'Product Design', 'UX Design', 'Web Design']
  return (
    <div className="page-wrap place-page">
      <h1>Directory of Design Jobs On Dribbble</h1>
      <section className="place-group">
        <h2 className="dir-label">Browse by Letter</h2>
        <div className="letter-row">
          {letters.map((letter) => <Link key={letter} to={`/jobs?q=${letter}`}>{letter}</Link>)}
        </div>
      </section>
      <section className="place-group">
        <h2>Design Jobs By Country</h2>
        <ul>
          {countries.map((item) => <li key={item}><Link to={`/jobs?q=${encodeURIComponent(item)}`}>Design jobs in {item}</Link></li>)}
        </ul>
      </section>
      <section className="place-group">
        <h2>Design Jobs By City</h2>
        <ul>
          {cities.map((item) => <li key={item}><Link to={`/jobs?q=${encodeURIComponent(item)}`}>{item === 'Remote' ? 'Remote design jobs' : `Design jobs in ${item}`}</Link></li>)}
        </ul>
      </section>
      <section className="place-group">
        <h2>Design Jobs by Specialty</h2>
        <ul>
          {specialties.map((item) => <li key={item}><Link to={`/jobs?q=${encodeURIComponent(item)}`}>{item} jobs</Link></li>)}
        </ul>
      </section>
    </div>
  )
}

export function HiringPage() {
  const plans = [
    ['Free', 'Post a brief and message designers you want to hire.'],
    ['$150', 'A featured brief so more designers see the project first.'],
    ['$300', 'A featured brief plus a spot on the job board.'],
  ]
  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Find the perfect designer for your business.</h1>
        <p>Post a brief, review proposals, and start the work. Finding and paying talent starts with a clear ask.</p>
        <Link className="btn-pink" to="/briefs">Start a brief</Link>
      </div>
      <div className="price-row hire-plans">
        {plans.map(([price, text]) => (
          <article className="list-card" key={price}>
            <h3>{price}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <h2 className="section-title">Post on the job board for hiring designers.</h2>
      <ol className="steps">
        <li>Post a brief with the outcome, timing, and budget.</li>
        <li>Review profiles, services, and proposals.</li>
        <li>Message the designer and start the work.</li>
      </ol>
    </div>
  )
}

export function ForDesignersPage() {
  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Join the world’s best creative community</h1>
        <p>Where designers learn, share, and get hired. Build a portfolio, then take on paid work.</p>
        <Link className="btn-pink" to="/register">Get started</Link>
      </div>
      <div className="feature-grid">
        <article>
          <h3>Build your portfolio</h3>
          <p>A finished image, a clear title, and a few tags are enough to start.</p>
          <Link className="btn-dark" to="/upload">Upload</Link>
        </article>
        <article>
          <h3>Find work</h3>
          <p>Reply to briefs, list a service, and keep your profile current.</p>
          <Link className="btn-ghost" to="/briefs">Browse briefs</Link>
        </article>
        <article>
          <h3>Go Pro</h3>
          <p>A PRO badge, packaged services, and a clearer path to paid work.</p>
          <Link className="btn-pink" to="/pro">See Pro</Link>
        </article>
      </div>
    </div>
  )
}

const legalNav = [
  ['Terms of Service', '/terms'],
  ['Privacy Policy', '/privacy'],
  ['Cookie Policy', '/cookies'],
  ['Code of Conduct', '/conduct'],
]

function Legal({ title, children }) {
  return (
    <div className="legal-page">
      <nav className="legal-nav">
        {legalNav.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
      </nav>
      <article className="legal-doc">
        <h1>{title}</h1>
        {children}
      </article>
    </div>
  )
}

export function TermsPage() {
  return (
    <Legal title="Our Terms of Service">
      <h2>Accounts</h2>
      <p>You need an account to upload, like, save, comment, or message. Keep your password to yourself. You can delete your own shots from the dashboard.</p>
      <h2>Your work</h2>
      <p>You keep the rights to shots you upload. Posting a shot lets other people view it on your profile and in the public grid.</p>
      <h2>Hiring</h2>
      <p>Briefs and messages are introductions. Payment, contracts, and delivery stay between you and the other person. See the <Link to="/privacy">privacy policy</Link> for what is stored.</p>
      <h2>Acceptable use</h2>
      <p>Do not upload work you do not have the right to share, and do not use the site to spam or harass anyone. The <Link to="/conduct">code of conduct</Link> covers how people treat each other here.</p>
    </Legal>
  )
}

export function PrivacyPage() {
  return (
    <Legal title="Our commitment to protecting your privacy">
      <h2>Account data</h2>
      <p>Your name, username, email, password hash, avatar, bio, and location are stored so you can sign in and show a profile.</p>
      <h2>Activity</h2>
      <p>Shots, likes, saves, comments, follows, briefs, and messages are stored so those features work across pages.</p>
      <h2>Session</h2>
      <p>A token stays in your browser so you remain signed in. Logging out removes it. Details of what the browser keeps are on the <Link to="/cookies">cookie policy</Link>.</p>
    </Legal>
  )
}

export function CookiesPage() {
  return (
    <Legal title="Our cookie policy">
      <h2>Information about what this browser keeps</h2>
      <p>This app uses local storage for the sign-in session. It does not drop a third-party ad cookie.</p>
      <h2>Sign-in token</h2>
      <p>After you log in, a token and a cached profile stay in local storage so the next visit still knows who you are.</p>
      <h2>View counts</h2>
      <p>Shot views you have already opened in this session are remembered so the counter does not jump every time you refresh.</p>
      <h2>Managing your preferences</h2>
      <p>Logging out removes the session. Closing the welcome banner only hides it until you reload the page.</p>
    </Legal>
  )
}

export function ConductPage() {
  return (
    <Legal title="Code of Conduct">
      <h2>Be useful</h2>
      <p>Comments should be about the work. Critique the shot, not the person.</p>
      <h2>Be honest</h2>
      <p>Upload work you have the right to share. Do not present someone else’s shot as your own.</p>
      <h2>No harassment</h2>
      <p>Messages, comments, and briefs are not a place to spam, threaten, or pressure anyone. Report a problem from <Link to="/contact">support</Link>.</p>
    </Legal>
  )
}

export function ProposalsPage() {
  const { user, addMessage } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ title: params.get('title') || '', text: '' })
  const [sent, setSent] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    addMessage({ type: 'proposal', title: form.title, text: form.text })
    setSent(true)
    setForm({ title: '', text: '' })
  }

  return (
    <Page title="Send a proposal" lead="Reach a client who has not posted a brief yet.">
      <form className="dash-form" onSubmit={submit}>
        {sent && <p className="muted">Proposal sent. It shows in your dashboard messages.</p>}
        <label className="field">Project
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label className="field">Proposal
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} required />
        </label>
        <button className="btn-dark" type="submit">Send proposal</button>
      </form>
    </Page>
  )
}

export function ContactPage() {
  const { user, addMessage } = useStore()
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    addMessage({ type: 'support', title: 'Support', text })
    setSent(true)
    setText('')
  }

  const topics = [
    ['Uploading a shot', '/help'],
    ['Hiring a designer', '/hiring'],
    ['Getting hired', '/for-designers'],
    ['Account settings', '/settings'],
  ]

  return (
    <div className="page-wrap">
      <div className="market-hero">
        <h1>Support</h1>
        <p>Questions about shots, hiring, or your account. Short answers live in the help center. Everything else can come through this form.</p>
      </div>
      <div className="feature-grid">
        {topics.map(([label, to]) => (
          <Link className="list-card" to={to} key={label}><h3>{label}</h3><p>Open this topic</p></Link>
        ))}
      </div>
      <h2 className="section-title">Send a message</h2>
      <form className="dash-form" onSubmit={submit}>
        {sent && <p className="muted">Message sent. You can read the thread from your messages.</p>}
        <label className="field">How can we help?<textarea value={text} onChange={(e) => setText(e.target.value)} required /></label>
        <button className="btn-dark" type="submit">Send</button>
      </form>
    </div>
  )
}
