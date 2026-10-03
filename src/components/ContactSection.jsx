import { useState } from "react";
import api from "../lib/api/api";

function ContactSection() {
  const emptyForm = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);
      setStatus("");

      await api.post("/messages", form);

      setForm(emptyForm);
      setStatus(
        "Your message has been sent successfully."
      );
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      setStatus(
        error.response?.data?.message ||
          "Failed to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="portfolio-section contact-section"
    >
      <p className="section-label">
        08 — CONTACT
      </p>

      <div className="contact-heading">
        <h2>Let's build something.</h2>

        <p>
          Have a project, opportunity or idea you'd
          like to discuss? Send me a message.
        </p>
      </div>

      {status && (
        <div className="contact-status">
          {status}
        </div>
      )}

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >
        <div className="contact-form-row">
          <div className="form-group">
            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            Subject
          </label>

          <input
            id="subject"
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What would you like to discuss?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Message
          </label>

          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows="7"
            required
          />
        </div>

        <button
          type="submit"
          className="contact-submit"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default ContactSection;