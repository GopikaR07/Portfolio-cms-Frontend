import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Skills() {
  const emptyForm = {
    name: "",
    category: "",
    proficiency: "",
    icon_url: "",
  };

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get("/skills");
      setSkills(response.data.skills || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      setMessage("Failed to load skills.");
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
        await api.put(`/skills/${editingId}`, form);
        setMessage("Skill updated successfully.");
      } else {
        await api.post("/skills", form);
        setMessage("Skill added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchSkills();
    } catch (error) {
      console.error("Failed to save skill:", error);

      setMessage(
        error.response?.data?.message || "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setForm({
      name: skill.name || "",
      category: skill.category || "",
      proficiency: skill.proficiency ?? "",
      icon_url: skill.icon_url || "",
    });

    setEditingId(skill.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/skills/${id}`);

      setMessage("Skill deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setMessage(
        error.response?.data?.message || "Failed to delete skill."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading skills...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Skills</h2>
        <p>Add, edit and remove the skills displayed on your portfolio.</p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="dashboard-card">
        <h3>{editingId ? "Edit Skill" : "Add New Skill"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Skill Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. React"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Frontend"
            />
          </div>

          <div className="form-group">
            <label>Proficiency</label>

            <input
              type="number"
              name="proficiency"
              value={form.proficiency}
              onChange={handleChange}
              placeholder="e.g. 90"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Icon URL</label>

            <input
              type="text"
              name="icon_url"
              value={form.icon_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Skill"
                : "Add Skill"}
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

      <div className="dashboard-card skills-list-card">
        <h3>Existing Skills</h3>

        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="skills-table">
            <div className="skills-table-header">
              <span>Name</span>
              <span>Category</span>
              <span>Proficiency</span>
              <span>Actions</span>
            </div>

            {skills.map((skill) => (
              <div className="skills-table-row" key={skill.id}>
                <span>{skill.name}</span>

                <span>{skill.category || "-"}</span>

                <span>
                  {skill.proficiency !== null &&
                  skill.proficiency !== undefined
                    ? `${skill.proficiency}%`
                    : "-"}
                </span>

                <span className="table-actions">
                  <button onClick={() => handleEdit(skill)}>
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(skill.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Skills;