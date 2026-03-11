import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function DeliveryTerms() {
  const [terms, setTerms] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    delivery_term_name: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTerms = async () => {
    try {
      const res = await api.get("/deliveryterms");
      setTerms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addTerm = async (e) => {
    e.preventDefault();

    await api.post("/deliveryterms", formData);

    setShowForm(false);

    setFormData({
      delivery_term_name: "",
      description: "",
    });

    fetchTerms();
  };

  const updateTerm = async () => {
    if (user?.role !== "Admin") return;

    await api.put(`/deliveryterms/${selected.Sno}`, {
      delivery_term_name: selected.delivery_term_name,
      description: selected.description,
    });

    fetchTerms();
  };

  const toggleStatus = async (id) => {
    if (user?.role !== "Admin") return;

    await api.patch(`/deliveryterms/toggle/${id}`);

    fetchTerms();
  };

  const filtered = terms.filter((t) =>
    t.delivery_term_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Delivery Terms</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search delivery terms"
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
                <form onSubmit={addTerm}>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        placeholder="Delivery Term"
                        name="delivery_term_name"
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
                  <th>Delivery Term</th>
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
                    <td>{t.delivery_term_name}</td>
                    <td>{t.description}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          t.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user?.role !== "Admin"}
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
                <h6>Edit Delivery Term</h6>

                <input
                  className="form-control mb-2"
                  value={selected.delivery_term_name}
                  onChange={(e) =>
                    setSelected({
                      ...selected,
                      delivery_term_name: e.target.value,
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

                <button className="btn btn-success" onClick={updateTerm}>
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
