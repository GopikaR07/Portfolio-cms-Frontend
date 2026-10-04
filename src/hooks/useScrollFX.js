import { useEffect } from "react";

const SEL = [
  ".portfolio-home .portfolio-section",
  ".portfolio-home .section-label",
  ".portfolio-home .portfolio-section h2",
  '.portfolio-home [class$="-card"]',
  ".portfolio-home article",
  ".portfolio-home .contact-form",
  ".portfolio-home .skill-proficiency-fill",
].join(",");

export default function useScrollFX() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );

    const seen = new WeakSet();
    const scan = () =>
      document.querySelectorAll(SEL).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        const i = [...(el.parentElement?.children || [])].indexOf(el);
        el.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
        el.classList.add("reveal");
        io.observe(el);
      });

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // cursor glow
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    const move = (e) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      const card = e.target.closest?.(".project-card");
      document.querySelectorAll(".project-card.tilt").forEach((c) => c !== card && reset(c));
      if (card) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add("tilt");
        card.style.transition = "transform .1s";
        card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
      }
    };
    const reset = (c) => {
      c.classList.remove("tilt");
      c.style.transition = "";
      c.style.transform = "";
    };

    window.addEventListener("mousemove", move);
    return () => {
      io.disconnect();
      mo.disconnect();
      glow.remove();
      window.removeEventListener("mousemove", move);
    };
  }, []);
}