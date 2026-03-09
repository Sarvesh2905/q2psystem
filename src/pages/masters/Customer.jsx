import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Customer() {

const [customers,setCustomers] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
customer_code:"",
customer_name:"",
address:"",
country:"",
state:"",
city:"",
contact_person:"",
email:"",
phone:""
});

const user = JSON.parse(localStorage.getItem("user"));


// FETCH CUSTOMERS
const fetchCustomers = async ()=>{

try{

const res = await api.get("/customers");

setCustomers(res.data);

}catch(err){

console.log(err);

}

};

useEffect(()=>{

fetchCustomers();

},[]);


// HANDLE INPUT
const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


// ADD CUSTOMER
const addCustomer = async(e)=>{

e.preventDefault();

try{

await api.post("/customers",formData);

setShowForm(false);

setFormData({
customer_code:"",
customer_name:"",
address:"",
country:"",
state:"",
city:"",
contact_person:"",
email:"",
phone:""
});

fetchCustomers();

}catch(err){

alert("Error adding customer");

}

};


// UPDATE CUSTOMER
const updateCustomer = async()=>{

if(user.role !== "Admin") return;

await api.put(`/customers/${selected.Sno}`,{
address:selected.address,
country:selected.country,
state:selected.state,
city:selected.city,
contact_person:selected.contact_person,
email:selected.email,
phone:selected.phone
});

fetchCustomers();

alert("Updated");

};


// TOGGLE STATUS
const toggleStatus = async(id)=>{

if(user.role !== "Admin") return;

await api.patch(`/customers/toggle/${id}`);

fetchCustomers();

};


// SEARCH
const filtered = customers.filter((c)=>
(c.customer_name || "").toLowerCase().includes(search.toLowerCase())
);


return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Customer</span>
</h5>

<div className="row mt-3">

{/* TABLE */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
className="form-control w-50"
placeholder="Search customer"
onChange={(e)=>setSearch(e.target.value)}
/>

{user.role === "Admin" && (

<button
className="btn btn-primary"
onClick={()=>setShowForm(!showForm)}
>
Add
</button>

)}

</div>


{/* ADD FORM */}

{showForm && (

<div className="card shadow p-3 mb-3">

<form onSubmit={addCustomer}>

<div className="row g-2">

<div className="col-md-3">
<input
className="form-control"
placeholder="Customer Code"
name="customer_code"
onChange={handleChange}
required
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="Customer Name"
name="customer_name"
onChange={handleChange}
required
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="Contact Person"
name="contact_person"
onChange={handleChange}
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="Email"
name="email"
onChange={handleChange}
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="Phone"
name="phone"
onChange={handleChange}
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="Country"
name="country"
onChange={handleChange}
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="State"
name="state"
onChange={handleChange}
/>
</div>

<div className="col-md-3">
<input
className="form-control"
placeholder="City"
name="city"
onChange={handleChange}
/>
</div>

<div className="col-md-12">
<input
className="form-control"
placeholder="Address"
name="address"
onChange={handleChange}
/>
</div>

</div>

<button className="btn btn-success mt-2">
Save
</button>

</form>

</div>

)}


<table className="table table-bordered table-hover">

<thead className="table-dark">

<tr>

<th>Sno</th>
<th>Code</th>
<th>Name</th>
<th>Contact</th>
<th>Email</th>
<th>Phone</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((c,index)=>(
<tr
key={c.Sno}
onDoubleClick={()=>setSelected(c)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno === c.Sno ? "#f5f5f5" : ""
}}
>

<td>{index+1}</td>
<td>{c.customer_code}</td>
<td>{c.customer_name}</td>
<td>{c.contact_person}</td>
<td>{c.email}</td>
<td>{c.phone}</td>

<td>

<button
className={`btn btn-sm ${
c.status === "Active"
? "btn-success"
: "btn-secondary"
}`}
disabled={user.role !== "Admin"}
onClick={()=>toggleStatus(c.Sno)}
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

<h6>Edit Customer</h6>

<div className="mb-2">

<label>Customer Name</label>

<input
className="form-control"
value={selected.customer_name}
disabled
/>

</div>

<div className="mb-2">

<label>Contact Person</label>

<input
className="form-control"
value={selected.contact_person || ""}
onChange={(e)=>
setSelected({...selected,contact_person:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Email</label>

<input
className="form-control"
value={selected.email || ""}
onChange={(e)=>
setSelected({...selected,email:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Phone</label>

<input
className="form-control"
value={selected.phone || ""}
onChange={(e)=>
setSelected({...selected,phone:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Address</label>

<input
className="form-control"
value={selected.address || ""}
onChange={(e)=>
setSelected({...selected,address:e.target.value})
}
/>

</div>

<button
className="btn btn-success"
onClick={updateCustomer}
>
Save
</button>

<button
className="btn btn-secondary ms-2"
onClick={()=>setSelected(null)}
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