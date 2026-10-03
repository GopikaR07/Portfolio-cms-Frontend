import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Code,
  FolderKanban,
  Briefcase,
  FileText,
  MessageSquareQuote,
  Wrench,
  Image,
  Mail,
  LogOut,
} from "lucide-react";
import { logout } from "../lib/api/auth";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Portfolio CMS</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `admin-nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Portfolio CMS</h1>
            <p>Manage your portfolio content</p>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;