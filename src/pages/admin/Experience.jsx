import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Experience() {
  const emptyForm = {
    company: "",
    role: "",
    description: "",
    start_date: "",
    end_date: "",
    is_current: false,
  };

  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await api.get("/experience");

      setExperiences(response.data.experience || []);
    } catch (error) {
      console.error("Failed to fetch experience:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load experience."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const data = {
        company: form.company,
        role: form.role,
        description: form.description,
        start_date: form.start_date || null,
        end_date: form.is_current
          ? null
          : form.end_date || null,
        is_current: form.is_current,
      };

      if (editingId) {
        await api.put(`/experience/${editingId}`, data);

        setMessage("Experience updated successfully.");
      } else {
        await api.post("/experience", data);

        setMessage("Experience added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchExperience();
    } catch (error) {
      console.error("Failed to save experience:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save experience."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setForm({
      company: experience.company || "",
      role: experience.role || "",
      description: experience.description || "",
      start_date: experience.start_date
        ? experience.start_date.substring(0, 10)
        : "",
      end_date: experience.end_date
        ? experience.end_date.substring(0, 10)
        : "",
      is_current: Boolean(experience.is_current),
    });

    setEditingId(experience.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/experience/${id}`);

      setMessage("Experience deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchExperience();
    } catch (error) {
      console.error("Failed to delete experience:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete experience."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading experience...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Experience</h2>

        <p>
          Manage your work, internship and research experience.
        </p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="dashboard-card">
        <h3>
          {editingId
            ? "Edit Experience"
            : "Add Experience"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company / Organization</label>

            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. IIITDM Kurnool"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="e.g. Research Intern"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your work..."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>

            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>

            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              disabled={form.is_current}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="is_current"
              name="is_current"
              checked={form.is_current}
              onChange={handleChange}
            />

            <label htmlFor="is_current">
              I currently work here
            </label>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Experience"
                : "Add Experience"}
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

      <div className="dashboard-card experience-list-card">
        <h3>Existing Experience</h3>

        {experiences.length === 0 ? (
          <p>No experience added yet.</p>
        ) : (
          <div className="experience-list">
            {experiences.map((experience) => (
              <div
                className="experience-admin-card"
                key={experience.id}
              >
                <div>
                  <h3>{experience.role}</h3>

                  <h4>{experience.company}</h4>

                  <p>
                    {experience.description}
                  </p>

                  <small>
                    {experience.start_date
                      ? experience.start_date.substring(0, 10)
                      : "No start date"}{" "}
                    —{" "}
                    {experience.is_current
                      ? "Present"
                      : experience.end_date
                      ? experience.end_date.substring(0, 10)
                      : "No end date"}
                  </small>
                </div>

                <div className="table-actions">
                  <button
                    onClick={() =>
                      handleEdit(experience)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(experience.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Experience;