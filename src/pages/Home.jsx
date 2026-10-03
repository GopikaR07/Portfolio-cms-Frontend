import { useEffect, useState } from "react";
import { ArrowDown, Mail } from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../lib/api/api";
import SkillsSection from "../components/SkillsSection";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import BlogSection from "../components/BlogSection";
import ContactSection from "../components/ContactSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ServicesSection from "../components/ServicesSection";


function Home() {
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

            <h2>
              Computer Science Engineer & ML Enthusiast
            </h2>

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
              <a href="#" aria-label="GitHub">
                <span>GH</span>
              </a>

              <a href="#" aria-label="LinkedIn">
                <span>in</span>
              </a>

              <a
                href="#contact"
                aria-label="Email"
              >
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <span>AI</span>
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
    </>
  );
}

export default Home;