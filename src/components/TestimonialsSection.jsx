import { useEffect, useState } from "react";
import api from "../lib/api/api";

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error(
        "Failed to fetch testimonials:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="testimonials"
      className="portfolio-section testimonials-section"
    >
      <p className="section-label">
        06 — TESTIMONIALS
      </p>

      <h2>What people say.</h2>

      {loading ? (
        <p>Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p>No testimonials added yet.</p>
      ) : (
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article
              className="testimonial-card"
              key={testimonial.id}
            >
              {testimonial.image_url && (
                <img
                  src={testimonial.image_url}
                  alt={testimonial.name}
                  className="testimonial-image"
                />
              )}

              <div className="testimonial-content">
                <p className="testimonial-message">
                  "{testimonial.message}"
                </p>

                <h3>{testimonial.name}</h3>

                {(testimonial.role ||
                  testimonial.company) && (
                  <p className="testimonial-person">
                    {testimonial.role || ""}
                    {testimonial.role &&
                    testimonial.company
                      ? " · "
                      : ""}
                    {testimonial.company || ""}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TestimonialsSection;