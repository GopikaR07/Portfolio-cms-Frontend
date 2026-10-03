import { useEffect, useState } from "react";
import api from "../lib/api/api";

function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");

      const publishedBlogs = (
        response.data.blogs || []
      ).filter((blog) => blog.published);

      setBlogs(publishedBlogs);
    } catch (error) {
      console.error(
        "Failed to fetch blogs:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="blog"
      className="portfolio-section blog-section"
    >
      <p className="section-label">
        05 — BLOG
      </p>

      <h2>Thoughts & writing.</h2>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No published blog posts yet.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article
              className="blog-card"
              key={blog.id}
            >
              {blog.image_url && (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="blog-image"
                />
              )}

              <div className="blog-content">
                <h3>{blog.title}</h3>

                {blog.excerpt && (
                  <p>{blog.excerpt}</p>
                )}

                <small>
                  {blog.created_at
                    ? new Date(
                        blog.created_at
                      ).toLocaleDateString()
                    : ""}
                </small>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default BlogSection;