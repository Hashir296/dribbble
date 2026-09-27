import { Link } from 'react-router-dom'
import Logo from './Logo'

const sideShot = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=1400&q=70'

export default function AuthFrame({ children }) {
  return (
    <div className="auth-layout">
      <section className="auth-main">
        <Link to="/" className="logo" aria-label="Dribbble"><Logo width={89} height={25} /></Link>
        <div className="auth-card">{children}</div>
      </section>
      <aside className="auth-side">
        <img src={sideShot} alt="" referrerPolicy="no-referrer" />
        <Link to="/u/framewell">@framewell</Link>
      </aside>
    </div>
  )
}
