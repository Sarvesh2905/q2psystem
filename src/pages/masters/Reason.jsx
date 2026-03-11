import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Reason() {
  const [reasons, setReasons] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    reason_name: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReasons = async () => {
    try {
      const res = await api.get("/reason");
      setReasons(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addReason = async (e) => {
    e.preventDefault();

    await api.post("/reason", formData);

    setShowForm(false);

    setFormData({
      reason_name: "",
      description: "",
    });

    fetchReasons();
  };

  const updateReason = async () => {
    if (user?.role !== "Admin") return;

    await api.put(`/reason/${selected.Sno}`, {
      reason_name: selected.reason_name,
      description: selected.description,
    });

    fetchReasons();
  };

  const toggleStatus = async (id) => {
    if (user?.role !== "Admin") return;

    await api.patch(`/reason/toggle/${id}`);

    fetchReasons();
  };

  const filtered = reasons.filter((r) =>
    r.reason_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Reason</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search reason"
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
                <form onSubmit={addReason}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Reason"
                        name="reason_name"
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
                  <th>Reason</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, index) => (
                  <tr
                    key={r.Sno}
                    onDoubleClick={() => setSelected(r)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === r.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{r.reason_name}</td>
                    <td>{r.description}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          r.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user?.role !== "Admin"}
                        onClick={() => toggleStatus(r.Sno)}
                      >
                        {r.status}
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
                <h6>Edit Reason</h6>

                <input
                  className="form-control mb-2"
                  value={selected.reason_name}
                  onChange={(e) =>
                    setSelected({ ...selected, reason_name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={selected.description || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />

                <button className="btn btn-success" onClick={updateReason}>
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
