import { createContext, useContext, useEffect, useState } from 'react'
import { jobs as sampleJobs, openBriefs, services as sampleServices } from './data/sample'
import { api } from './services/api'

const TOKEN = 'pintra-token'
const USER = 'pintra-user'
const StoreContext = createContext(null)

function tone(person) {
  if (!person?.avatar || !person.avatar.includes('background=0D0C22')) return person
  return { ...person, avatar: person.avatar.replace('background=0D0C22', 'background=1AA05A') }
}

function readUser() {
  try {
    const raw = localStorage.getItem(USER)
    return raw ? tone(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function StoreProvider({ children }) {
  const [designs, setDesigns] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [briefs, setBriefs] = useState([])
  const [services, setServices] = useState([])
  const [jobs, setJobs] = useState([])
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(readUser)
  const [ready, setReady] = useState(false)

  function saveSession(payload) {
    localStorage.setItem(TOKEN, payload.token)
    const next = tone(payload.user)
    localStorage.setItem(USER, JSON.stringify(next))
    setUser(next)
  }

  useEffect(() => {
    let stop = false
    async function boot() {
      const loads = [
        api('/api/designs').then((rows) => { if (!stop) setDesigns(rows) }).catch(() => {}),
        api('/api/comments').then((rows) => { if (!stop) setComments(rows) }).catch(() => {}),
        api('/api/users').then((rows) => { if (!stop) setUsers(rows.map(tone)) }).catch(() => {}),
        api('/api/briefs').then((rows) => { if (!stop) setBriefs(rows.length ? rows : openBriefs) }).catch(() => { if (!stop) setBriefs(openBriefs) }),
        api('/api/services').then((rows) => { if (!stop) setServices(rows.length ? rows : sampleServices) }).catch(() => { if (!stop) setServices(sampleServices) }),
        api('/api/jobs').then((rows) => { if (!stop) setJobs(rows.length ? rows : sampleJobs) }).catch(() => { if (!stop) setJobs(sampleJobs) }),
      ]
      if (localStorage.getItem(TOKEN)) {
        loads.push((async () => {
          try {
            const me = tone(await api('/api/auth/me'))
            if (stop) return
            localStorage.setItem(USER, JSON.stringify(me))
            setUser(me)
            const mine = await api('/api/messages').catch(() => [])
            if (!stop) setMessages(mine)
          } catch (error) {
            if (stop) return
            if (/sign in/i.test(error.message || '')) {
              localStorage.removeItem(TOKEN)
              localStorage.removeItem(USER)
              setUser(null)
            }
          }
        })())
      }
      await Promise.all(loads)
      if (!stop) setReady(true)
    }
    boot()
    return () => { stop = true }
  }, [])

  function replaceDesign(next) {
    setDesigns((rows) => rows.map((item) => (item.id === next.id ? next : item)))
  }

  async function register(form) {
    try {
      const payload = await api('/api/auth/register', { method: 'POST', body: form })
      saveSession(payload)
      setUsers((rows) => [...rows, payload.user])
      return ''
    } catch (error) {
      return error.message
    }
  }

  async function login(email, password) {
    try {
      const payload = await api('/api/auth/login', { method: 'POST', body: { email, password } })
      saveSession(payload)
      setMessages(await api('/api/messages').catch(() => []))
      return ''
    } catch (error) {
      return error.message
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(USER)
    setUser(null)
    setMessages([])
  }

  async function updateProfile(fields) {
    if (!user) return
    const next = tone(await api(`/api/users/${user.id}`, { method: 'PUT', body: fields }))
    setUser(next)
    setUsers((rows) => rows.map((item) => (item.id === next.id ? next : item)))
    setDesigns((rows) => rows.map((item) => (
      item.author?.id === next.id ? { ...item, author: { ...item.author, ...fields } } : item
    )))
  }

  async function toggleLike(id) {
    if (!user) return false
    replaceDesign(await api(`/api/designs/${id}/like`, { method: 'POST' }))
    return true
  }

  async function toggleSave(id) {
    if (!user) return false
    replaceDesign(await api(`/api/designs/${id}/save`, { method: 'POST' }))
    return true
  }

  async function addComment(designId, text) {
    if (!user || !text.trim()) return
    const comment = await api(`/api/designs/${designId}/comments`, { method: 'POST', body: { text } })
    setComments((rows) => [...rows, comment])
  }

  async function addDesign(input) {
    const design = await api('/api/designs', { method: 'POST', body: input })
    setDesigns((rows) => [design, ...rows])
    return design.id
  }

  async function updateDesign(id, input) {
    const design = await api(`/api/designs/${id}`, { method: 'PUT', body: input })
    replaceDesign(design)
  }

  async function deleteDesign(id) {
    await api(`/api/designs/${id}`, { method: 'DELETE' })
    setDesigns((rows) => rows.filter((item) => item.id !== id))
    setComments((rows) => rows.filter((item) => item.designId !== id))
  }

  async function toggleFollow(username) {
    if (!user || user.username === username) return false
    const next = tone(await api('/api/users/follow', { method: 'POST', body: { username } }))
    setUser(next)
    setUsers((rows) => rows.map((item) => (item.id === next.id ? next : item)))
    return true
  }

  async function bumpView(id) {
    const seen = new Set(JSON.parse(sessionStorage.getItem('pintra-seen') || '[]'))
    if (seen.has(id)) return
    seen.add(id)
    sessionStorage.setItem('pintra-seen', JSON.stringify([...seen]))
    replaceDesign(await api(`/api/designs/${id}/view`, { method: 'POST' }))
  }

  async function addMessage(entry) {
    if (!user) return false
    const message = await api('/api/messages', { method: 'POST', body: entry })
    setMessages((rows) => [message, ...rows])
    return true
  }

  async function addBrief(input) {
    if (!user) return null
    const brief = await api('/api/briefs', { method: 'POST', body: input })
    setBriefs((rows) => [brief, ...rows])
    return brief.id
  }

  async function addService(input) {
    if (!user) return null
    const service = await api('/api/services', { method: 'POST', body: input })
    setServices((rows) => [service, ...rows])
    return service.id
  }

  async function addJob(input) {
    if (!user) return null
    const job = await api('/api/jobs', { method: 'POST', body: input })
    setJobs((rows) => [job, ...rows])
    return job.id
  }

  return (
    <StoreContext.Provider value={{
      user, designs, comments, users, briefs, services, jobs, messages, ready,
      register, login, logout, updateProfile, toggleLike, toggleSave,
      addComment, addDesign, updateDesign, deleteDesign, toggleFollow,
      bumpView, addMessage, addBrief, addService, addJob,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
