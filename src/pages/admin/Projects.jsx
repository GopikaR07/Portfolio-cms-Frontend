import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Projects() {
  const emptyForm = {
    title: "",
    description: "",
    image_url: "",
    technologies: "",
    github_url: "",
    live_url: "",
  };

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setMessage("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        setMessage("Project updated successfully.");
      } else {
        await api.post("/projects", form);
        setMessage("Project added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchProjects();
    } catch (error) {
      console.error("Failed to save project:", error);

      setMessage(
        error.response?.data?.message || "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      image_url: project.image_url || "",
      technologies: project.technologies || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
    });

    setEditingId(project.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      setMessage("Project deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);

      setMessage(
        error.response?.data?.message || "Failed to delete project."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Projects</h2>
        <p>Manage the projects displayed on your portfolio.</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <div className="dashboard-card">
        <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. AI Railway Surveillance"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project..."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Technologies</label>
            <input
              type="text"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          <div className="form-group">
            <label>GitHub URL</label>
            <input
              type="text"
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label>Live Project URL</label>
            <input
              type="text"
              name="live_url"
              value={form.live_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Project"
                : "Add Project"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="dashboard-card projects-list-card">
        <h3>Existing Projects</h3>

        {projects.length === 0 ? (
          <p>No projects added yet.</p>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div className="project-admin-card" key={project.id}>
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="project-admin-image"
                  />
                )}

                <div className="project-admin-info">
                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <small>
                    Technologies: {project.technologies || "-"}
                  </small>

                  <div className="table-actions">
                    <button onClick={() => handleEdit(project)}>
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;