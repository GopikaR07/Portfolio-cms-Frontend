import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Testimonials() {
  const emptyForm = {
    name: "",
    role: "",
    company: "",
    message: "",
    image_url: "",
  };

  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");

      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load testimonials."
      );
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
        await api.put(`/testimonials/${editingId}`, form);

        setMessage("Testimonial updated successfully.");
      } else {
        await api.post("/testimonials", form);

        setMessage("Testimonial added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchTestimonials();
    } catch (error) {
      console.error("Failed to save testimonial:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save testimonial."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company: testimonial.company || "",
      message: testimonial.message || "",
      image_url: testimonial.image_url || "",
    });

    setEditingId(testimonial.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/testimonials/${id}`);

      setMessage("Testimonial deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchTestimonials();
    } catch (error) {
      console.error(
        "Failed to delete testimonial:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to delete testimonial."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading testimonials...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Testimonials</h2>

        <p>
          Manage testimonials displayed on your portfolio.
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
            ? "Edit Testimonial"
            : "Add Testimonial"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
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
              placeholder="e.g. Project Manager"
            />
          </div>

          <div className="form-group">
            <label>Company</label>

            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. ABC Technologies"
            />
          </div>

          <div className="form-group">
            <label>Testimonial</label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What did they say about you?"
              rows="5"
              required
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

          <div className="form-actions">
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Testimonial"
                : "Add Testimonial"}
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

      <div className="dashboard-card testimonials-list-card">
        <h3>Existing Testimonials</h3>

        {testimonials.length === 0 ? (
          <p>No testimonials added yet.</p>
        ) : (
          <div className="testimonials-list">
            {testimonials.map((testimonial) => (
              <div
                className="testimonial-admin-card"
                key={testimonial.id}
              >
                {testimonial.image_url && (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="testimonial-admin-image"
                  />
                )}

                <div className="testimonial-admin-info">
                  <h3>{testimonial.name}</h3>

                  <p className="testimonial-role">
                    {testimonial.role || "—"}
                    {testimonial.company
                      ? ` · ${testimonial.company}`
                      : ""}
                  </p>

                  <p>
                    "{testimonial.message}"
                  </p>

                  <div className="table-actions">
                    <button
                      onClick={() =>
                        handleEdit(testimonial)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(testimonial.id)
                      }
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

export default Testimonials;