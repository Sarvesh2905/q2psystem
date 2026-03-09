import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function UsersDept() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({
    dept_user_id: "",
    Username: "",
    Email: "",
  });

  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ======================
FETCH USERS
====================== */

  const fetchUsers = async () => {
    try {
      const res = await api.get("/usersdept");

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
HANDLE INPUT
====================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
ADD USER
====================== */

  const addUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/usersdept", formData);

      setShowForm(false);

      setFormData({
        dept_user_id: "",
        Username: "",
        Email: "",
      });

      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding engineer");
    }
  };

  /* ======================
TOGGLE STATUS
====================== */

  const toggleStatus = async (id) => {
    if (user.role !== "Admin") return;

    await api.patch(`/usersdept/toggle/${id}`);

    fetchUsers();
  };

  /* ======================
UPDATE USER
====================== */

  const updateUser = async () => {
    if (user.role !== "Admin") return;

    await api.put(`/usersdept/${selected.Sno}`, {
      Username: selected.Username,
      Email: selected.Email,
    });

    fetchUsers();

    alert("Engineer updated");
  };

  /* ======================
SEARCH FILTER
====================== */

  const filteredUsers = users.filter(
    (u) =>
      u.Username.toLowerCase().includes(search.toLowerCase()) ||
      u.dept_user_id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Users Dept</span>
        </h5>

        <div className="row mt-3">
          {/* ======================
TABLE SECTION
====================== */}

          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search by Engineer ID or Name"
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
                <form onSubmit={addUser}>
                  <div className="row">
                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Engineer ID"
                        name="dept_user_id"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Engineer Name"
                        name="Username"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Email"
                        name="Email"
                        onChange={handleChange}
                        required
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
                  <th>Application Engineer ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr
                    key={u.Sno}
                    onDoubleClick={() => setSelected(u)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === u.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>

                    <td>{u.dept_user_id}</td>

                    <td>{u.Username}</td>

                    <td>{u.Email}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          u.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        disabled={user.role !== "Admin"}
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

          {/* ======================
EDIT PANEL
====================== */}

          {selected && (
            <div className="col-md-5">
              <div className="card shadow p-3">
                <h6>Edit Engineer</h6>

                <div className="mb-2">
                  <label>ID</label>

                  <input
                    className="form-control"
                    value={selected.dept_user_id}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label>Name</label>

                  <input
                    className="form-control"
                    value={selected.Username}
                    disabled={
                      user.role !== "Admin" || selected.status === "Inactive"
                    }
                    onChange={(e) =>
                      setSelected({ ...selected, Username: e.target.value })
                    }
                  />
                </div>

                <div className="mb-2">
                  <label>Email</label>

                  <input
                    className="form-control"
                    value={selected.Email}
                    disabled={
                      user.role !== "Admin" || selected.status === "Inactive"
                    }
                    onChange={(e) =>
                      setSelected({ ...selected, Email: e.target.value })
                    }
                  />
                </div>

                {user.role === "Admin" && selected.status === "Active" && (
                  <button className="btn btn-success mt-2" onClick={updateUser}>
                    Save
                  </button>
                )}

                <button
                  className="btn btn-secondary mt-2 ms-2"
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
