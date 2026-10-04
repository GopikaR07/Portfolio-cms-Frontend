import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, User, Code, FolderKanban, Briefcase, FileText,
  MessageSquareQuote, Wrench, Image, Mail, LogOut, Menu, X, ExternalLink,
} from "lucide-react";
import { logout } from "../lib/api/auth";
import api from "../lib/api/api";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "About", path: "/admin/about", icon: User },
  { name: "Skills", path: "/admin/skills", icon: Code },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Experience", path: "/admin/experience", icon: Briefcase },
  { name: "Blogs", path: "/admin/blogs", icon: FileText },
  { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Services", path: "/admin/services", icon: Wrench },
  { name: "Media", path: "/admin/media", icon: Image },
  { name: "Messages", path: "/admin/messages", icon: Mail },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    api.get("/messages").then((r) => setMsgCount((r.data.messages || []).length)).catch(() => {});
  }, []);

  const current = menuItems.find((m) => m.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="admin-layout">
      {open && <div className="ad-backdrop" onClick={() => setOpen(false)} />}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-logo">
          <div className="ad-logo-mark">G</div>
          <div>
            <h2>Portfolio CMS</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.path} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <NavLink to={item.path} end={item.path === "/admin"} className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {item.name === "Messages" && msgCount > 0 && <em className="ad-badge">{msgCount}</em>}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <button className="logout-button" onClick={() => { logout(); navigate("/admin/login"); }}>
          <LogOut size={18} /><span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header ad-header">
          <button className="ad-menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1>{current}</h1>
            <p>Manage your portfolio content</p>
          </div>
          <div className="ad-header-right">
            <a href="/" target="_blank" rel="noreferrer" className="ad-visit">View site <ExternalLink size={14} /></a>
            <div className="ad-avatar">GR</div>
          </div>
        </header>

        <section className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;