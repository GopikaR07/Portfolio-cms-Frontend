import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { FolderKanban, Code, FileText, Mail, Briefcase, Plus, ArrowUpRight } from "lucide-react";
import api from "../lib/api/api";

const pick = (d, key) => d?.[key] ?? d?.data ?? Object.values(d || {}).find(Array.isArray) ?? [];

function CountUp({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 1.1, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to]);
  return <>{v}</>;
}

function AdminDashboard() {
  const [data, setData] = useState({ projects: [], skills: [], blogs: [], experience: [], messages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = (url, key) => api.get(url).then((r) => pick(r.data, key)).catch(() => []);
    Promise.all([
      get("/projects", "projects"), get("/skills", "skills"), get("/blogs", "blogs"),
      get("/experience", "experience"), get("/messages", "messages"),
    ]).then(([projects, skills, blogs, experience, messages]) => {
      setData({ projects, skills, blogs, experience, messages });
      setLoading(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const published = data.blogs.filter((b) => b.status === "published").length;

  const stats = [
    { label: "Projects", value: data.projects.length, icon: FolderKanban, to: "/admin/projects" },
    { label: "Skills", value: data.skills.length, icon: Code, to: "/admin/skills" },
    { label: "Blog posts", value: data.blogs.length, icon: FileText, to: "/admin/blogs" },
    { label: "Experience", value: data.experience.length, icon: Briefcase, to: "/admin/experience" },
    { label: "Messages", value: data.messages.length, icon: Mail, to: "/admin/messages" },
  ];
  const max = Math.max(...stats.map((s) => s.value), 1);
  const recent = [...data.messages].slice(0, 4);

  return (
    <div>
      <motion.div className="db-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h2>{greet}, Gopika 👋</h2>
          <p>Here's what's happening on your portfolio.</p>
        </div>
        <div className="db-quick">
          <Link to="/admin/projects"><Plus size={15} /> Project</Link>
          <Link to="/admin/blogs"><Plus size={15} /> Blog</Link>
          <Link to="/admin/skills"><Plus size={15} /> Skill</Link>
        </div>
      </motion.div>

      <div className="db-stats">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
              <Link to={s.to} className="db-stat">
                <div className="db-stat-icon"><Icon size={20} /></div>
                <strong>{loading ? "–" : <CountUp to={s.value} />}</strong>
                <span>{s.label}</span>
                <ArrowUpRight size={16} className="db-arrow" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="db-row">
        <motion.div className="dashboard-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3>Content overview</h3>
          <div className="db-bars">
            {stats.map((s, i) => (
              <div key={s.label} className="db-bar-row">
                <span>{s.label}</span>
                <div className="db-bar"><motion.div initial={{ width: 0 }} animate={{ width: `${(s.value / max) * 100}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }} /></div>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
          <p className="db-note">{published} of {data.blogs.length} blog posts published</p>
        </motion.div>

        <motion.div className="dashboard-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3>Recent messages</h3>
          {recent.length === 0 ? (
            <p className="db-note">No messages yet.</p>
          ) : (
            recent.map((m, i) => (
              <div className="db-msg" key={m.id ?? i}>
                <div className="ad-avatar sm">{(m.name || "?")[0].toUpperCase()}</div>
                <div>
                  <b>{m.name}</b>
                  <p>{m.subject || m.message}</p>
                </div>
              </div>
            ))
          )}
          <Link to="/admin/messages" className="db-link">View all →</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;