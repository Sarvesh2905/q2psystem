import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH
  const fetchProducts = async () => {
    try {
      const res = await api.get("/product");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await api.post("/product", formData);

      setShowForm(false);

      setFormData({
        product_name: "",
        product_code: "",
        description: "",
      });

      fetchProducts();
    } catch (err) {
      alert("Error adding product");
    }
  };

  // UPDATE
  const updateProduct = async () => {
    if (user.role !== "Admin") return;

    await api.put(`/product/${selected.Sno}`, {
      product_name: selected.product_name,
      product_code: selected.product_code,
      description: selected.description,
    });

    fetchProducts();

    alert("Updated");
  };

  // STATUS
  const toggleStatus = async (id) => {
    if (user.role !== "Admin") return;

    await api.patch(`/product/toggle/${id}`);

    fetchProducts();
  };

  // SEARCH
  const filtered = products.filter((p) =>
    p.product_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <NavbarPrivate />

      <div className="container-fluid mt-4">
        <h5>
          Masters / <span className="text-primary">Product</span>
        </h5>

        <div className="row mt-3">
          <div className={selected ? "col-md-7" : "col-md-12"}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search product"
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
                <form onSubmit={addProduct}>
                  <div className="row">
                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Product Name"
                        name="product_name"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        className="form-control"
                        placeholder="Product Code"
                        name="product_code"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4">
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

            {/* TABLE */}

            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sno</th>
                  <th>Product</th>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p, index) => (
                  <tr
                    key={p.Sno}
                    onDoubleClick={() => setSelected(p)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.Sno === p.Sno ? "#f5f5f5" : "",
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{p.product_name}</td>
                    <td>{p.product_code}</td>
                    <td>{p.description}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          p.status === "Active"
                            ? "btn-success"
                            : "btn-secondary"
                        }`}
                        onClick={() => toggleStatus(p.Sno)}
                        disabled={user.role !== "Admin"}
                      >
                        {p.status}
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
                <h6>Edit Product</h6>

                <input
                  className="form-control mb-2"
                  value={selected.product_name}
                  onChange={(e) =>
                    setSelected({ ...selected, product_name: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={selected.product_code || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, product_code: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  value={selected.description || ""}
                  onChange={(e) =>
                    setSelected({ ...selected, description: e.target.value })
                  }
                />

                <button className="btn btn-success" onClick={updateProduct}>
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
