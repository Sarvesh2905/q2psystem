import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Status(){

const [statuses,setStatuses] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
status_name:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

/* FETCH */

const fetchStatus = async ()=>{

try{

const res = await api.get("/status");
setStatuses(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchStatus();
},[]);

/* INPUT CHANGE */

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};

/* ADD */

const addStatus = async(e)=>{

e.preventDefault();

await api.post("/status",formData);

setShowForm(false);

setFormData({
status_name:"",
description:""
});

fetchStatus();

};

/* UPDATE */

const updateStatus = async()=>{

if(user?.role !== "Admin") return;

await api.put(`/status/${selected.Sno}`,{
status_name:selected.status_name,
description:selected.description
});

fetchStatus();

};

/* TOGGLE STATUS */

const toggleStatus = async(id)=>{

if(user?.role !== "Admin") return;

await api.patch(`/status/toggle/${id}`);

fetchStatus();

};

/* SEARCH */

const filtered = statuses.filter((s)=>
s.status_name.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Status</span>
</h5>

<div className="row mt-3">

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search status"
onChange={(e)=>setSearch(e.target.value)}
/>

{user?.role==="Admin" &&(

<button
className="btn btn-primary"
onClick={()=>setShowForm(!showForm)}
>
Add
</button>

)}

</div>

{/* ADD FORM */}

{showForm &&(

<div className="card shadow p-3 mb-3">

<form onSubmit={addStatus}>

<div className="row">

<div className="col-md-6">

<input
className="form-control"
placeholder="Status Name"
name="status_name"
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
<th>Status</th>
<th>Description</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((s,index)=>(

<tr
key={s.Sno}
onDoubleClick={()=>setSelected(s)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno===s.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{s.status_name}</td>
<td>{s.description}</td>

<td>

<button
className={`btn btn-sm ${
s.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
disabled={user?.role!=="Admin"}
onClick={()=>toggleStatus(s.Sno)}
>

{s.status}

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* EDIT PANEL */}

{selected &&(

<div className="col-md-5">

<div className="card shadow p-3">

<h6>Edit Status</h6>

<input
className="form-control mb-2"
value={selected.status_name}
onChange={(e)=>
setSelected({...selected,status_name:e.target.value})
}
/>

<input
className="form-control mb-2"
value={selected.description || ""}
onChange={(e)=>
setSelected({...selected,description:e.target.value})
}
/>

<button
className="btn btn-success"
onClick={updateStatus}
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