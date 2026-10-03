function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="footer-content">
        <div>
          <h3>Gopika R.</h3>
          <p>
            Building intelligent solutions with
            curiosity and code.
          </p>
        </div>

        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Gopika R.
          All rights reserved.
        </p>

        <a href="/admin/login">
          Admin
        </a>
      </div>
    </footer>
  );
}

export default Footer;