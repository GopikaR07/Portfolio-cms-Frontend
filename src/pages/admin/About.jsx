import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function About() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await api.get("/about");
      setAbout(response.data.about);
    } catch (error) {
      console.error("Failed to fetch about:", error);
      setMessage("Failed to load About information.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setAbout({
      ...about,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      await api.put("/about", about);

      setMessage("About information updated successfully.");
    } catch (error) {
      console.error("Failed to update about:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update About information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading About information...</p>;
  }

  if (!about) {
    return <p>No About information found.</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>About</h2>
        <p>Manage the information displayed in your portfolio.</p>
      </div>

      <div className="dashboard-card">
        <form onSubmit={handleSubmit}>
          {Object.keys(about)
            .filter((key) => key !== "id" && key !== "created_at" && key !== "updated_at")
            .map((key) => (
              <div className="form-group" key={key}>
                <label>{key.replaceAll("_", " ")}</label>

                <textarea
                  name={key}
                  value={about[key] ?? ""}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            ))}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default About;