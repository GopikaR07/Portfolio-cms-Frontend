import { useEffect, useState } from "react";
import api from "../lib/api/api";

function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error(
        "Failed to fetch projects:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="projects"
      className="portfolio-section projects-section"
    >
      <p className="section-label">
        03 — PROJECTS
      </p>

      <h2>Things I've built.</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects added yet.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <article
              className="project-card"
              key={project.id}
            >
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="project-image"
                />
              )}

              <div className="project-content">
                <h3>{project.title}</h3>

                <p>{project.description}</p>

                {project.technologies && (
                  <div className="project-technologies">
                    {String(project.technologies)
                      .split(",")
                      .map((technology, index) => (
                        <span key={index}>
                          {technology.trim()}
                        </span>
                      ))}
                  </div>
                )}

                <div className="project-links">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}

                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;