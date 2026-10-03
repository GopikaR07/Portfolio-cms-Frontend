import { useEffect, useState } from "react";
import api from "../lib/api/api";

function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await api.get("/experience");
      setExperiences(response.data.experience || []);
    } catch (error) {
      console.error(
        "Failed to fetch experience:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="experience"
      className="portfolio-section experience-section"
    >
      <p className="section-label">
        04 — EXPERIENCE
      </p>

      <h2>Where I've worked.</h2>

      {loading ? (
        <p>Loading experience...</p>
      ) : experiences.length === 0 ? (
        <p>No experience added yet.</p>
      ) : (
        <div className="experience-timeline">
          {experiences.map((experience) => (
            <article
              className="experience-card"
              key={experience.id}
            >
              <div className="experience-date">
                <span>
                  {experience.start_date
                    ? new Date(
                        experience.start_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>

                <span>—</span>

                <span>
                  {experience.is_current
                    ? "Present"
                    : experience.end_date
                    ? new Date(
                        experience.end_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>

              <div className="experience-content">
                <h3>{experience.role}</h3>

                <h4>{experience.company}</h4>

                {experience.description && (
                  <p>{experience.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExperienceSection;