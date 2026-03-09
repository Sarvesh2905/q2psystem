import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NavbarPublic from "../../components/NavbarPublic";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    site: "Coimbatore",
  });

  /* Prevent logged-in users opening login page */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* Toggle password visibility */

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  /* Login */

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      <NavbarPublic />

      <div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <h4 className="text-center mb-4">Login</h4>

          <form onSubmit={handleLogin}>
            {/* Username */}

            <div className="mb-3">
              <label className="form-label">Username</label>

              <input
                type="email"
                name="username"
                className="form-control"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}

            <div className="mb-3">
              <label className="form-label">Password</label>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={handleChange}
                  required
                />

                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={togglePassword}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </span>
              </div>
            </div>

            {/* Site */}

            <div className="mb-3">
              <label className="form-label">Site</label>

              <select
                name="site"
                className="form-control"
                onChange={handleChange}
              >
                <option value="Coimbatore">Coimbatore</option>
              </select>
            </div>

            {/* Login Button */}

            <button className="btn btn-primary w-100 mb-3">Login</button>
          </form>

          {/* Create Account */}

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
}
