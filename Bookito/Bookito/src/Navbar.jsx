
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <p> testing if this works </p>
        <a href="/">MyApp</a>
      </div>
      <ul className="navbar__links">
        <li className="navbar__item">
          <a href="/" className="navbar__link">Books</a>
          <a href="/" className="navbar__link">AudioBooks</a>
        </li>
      </ul>
    </nav>
  )
}
