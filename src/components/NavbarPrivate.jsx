import { useNavigate } from "react-router-dom";

export default function NavbarPrivate() {
  const navigate = useNavigate();

  // Get user safely from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid">
        {/* Left */}
        <span className="navbar-brand fw-bold">Circor Flow</span>

        {/* Center */}
        <span className="text-white fs-5">Q2P System</span>

        {/* Right */}
        <div className="d-flex align-items-center gap-4 text-white">
          <span>
            Welcome {user?.first_name || "User"} ({user?.role || "Employee"})
          </span>

          {/* Home Icon */}
          <i
            className="bi bi-house-door fs-5"
            style={{ cursor: "pointer" }}
            title="Home"
            onClick={() => navigate("/dashboard")}
          ></i>

          {/* Logout Icon */}
          <i
            className="bi bi-box-arrow-right fs-5"
            style={{ cursor: "pointer" }}
            title="Logout"
            onClick={logout}
          ></i>
        </div>
      </div>
    </nav>
  );
}
