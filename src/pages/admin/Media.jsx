import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Media() {
  const [media, setMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get("/upload/media");
      setMedia(response.data.media || []);
    } catch (error) {
      console.error("Failed to fetch media:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load media."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessage("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("image", selectedFile);

      await api.post("/upload/image", formData);

      setMessage("Image uploaded successfully.");
      setSelectedFile(null);

      e.target.reset();

      await fetchMedia();
    } catch (error) {
      console.error("Upload failed:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p>Loading media...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Media</h2>
        <p>
          Upload and manage images used in your portfolio.
        </p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="dashboard-card">
        <h3>Upload Image</h3>

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Select Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <p>
              Selected: <strong>{selectedFile.name}</strong>
            </p>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
            >
              {uploading
                ? "Uploading..."
                : "Upload Image"}
            </button>
          </div>
        </form>
      </div>

      <div className="dashboard-card media-list-card">
        <h3>Uploaded Media</h3>

        {media.length === 0 ? (
          <p>No media uploaded yet.</p>
        ) : (
          <div className="media-grid">
            {media.map((item) => (
              <div
                className="media-admin-card"
                key={item.id}
              >
                <img
                  src={item.file_url}
                  alt={item.filename}
                />

                <div className="media-admin-info">
                  <p>{item.filename}</p>

                  <small>
                    {item.file_type} •{" "}
                    {item.file_size
                      ? `${Math.round(
                          item.file_size / 1024
                        )} KB`
                      : ""}
                  </small>

                  <small>
                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleDateString()
                      : ""}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Media;