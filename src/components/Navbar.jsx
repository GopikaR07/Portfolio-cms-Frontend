import { useEffect, useState } from "react";

const links = [
  ["Home", ""], ["About", "about"], ["Skills", "skills"], ["Projects", "projects"],
  ["Experience", "experience"], ["Blog", "blog"], ["Contact", "contact"],
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(window.scrollY > 40);
      setProgress((window.scrollY / (h.scrollHeight - h.clientHeight || 1)) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach(([, id]) => id && document.getElementById(id) && io.observe(document.getElementById(id)));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <nav className={`portfolio-navbar ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-progress" style={{ width: `${progress}%` }} />
      <a href="#" className="navbar-logo" onClick={close}>Gopika R.</a>
      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? "✕" : "☰"}
      </button>
      <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
        {links.map(([name, id]) => (
          <a key={name} href={`#${id}`} onClick={close} className={active === id ? "nav-active" : ""}>
            {name}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;