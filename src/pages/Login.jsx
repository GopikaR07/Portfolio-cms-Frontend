import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Check } from "lucide-react";
import api from "../lib/api/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setDone(true);
      setTimeout(() => navigate("/admin"), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      setShake((s) => s + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-brand">
        <div className="lg-orb lg-orb-1" />
        <div className="lg-orb lg-orb-2" />
        <div className="lg-orb lg-orb-3" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="lg-logo">G</div>
          <h1>Portfolio<br />Control Room</h1>
          <p>Create, edit and publish everything on your portfolio from one place.</p>
          <div className="lg-chips">
            {["Projects", "Skills", "Blogs", "Messages"].map((c, i) => (
              <motion.span key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.12 }}>
                {c}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="lg-side">
        <motion.div
          key={shake}
          className="lg-card"
          initial={{ opacity: 0, y: 24 }}
          animate={shake ? { x: [0, -10, 10, -8, 8, 0], opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: shake ? 0.4 : 0.6 }}
        >
          <p className="lg-label">PORTFOLIO CMS</p>
          <h2>Welcome back</h2>
          <p className="lg-sub">Sign in to manage your portfolio content.</p>

          <form onSubmit={handleLogin}>
            <div className="lg-field">
              <input id="email" type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="email">Email</label>
              <Mail size={18} />
            </div>

            <div className="lg-field">
              <input
                id="password"
                type={show ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCaps(e.getModifierState?.("CapsLock"))}
                required
              />
              <label htmlFor="password">Password</label>
              <button type="button" className="lg-eye" onClick={() => setShow(!show)} aria-label="Toggle password">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {caps && <div className="lg-warn"><Lock size={14} /> Caps Lock is on</div>}
            {error && <motion.div className="login-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" className="lg-btn" disabled={loading || done}>
              {done ? <><Check size={18} /> Welcome!</> : loading ? <span className="lg-spinner" /> : "Sign In"}
            </motion.button>
          </form>

          <Link to="/" className="lg-back">← Back to Portfolio</Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;