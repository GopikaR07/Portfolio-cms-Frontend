import { useEffect, useState } from "react";
import api from "../lib/api/api";

function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="skills"
      className="portfolio-section skills-section"
    >
      <p className="section-label">02 — SKILLS</p>

      <h2>What I work with.</h2>

      {loading ? (
        <p>Loading skills...</p>
      ) : skills.length === 0 ? (
        <p>No skills added yet.</p>
      ) : (
        <div className="skills-grid">
          {skills.map((skill) => (
            <div
              className="skill-card"
              key={skill.id}
            >
              <div className="skill-card-header">
                <h3>{skill.name}</h3>

                {skill.category && (
                  <span>{skill.category}</span>
                )}
              </div>

              {skill.proficiency && (
                <div className="skill-proficiency">
                  <div className="skill-proficiency-bar">
                    <div
                      className="skill-proficiency-fill"
                      style={{
                        width: `${Math.min(
                          Number(skill.proficiency),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <small>
                    {skill.proficiency}%
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SkillsSection;