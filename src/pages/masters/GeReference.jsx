import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function GeReference() {

const [references,setReferences] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
ge_reference_no:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

/* FETCH DATA */

const fetchReferences = async ()=>{

try{

const res = await api.get("/gereference");
setReferences(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchReferences();
},[]);


/* HANDLE INPUT */

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


/* ADD */

const addReference = async(e)=>{

e.preventDefault();

try{

await api.post("/gereference",formData);

setShowForm(false);

setFormData({
ge_reference_no:"",
description:""
});

fetchReferences();

}catch(err){

alert("Error adding GE Reference");

}

};


/* UPDATE */

const updateReference = async()=>{

if(user?.role !== "Admin") return;

await api.put(`/gereference/${selected.Sno}`,{
ge_reference_no:selected.ge_reference_no,
description:selected.description
});

fetchReferences();

alert("Updated");

};


/* STATUS */

const toggleStatus = async(id)=>{

if(user?.role !== "Admin") return;

await api.patch(`/gereference/toggle/${id}`);

fetchReferences();

};


/* SEARCH */

const filtered = references.filter((r)=>
r.ge_reference_no.toLowerCase().includes(search.toLowerCase())
);


return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">GE Reference</span>
</h5>

<div className="row mt-3">

{/* TABLE SECTION */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search GE Reference"
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

<form onSubmit={addReference}>

<div className="row">

<div className="col-md-6">

<input
className="form-control"
placeholder="GE Reference No"
name="ge_reference_no"
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
<th>GE Reference</th>
<th>Description</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{filtered.map((r,index)=>(

<tr
key={r.Sno}
onDoubleClick={()=>setSelected(r)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno===r.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{r.ge_reference_no}</td>
<td>{r.description}</td>

<td>

<button
className={`btn btn-sm ${
r.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
disabled={user?.role!=="Admin"}
onClick={()=>toggleStatus(r.Sno)}
>

{r.status}

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

<h6>Edit GE Reference</h6>

<div className="mb-2">

<label>GE Reference</label>

<input
className="form-control"
value={selected.ge_reference_no}
onChange={(e)=>
setSelected({...selected,ge_reference_no:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Description</label>

<input
className="form-control"
value={selected.description || ""}
onChange={(e)=>
setSelected({...selected,description:e.target.value})
}
/>

</div>

<button
className="btn btn-success"
onClick={updateReference}
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