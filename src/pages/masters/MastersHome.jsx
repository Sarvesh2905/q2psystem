import NavbarPrivate from "../../components/NavbarPrivate";
import { useNavigate } from "react-router-dom";

export default function MastersHome() {
  const navigate = useNavigate();

  const masters = [
    { name: "Users Dept", path: "usersdept" },
    { name: "Sales Contact", path: "salescontact" },
    { name: "Customer", path: "customer" },
    { name: "Buyer", path: "buyer" },
    { name: "Country", path: "country" },
    { name: "Product", path: "product" },
    { name: "Price", path: "price" },
    { name: "GE Reference", path: "gereference" },
    { name: "Discount", path: "discount" },
    { name: "Special Discount", path: "specialdiscount" },
    { name: "End Industry", path: "endindustry" },
    { name: "Country Type", path: "countrytype" },
    { name: "Status", path: "status" },
    { name: "Reason", path: "reason" },
    { name: "Timeline Target", path: "timeline" },
    { name: "Cost Price", path: "costprice" },
    { name: "Privileges", path: "privileges" },
  ];

  return (
    <>
      <NavbarPrivate />

      <div className="container mt-4">
        <h3 className="mb-4">Masters</h3>

        <div className="row g-4">
          {masters.map((m, index) => (
            <div key={index} className="col-md-3">
              <div
                className="card shadow p-4 text-center"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/masters/${m.path}`)}
              >
                <h6>{m.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
