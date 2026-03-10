import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Buyer() {
  const [buyers, setBuyers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    buyer_name: "",
    designation: "",
    email: "",
    phone: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  /* FETCH BUYERS */

  const fetchBuyers = async () => {
    try {
      const res = await api.get("/buyers");
      setBuyers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* FETCH CUSTOMERS FOR DROPDOWN */

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBuyers();
    fetchCustomers();
  }, []);

  /* HANDLE INPUT */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ADD BUYER */

  const addBuyer = async (e) => {
    e.preventDefault();

    try {
      await api.post("/buyers", formData);

      setShowForm(false);

      setFormData({
        customer_id: "",
        buyer_name: "",
        designation: "",
        email: "",
        phone: "",
      });

      fetchBuyers();
    } catch (err) {
      alert("Error adding buyer");
    }
  };

  /* UPDATE BUYER */

  const updateBuyer = async () => {
    if (user.role !== "Admin") return;

    await api.put(`/buyers/${selected.Sno}`, {
      designation: selected.designation,
      email: selected.email,
      phone: selected.phone,
    });

    fetchBuyers();

    alert("Updated");
  };

  /* TOGGLE STATUS */

  const toggleStatus = async (id) => {
    if (user.role !== "Admin") return;

    await api.patch(`/buyers/toggle/${id}`);

    fetchBuyers();
  };

  /* SEARCH */

  const filtered = buyers.filter((b) =>
    b.buyer_name.toLowerCase().includes(search.toLowerCase()),
  );

  /* UI */

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Buyer</span>
        </h5>

        <div className="row mt-3">
          {/* TABLE AREA */}

          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search buyer"
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
                <form onSubmit={addBuyer}>
                  <div className="row g-2">
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        name="customer_id"
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Customer</option>

                        {customers.map((c) => (
                          <option key={c.Sno} value={c.Sno}>
                            {c.customer_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <input
                        className="form-control"
                        placeholder="Buyer Name"
                        name="buyer_name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        className="form-control"
                        placeholder="Designation"
                        name="designation"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-2">
                      <input
                        className="form-control"
                        placeholder="Phone"
                        name="phone"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="btn btn-success mt-3">Save</button>
                </form>
              </div>
            )}

            {/* TABLE */}

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sno</th>
                  <th>Customer</th>
                  <th>Buyer Name</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((b, index) => (
                  <tr
                    key={b.Sno}
                    onDoubleClick={() => setSelected(b)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === b.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{b.customer}</td>
                    <td>{b.buyer_name}</td>
                    <td>{b.designation}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          b.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user.role !== "Admin"}
                        onClick={() => toggleStatus(b.Sno)}
                      >
                        {b.status}
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
                <h6>Edit Buyer</h6>

                <div className="mb-2">
                  <label>Buyer Name</label>

                  <input
                    className="form-control"
                    value={selected.buyer_name}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label>Designation</label>

                  <input
                    className="form-control"
                    value={selected.designation || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, designation: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Email</label>

                  <input
                    className="form-control"
                    value={selected.email || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, email: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Phone</label>

                  <input
                    className="form-control"
                    value={selected.phone || ""}
                    onChange={(e) =>
                      setSelected({ ...selected, phone: e.target.value })
                    }
                  />
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-success" onClick={updateBuyer}>
                    Save
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelected(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
