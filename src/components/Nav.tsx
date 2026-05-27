import React from 'react'

export default function Nav() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <div className="nav__inner container">
        <a href="#hero" className="nav__logo" onClick={(e) => handleScroll(e, 'hero')}>
          Prahalad Reddy
        </a>
        <div className="nav__links">
          <a href="#projects"    className="nav__link" onClick={(e) => handleScroll(e, 'projects')}>Projects</a>
          <a href="#experience"  className="nav__link" onClick={(e) => handleScroll(e, 'experience')}>Experience</a>
          <a href="#about"       className="nav__link" onClick={(e) => handleScroll(e, 'about')}>About</a>
          <a href="#connect"     className="nav__link nav__link--cta" onClick={(e) => handleScroll(e, 'connect')}>Connect</a>
        </div>
      </div>
    </nav>
  )
}
