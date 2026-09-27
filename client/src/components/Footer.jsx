import { Link } from 'react-router-dom'
import { designs } from '../data/sample'
import Logo from './Logo'

const tiles = [
  { name: 'Illustration', c1: '#E6FBFE', c2: '#EDF3D8' },
  { name: 'Print', c1: '#E6FBFE', c2: '#DDFDE8' },
  { name: 'Typography', c1: '#DDFDE8', c2: '#EDF3D8' },
  { name: 'Product Design', c1: '#EDDDFB', c2: '#DDFDE8' },
  { name: 'Web Design', c1: '#EDF3D8', c2: '#EDDDFB' },
  { name: 'Branding', c1: '#E6FDC9', c2: '#EDF3D8' },
  { name: 'Mobile', c1: '#E3EBFD', c2: '#EDF3D8' },
  { name: 'Animation', c1: '#F6D9FB', c2: '#E3EBFD' },
]

const links = [
  ['For designers', '/for-designers'],
  ['Hire talent', '/hiring'],
  ['Inspiration', '/shots'],
  ['Advertising', '/advertise'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['Support', '/contact'],
]

const leftLegal = [
  ['Terms', '/terms'],
  ['Privacy', '/privacy'],
  ['Cookies', '/cookies'],
]

const rightLegal = [
  ['Jobs', '/directories/jobs'],
  ['Tags', '/tags'],
  ['Places', '/places'],
  ['Resources', '/resources'],
]

export default function Footer() {
  const row = [...tiles, ...tiles]
  return (
    <footer className="footer">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {row.map((tile, i) => (
            <Link className="tile" to={`/shots?cat=${encodeURIComponent(tile.name)}`} key={tile.name + i} style={{ '--c1': tile.c1, '--c2': tile.c2 }}>
              <span className="tile-stack" />
              <span className="tile-media"><img src={designs[i % designs.length].image} alt="" /></span>
              <span className="tile-title">{tile.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-inner">
        <div className="footer-upper">
          <Link className="footer-logo" to="/" aria-label="Back to home page">
            <Logo width={76} height={30} />
          </Link>
          <ul className="footer-links">
            {links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}
          </ul>
          <div className="footer-social">
            <a href="https://x.com/dribbble" target="_blank" rel="noreferrer" aria-label="X"><XIcon /></a>
            <a href="https://facebook.com/dribbble" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://instagram.com/dribbble" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://pinterest.com/dribbble" target="_blank" rel="noreferrer" aria-label="Pinterest"><PinterestIcon /></a>
          </div>
        </div>
        <div className="footer-lower">
          <ul>
            <li>© {new Date().getFullYear()} Dribbble</li>
            {leftLegal.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}
          </ul>
          <ul>
            {rightLegal.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M9.3 7.1 14.4 1.5h-1.2L8.8 6.3 5.2 1.5H1.4l5.4 7.8L1.4 14.5h1.2l4.7-5.4 3.8 5.4h3.8L9.3 7.1Zm-1.6 1.9-.5-.8L3 2.4h1.8l3.5 5 .5.8 4.6 6.5H11.6L7.7 9Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M9.5 14.5V8.9h1.9l.3-2.2H9.5V5.3c0-.6.2-1.1 1.1-1.1h1.2V2.2c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.5H4.8v2.2h2.2v5.6h2.5Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 4.6A3.4 3.4 0 1 0 8 11.4 3.4 3.4 0 0 0 8 4.6Zm0 5.6A2.2 2.2 0 1 1 8 5.8a2.2 2.2 0 0 1 0 4.4ZM11.8 4.5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6ZM14.2 5c0-.8-.2-1.5-.5-2.1a3 3 0 0 0-1.6-1.6C11.5 1 10.8.8 8 .8S4.5 1 3.9 1.3A3 3 0 0 0 2.3 2.9C2 3.5 1.8 4.2 1.8 5c0 1.2 0 1.5 0 3s0 1.8.5 2.4a3 3 0 0 0 1.6 1.6c.6.3 1.3.5 2.1.5h6c.8 0 1.5-.2 2.1-.5a3 3 0 0 0 1.6-1.6c.3-.6.5-1.3.5-2.1V5Zm-1.2 5.9c-.2.5-.5.8-1 1-.4.2-1 .3-2.9.3H6.9c-1.9 0-2.5-.1-2.9-.3a1.8 1.8 0 0 1-1-1c-.2-.4-.3-1-.3-2.9V5.1c0-1.9.1-2.5.3-2.9.2-.5.5-.8 1-1 .4-.2 1-.3 2.9-.3h4.2c1.9 0 2.5.1 2.9.3.5.2.8.5 1 1 .2.4.3 1 .3 2.9v3.8c0 1.9-.1 2.5-.3 2.9Z" />
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 1.2A6.8 6.8 0 0 0 5.4 14c-.1-.5-.2-1.3 0-1.9.2-.6 1.2-5.1 1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2.1-1.4-3.6-4-3.6-2.9 0-4.7 2.2-4.7 4.6 0 .8.2 1.4.6 1.8.2.2.2.3.1.5l-.2.9c-.1.2-.2.3-.4.2-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.3-5.9 6.8-5.9 3.6 0 6 2.6 6 5.4 0 3.7-2 6.4-5 6.4-1 0-1.9-.5-2.3-1.1l-.6 2.4c-.2.8-.7 1.7-1.1 2.3A6.8 6.8 0 1 0 8 1.2Z" />
    </svg>
  )
}
