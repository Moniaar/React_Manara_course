// Navbar: contains linls to different pages

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <p> testing if this works </p>
        <a href="/">MyApp</a>
      </div>
      <ul className="navbar__links">
        <li className="navbar__item">
          <a href="https://github.com/Moniaar" className="navbar__link">Github</a>
          <a href="/" className="navbar__link">Projects</a>
          <a href="/" className="navbar__link">Education</a>
        </li>
      </ul>
    </nav>
  )
}
