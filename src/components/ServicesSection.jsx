import { useEffect, useState } from "react";
import api from "../lib/api/api";

function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data.services || []);
    } catch (error) {
      console.error(
        "Failed to fetch services:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="services"
      className="portfolio-section services-section"
    >
      <p className="section-label">
        07 — SERVICES
      </p>

      <h2>What I can build.</h2>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services added yet.</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <article
              className="public-service-card"
              key={service.id}
            >
              {service.icon && (
                <div className="service-icon">
                  {service.icon}
                </div>
              )}

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesSection;