import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import NavbarPublic from "../../components/NavbarPublic";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    employee_id: "",
    role: "Employee",
    site: "Coimbatore",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const verifyEmail = async () => {
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-email", { email: username });

      if (res.data.exists) {
        alert("User already exists");
        setLoading(false);
        return;
      }

      await api.post("/auth/send-otp", { email: username });

      setOtpSent(true);

      alert("OTP sent to email");
    } catch (err) {
      alert("Verification failed");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email: username,
        otp: otp,
      });

      if (res.data.verified) {
        setOtpVerified(true);
        alert("OTP verified");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("OTP verification error");
    }
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/;

  const createAccount = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(formData.password)) {
      alert(
        "Password must contain uppercase, lowercase, number and special character",
      );

      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    try {
      await api.post("/auth/create-account", {
        username: username,
        password: formData.password,
        site: formData.site,
        first_name: formData.first_name,
        last_name: formData.last_name,
        employee_id: formData.employee_id,
        email: username,
        role: formData.role,
      });

      alert("Account created successfully");

      navigate("/");
    } catch (err) {
      alert("Account creation failed");
    }
  };

  return (
    <>
      <NavbarPublic />

      <div className="container mt-5">
        <div className="card p-4 shadow">
          <h4 className="text-center mb-4">Create Account</h4>

          {/* Username */}

          <div className="mb-3">
            <label>Username (Email)</label>

            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={otpSent}
              />

              <button
                className="btn btn-primary"
                onClick={verifyEmail}
                disabled={!username || otpSent}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>

          {/* OTP */}

          <div className="mb-3">
            <label>OTP</label>

            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter OTP"
                disabled={!otpSent || otpVerified}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                className="btn btn-success"
                onClick={verifyOtp}
                disabled={!otpSent || otpVerified}
              >
                Verify OTP
              </button>
            </div>
          </div>

          <form onSubmit={createAccount}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>First Name</label>

                <input
                  className="form-control"
                  name="first_name"
                  value={formData.first_name}
                  disabled={!otpVerified}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Last Name</label>

                <input
                  className="form-control"
                  name="last_name"
                  value={formData.last_name}
                  disabled={!otpVerified}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}

            <div className="mb-3">
              <label>Email</label>

              <input className="form-control" value={username} readOnly />
            </div>

            {/* Employee ID */}

            <div className="mb-3">
              <label>Employee ID</label>

              <input
                className="form-control"
                name="employee_id"
                value={formData.employee_id}
                disabled={!otpVerified}
                onChange={handleChange}
              />
            </div>

            {/* Role */}

            <div className="mb-3">
              <label>Role</label>

              <select
                className="form-control"
                name="role"
                value={formData.role}
                disabled={!otpVerified}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
                <option value="View Only">View Only</option>
              </select>
            </div>

            {/* Site */}

            <div className="mb-3">
              <label>Site</label>

              <select
                className="form-control"
                name="site"
                value={formData.site}
                disabled={!otpVerified}
                onChange={handleChange}
              >
                <option value="Coimbatore">Coimbatore</option>
              </select>
            </div>

            {/* Password */}

            <div className="mb-3">
              <label>Password</label>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  value={formData.password}
                  disabled={!otpVerified}
                  onChange={handleChange}
                />

                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </span>
              </div>
            </div>

            {/* Confirm Password */}

            <div className="mb-3">
              <label>Confirm Password</label>

              <div className="input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  disabled={!otpVerified}
                  onChange={handleChange}
                />

                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <i
                    className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </span>
              </div>
            </div>

            <button className="btn btn-success w-100" disabled={!otpVerified}>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
