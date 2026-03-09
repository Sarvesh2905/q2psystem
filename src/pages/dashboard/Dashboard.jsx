import NavbarPrivate from "../../components/NavbarPrivate";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <NavbarPrivate />

      <div className="container mt-5">
        <h3 className="mb-4">Dashboard</h3>

        <div className="row g-4">
          {/* Masters Module */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/masters")}
            >
              <i className="bi bi-gear fs-1 mb-2"></i>
              <h5>Masters Module</h5>
            </div>
          </div>

          {/* Enquiry Module */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-file-earmark-text fs-1 mb-2"></i>
              <h5>Enquiry Module</h5>
            </div>
          </div>

          {/* Technical Offer */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-tools fs-1 mb-2"></i>
              <h5>Technical Offer Module</h5>
            </div>
          </div>

          {/* Price Offer */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-currency-dollar fs-1 mb-2"></i>
              <h5>Price Offer Module</h5>
            </div>
          </div>

          {/* Approval */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-check-circle fs-1 mb-2"></i>
              <h5>Approval Module</h5>
            </div>
          </div>

          {/* Price Upload */}

          <div className="col-md-4">
            <div
              className="card shadow p-4 text-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-upload fs-1 mb-2"></i>
              <h5>Price Upload Module</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
