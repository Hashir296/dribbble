import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthFrame from '../components/AuthFrame'
import { useStore } from '../store'

export default function Login() {
  const { user, login } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to={location.state?.from || '/'} replace />

  async function submit(event) {
    event.preventDefault()
    const message = await login(email, password)
    if (message) setError(message)
    else navigate(location.state?.from || '/')
  }

  return (
    <AuthFrame>
      <h1>Welcome back</h1>
      <p className="lead">Sign in to pick up your shots, messages, and profile.</p>
      <form onSubmit={submit}>
        {error && <p className="form-error">{error}</p>}
        <label className="field">Email address
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter email address" required />
        </label>
        <label className="field">Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
        </label>
        <button className="btn-dark btn-block" type="submit">Sign in</button>
      </form>
      <p className="auth-switch">New to Dribbble? <Link to="/register">Sign up</Link></p>
      <p className="auth-switch">Demo: amina-shah@pintra.test / pintra123</p>
    </AuthFrame>
  )
}
