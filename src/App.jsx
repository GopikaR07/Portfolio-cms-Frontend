import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import About from "./pages/admin/About";
import Skills from "./pages/admin/Skills";
import Projects from "./pages/admin/Projects";
import Blogs from "./pages/admin/Blogs";
import Experience from "./pages/admin/Experience";
import Testimonials from "./pages/admin/Testimonials";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Portfolio Home</div>} />

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experience" element={<Experience />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="testimonials" element={<Testimonials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;