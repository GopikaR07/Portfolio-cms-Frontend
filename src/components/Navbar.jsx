import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="portfolio-navbar">
      <a
        href="#"
        className="navbar-logo"
        onClick={closeMenu}
      >
        Gopika R.
      </a>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <div
        className={`navbar-links ${
          menuOpen ? "navbar-links-open" : ""
        }`}
      >
        <a href="#" onClick={closeMenu}>
          Home
        </a>

        <a href="#about" onClick={closeMenu}>
          About
        </a>

        <a href="#skills" onClick={closeMenu}>
          Skills
        </a>

        <a href="#projects" onClick={closeMenu}>
          Projects
        </a>

        <a href="#experience" onClick={closeMenu}>
          Experience
        </a>

        <a href="#blog" onClick={closeMenu}>
          Blog
        </a>

        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </div>
    </nav>
  );
}

export default Navbar;