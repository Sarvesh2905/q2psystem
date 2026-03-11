import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Unit() {
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    unit_name: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUnits = async () => {
    try {
      const res = await api.get("/unit");
      setUnits(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addUnit = async (e) => {
    e.preventDefault();

    await api.post("/unit", formData);

    setShowForm(false);

    setFormData({
      unit_name: "",
      description: "",
    });

    fetchUnits();
  };

  const updateUnit = async () => {
    if (user?.role !== "Admin") return;

    await api.put(`/unit/${selected.Sno}`, {
      unit_name: selected.unit_name,
      description: selected.description,
    });

    fetchUnits();
  };

  const toggleStatus = async (id) => {
    if (user?.role !== "Admin") return;

    await api.patch(`/unit/toggle/${id}`);

    fetchUnits();
  };

  const filtered = units.filter((u) =>
    u.unit_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Unit</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search unit"
                onChange={(e) => setSearch(e.target.value)}
              />

              {user?.role === "Admin" && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  Add
                </button>
              )}
            </div>

            {showForm && (
              <div className="card shadow p-3 mb-3">
                <form onSubmit={addUnit}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Unit Name"
                        name="unit_name"
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
                  <th>Unit</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((u, index) => (
                  <tr
                    key={u.Sno}
                    onDoubleClick={() => setSelected(u)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === u.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{u.unit_name}</td>
                    <td>{u.description}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          u.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user?.role !== "Admin"}
                        onClick={() => toggleStatus(u.Sno)}
                      >
                        {u.status}
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
                <h6>Edit Unit</h6>

                <input
                  className="form-control mb-2"
                  value={selected.unit_name}
                  onChange={(e) =>
                    setSelected({ ...selected, unit_name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={selected.description || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />

                <button className="btn btn-success" onClick={updateUnit}>
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
