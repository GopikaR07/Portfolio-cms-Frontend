function AdminDashboard() {
  return (
    <div>
      <div className="page-heading">
        <h2>Dashboard</h2>
        <p>Welcome back. Manage your portfolio from here.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>About</h3>
          <p>Manage your personal information.</p>
        </div>

        <div className="dashboard-card">
          <h3>Skills</h3>
          <p>Add and manage your technical skills.</p>
        </div>

        <div className="dashboard-card">
          <h3>Projects</h3>
          <p>Manage your portfolio projects.</p>
        </div>

        <div className="dashboard-card">
          <h3>Experience</h3>
          <p>Manage your work and internship experience.</p>
        </div>

        <div className="dashboard-card">
          <h3>Blogs</h3>
          <p>Create and manage blog posts.</p>
        </div>

        <div className="dashboard-card">
          <h3>Messages</h3>
          <p>View messages received from visitors.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;