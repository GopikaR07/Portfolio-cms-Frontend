import { useEffect, useState } from "react";
import api from "../../lib/api/api";

function Blogs() {
  const emptyForm = {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
  };

  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load blogs."
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
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        image_url: form.image_url,
        published: form.published,
      };

      if (editingId) {
        await api.put(`/blogs/${editingId}`, data);

        setMessage("Blog updated successfully.");
      } else {
        await api.post("/blogs", data);

        setMessage("Blog added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      image_url: blog.image_url || "",
      published: Boolean(blog.published),
    });

    setEditingId(blog.id);
    setMessage("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);

      setMessage("Blog deleted successfully.");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchBlogs();
    } catch (error) {
      console.error("Failed to delete blog:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete blog."
      );
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  };

  if (loading) {
    return <p>Loading blogs...</p>;
  }

  return (
    <div>
      <div className="page-heading">
        <h2>Blogs</h2>

        <p>
          Create and manage the blog posts displayed on your
          portfolio.
        </p>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <div className="dashboard-card">
        <h3>
          {editingId ? "Edit Blog" : "Add New Blog"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Getting Started with AWS"
              required
            />
          </div>

          <div className="form-group">
            <label>Slug</label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="getting-started-with-aws"
              required
            />

            <small>
              Use lowercase words separated by hyphens.
            </small>
          </div>

          <div className="form-group">
            <label>Excerpt</label>

            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Short description of the blog..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Content</label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows="10"
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

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />

            <label htmlFor="published">
              Publish this blog
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
                ? "Update Blog"
                : "Add Blog"}
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

      <div className="dashboard-card blogs-list-card">
        <h3>Existing Blogs</h3>

        {blogs.length === 0 ? (
          <p>No blogs added yet.</p>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div
                className="blog-admin-card"
                key={blog.id}
              >
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="blog-admin-image"
                  />
                )}

                <div className="blog-admin-info">
                  <div className="blog-admin-header">
                    <h3>{blog.title}</h3>

                    <span
                      className={
                        blog.published
                          ? "status-published"
                          : "status-draft"
                      }
                    >
                      {blog.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <p className="blog-slug">
                    /{blog.slug}
                  </p>

                  <p>
                    {blog.excerpt ||
                      "No excerpt available."}
                  </p>

                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(blog.id)
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

export default Blogs;