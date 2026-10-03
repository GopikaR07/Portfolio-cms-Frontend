import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Services() {
  const emptyForm = {
    title: "",
    description: "",
    icon: "",
  };

  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setMessage(
        error.response?.data?.message ||
          "Failed to load services."
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
        await api.put(`/services/${editingId}`, form);
        setMessage("Service updated successfully.");
      } else {
        await api.post("/services", form);
        setMessage("Service added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchServices();
    } catch (error) {
      console.error("Failed to save service:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
    });

    setEditingId(service.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/services/${id}`);

      setMessage("Service deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete service."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Services</h2>
        <p>
          Manage the services displayed on your portfolio.
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
            ? "Edit Service"
            : "Add Service"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Web Development"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this service..."
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Icon</label>

            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g. Code2"
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
                ? "Update Service"
                : "Add Service"}
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

      <div className="dashboard-card services-list-card">
        <h3>Existing Services</h3>

        {services.length === 0 ? (
          <p>No services added yet.</p>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div
                className="service-admin-card"
                key={service.id}
              >
                <div className="service-admin-info">
                  <h3>{service.title}</h3>

                  {service.icon && (
                    <small>
                      Icon: {service.icon}
                    </small>
                  )}

                  <p>{service.description}</p>

                  <div className="table-actions">
                    <button
                      onClick={() =>
                        handleEdit(service)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(service.id)
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

export default Services;