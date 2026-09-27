import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthFrame from '../components/AuthFrame'
import { useStore } from '../store'

export default function Register() {
  const { user, register } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState('email')
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [startedIn] = useState(!!user)

  if (startedIn) return <Navigate to="/" replace />

  function set(key) {
    return (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  function continueEmail(event) {
    event.preventDefault()
    setError('')
    setStep('details')
  }

  async function submit(event) {
    event.preventDefault()
    const message = await register(form)
    if (message) setError(message)
    else navigate('/dashboard')
  }

  return (
    <AuthFrame>
      <h1>Welcome to Dribbble</h1>
      <p className="lead">Create your account and discover world-class design talent.</p>
      {step === 'email' ? (
        <form onSubmit={continueEmail}>
          <label className="field">Email address
            <input type="email" value={form.email} onChange={set('email')} placeholder="Enter email address" required />
          </label>
          <button className="btn-dark btn-block" type="submit">Continue</button>
        </form>
      ) : (
        <form onSubmit={submit}>
          {error && <p className="form-error">{error}</p>}
          <label className="field">Name
            <input value={form.name} onChange={set('name')} required />
          </label>
          <label className="field">Username
            <input value={form.username} onChange={set('username')} required />
          </label>
          <label className="field">Password
            <input type="password" value={form.password} onChange={set('password')} placeholder="At least 4 characters" required />
          </label>
          <button className="btn-dark btn-block" type="submit">Create account</button>
        </form>
      )}
      <p className="auth-fine">By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthFrame>
  )
}
