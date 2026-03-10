import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function CountryType() {
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    country_type_name: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH
  const fetchTypes = async () => {
    try {
      const res = await api.get("/countrytype");
      setTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD
  const addType = async (e) => {
    e.preventDefault();

    try {
      await api.post("/countrytype", formData);

      setShowForm(false);

      setFormData({
        country_type_name: "",
        description: "",
      });

      fetchTypes();
    } catch (err) {
      alert("Error adding type");
    }
  };

  // UPDATE
  const updateType = async () => {
    if (user.role !== "Admin") return;

    await api.put(`/countrytype/${selected.Sno}`, {
      country_type_name: selected.country_type_name,
      description: selected.description,
    });

    fetchTypes();

    alert("Updated");
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    if (user.role !== "Admin") return;

    await api.patch(`/countrytype/toggle/${id}`);

    fetchTypes();
  };

  // SEARCH
  const filtered = types.filter((t) =>
    t.country_type_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Country Type</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search country type"
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
                <form onSubmit={addType}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Country Type"
                        name="country_type_name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="btn btn-success mt-2">Save</button>
                </form>
              </div>
            )}

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sno</th>
                  <th>Country Type</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((t, index) => (
                  <tr
                    key={t.Sno}
                    onDoubleClick={() => setSelected(t)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === t.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{t.country_type_name}</td>
                    <td>{t.description}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          t.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user.role !== "Admin"}
                        onClick={() => toggleStatus(t.Sno)}
                      >
                        {t.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="col-md-5">
              <div className="card shadow p-3">
                <h6>Edit Country Type</h6>

                <input
                  className="form-control mb-2"
                  value={selected.country_type_name}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      country_type_name: e.target.value,
                    })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={selected.description || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />

                <button className="btn btn-success" onClick={updateType}>
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
