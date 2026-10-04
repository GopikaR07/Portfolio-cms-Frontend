import { useEffect, useState } from "react";
import { ArrowDown, Mail } from "lucide-react";

import useScrollFX from "../hooks/useScrollFX";
import Navbar from "../components/Navbar";
import api from "../lib/api/api";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ServicesSection from "../components/ServicesSection";

import Footer from "../components/Footer";




function Typewriter({ words }) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i];
    const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1400 : del ? 35 : 75);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return <>{words[i].slice(0, n)}<span className="type-cursor" /></>;
}

function Home() {
  useScrollFX();
  const [about, setAbout] = useState(null);
  const [aboutLoading, setAboutLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await api.get("/about");
      setAbout(response.data.about);
    } catch (error) {
      console.error("Failed to fetch about data:", error);
    } finally {
      setAboutLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="portfolio-home">
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-greeting">
              Hello, I'm
            </p>

            <h1>Gopika R.</h1>

            <h2><Typewriter words={["Computer Science Engineer", "ML Enthusiast", "Computer Vision Explorer", "Problem Solver"]} /></h2>

            <p className="hero-description">
              I build intelligent software solutions,
              explore machine learning, and develop
              practical systems that solve real-world
              problems.
            </p>

            <div className="hero-buttons">
              <a
                href="#projects"
                className="primary-button"
              >
                View My Work
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                Contact Me
              </a>
            </div>

            <div className="hero-socials">
  <a
    href="https://github.com/GopikaR07"
    target="_blank"
    rel="noreferrer"
  >
    GitHub
  </a>

  <a
    href="https://www.linkedin.com/in/gopika-r-3a6758325"
    target="_blank"
    rel="noreferrer"
  >
    in
  </a>

  <a href="mailto:gopikasg07@gmail.com">
    <Mail size={18} />
  </a>
</div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <span className="hero-initials">GR</span>
              <img src="/profile.jpg" alt="Gopika R." className="hero-profile-image" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          </div>

          <a
            href="#about"
            className="scroll-indicator"
            aria-label="Scroll to About"
          >
            <ArrowDown size={20} />
          </a>
        </section>

        <section
          id="about"
          className="portfolio-section"
        >
          <p className="section-label">
            01 — ABOUT
          </p>

          {aboutLoading ? (
            <p>Loading...</p>
          ) : about ? (
            <>
              <h2>
                {about.title || "About Me"}
              </h2>

              <p>
                {about.description ||
                  "Welcome to my portfolio."}
              </p>
            </>
          ) : (
            <>
              <h2>About Me</h2>

              <p>
                I'm a Computer Science Engineering
                student interested in machine learning,
                software development and cloud
                technologies.
              </p>
            </>
          )}
        </section>

        <SkillsSection />

        <ProjectsSection />

        <ExperienceSection />

        <BlogSection />

        <TestimonialsSection />

        <ServicesSection />


        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default Home;