import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Country() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    country_name: "",
    country_code: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH COUNTRIES
  const fetchCountries = async () => {
    try {
      const res = await api.get("/country");
      setCountries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD COUNTRY
  const addCountry = async (e) => {
    e.preventDefault();

    try {
      await api.post("/country", formData);

      setShowForm(false);

      setFormData({
        country_name: "",
        country_code: "",
      });

      fetchCountries();
    } catch (err) {
      alert("Error adding country");
    }
  };

  // UPDATE COUNTRY
  const updateCountry = async () => {
    if (user.role !== "Admin") return;

    await api.put(`/country/${selected.Sno}`, {
      country_name: selected.country_name,
      country_code: selected.country_code,
    });

    fetchCountries();

    alert("Updated");
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    if (user.role !== "Admin") return;

    await api.patch(`/country/toggle/${id}`);

    fetchCountries();
  };

  // SEARCH
  const filtered = countries.filter((c) =>
    c.country_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Country</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search country"
                onChange={(e) => setSearch(e.target.value)}
              />

              {user.role === "Admin" && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  Add
                </button>
              )}
            </div>

            {/* ADD FORM */}

            {showForm && (
              <div className="card shadow p-3 mb-3">
                <form onSubmit={addCountry}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Country Name"
                        name="country_name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Country Code"
                        name="country_code"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="btn btn-success mt-2">Save</button>
                </form>
              </div>
            )}

            {/* TABLE */}

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sno</th>
                  <th>Country Name</th>
                  <th>Country Code</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((c, index) => (
                  <tr
                    key={c.Sno}
                    onDoubleClick={() => setSelected(c)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === c.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{c.country_name}</td>
                    <td>{c.country_code}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          c.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user.role !== "Admin"}
                        onClick={() => toggleStatus(c.Sno)}
                      >
                        {c.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT PANEL */}

          {selected && (
            <div className="col-md-5">
              <div className="card shadow p-3">
                <h6>Edit Country</h6>

                <div className="mb-2">
                  <label>Country Name</label>

                  <input
                    className="form-control"
                    value={selected.country_name}
                    onChange={(e) =>
                      setSelected({ ...selected, country_name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Country Code</label>

                  <input
                    className="form-control"
                    value={selected.country_code || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, country_code: e.target.value })
                    }
                  />
                </div>

                <button className="btn btn-success" onClick={updateCountry}>
                  Save
                </button>

                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
