import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function SalesContact() {

const [contacts,setContacts] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
sales_contact_name:"",
email:"",
mobile:"",
landline:""
});

const user = JSON.parse(localStorage.getItem("user"));


// FETCH DATA
const fetchContacts = async ()=>{

try{

const res = await api.get("/salescontact");

console.log("API DATA:", res.data);   // add this line

setContacts(res.data);

}catch(err){

console.log("API ERROR:", err);

}

};
useEffect(()=>{

fetchContacts();

},[]);


// HANDLE INPUT
const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


// ADD CONTACT
const addContact = async(e)=>{

e.preventDefault();

try{

await api.post("/salescontact",formData);

setShowForm(false);

setFormData({
sales_contact_name:"",
email:"",
mobile:"",
landline:""
});

fetchContacts();

}catch(err){

alert("Error adding contact");

}

};


// UPDATE CONTACT
const updateContact = async()=>{

if(user.role !== "Admin") return;

await api.put(`/salescontact/${selected.Sno}`,{
email:selected.email,
mobile:selected.mobile,
landline:selected.landline
});

fetchContacts();

alert("Updated");

};


// TOGGLE STATUS
const toggleStatus = async(id)=>{

if(user.role !== "Admin") return;

await api.patch(`/salescontact/toggle/${id}`);

fetchContacts();

};


// SEARCH FILTER
const filtered = contacts.filter((c)=>
c.sales_contact_name.toLowerCase().includes(search.toLowerCase())
);


return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Sales Contact</span>
</h5>

<div className="row mt-3">

{/* TABLE AREA */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search sales contact"
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

<form onSubmit={addContact}>

<div className="row">

<div className="col-md-3">

<input
className="form-control"
placeholder="Name"
name="sales_contact_name"
onChange={handleChange}
required
/>

</div>

<div className="col-md-3">

<input
className="form-control"
placeholder="Email"
name="email"
onChange={handleChange}
required
/>

</div>

<div className="col-md-3">

<input
className="form-control"
placeholder="Mobile"
name="mobile"
onChange={handleChange}
/>

</div>

<div className="col-md-3">

<input
className="form-control"
placeholder="Landline"
name="landline"
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
<th>Name</th>
<th>Email</th>
<th>Mobile</th>
<th>Landline</th>
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
<td>{c.sales_contact_name}</td>
<td>{c.email}</td>
<td>{c.mobile}</td>
<td>{c.landline}</td>

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

<h6>Edit Sales Contact</h6>

<div className="mb-2">

<label>Name</label>

<input
className="form-control"
value={selected.sales_contact_name}
disabled
/>

</div>


<div className="mb-2">

<label>Email</label>

<input
className="form-control"
value={selected.email}
onChange={(e)=>
setSelected({...selected,email:e.target.value})
}
/>

</div>


<div className="mb-2">

<label>Mobile</label>

<input
className="form-control"
value={selected.mobile || ""}
onChange={(e)=>
setSelected({...selected,mobile:e.target.value})
}
/>

</div>


<div className="mb-2">

<label>Landline</label>

<input
className="form-control"
value={selected.landline || ""}
onChange={(e)=>
setSelected({...selected,landline:e.target.value})
}
/>

</div>


<button
className="btn btn-success"
onClick={updateContact}
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