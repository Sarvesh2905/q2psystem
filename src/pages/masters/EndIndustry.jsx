import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function EndIndustry(){

const [industries,setIndustries] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
industry_name:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

const fetchIndustries = async ()=>{

try{

const res = await api.get("/endindustry");
setIndustries(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchIndustries();
},[]);

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};

const addIndustry = async(e)=>{

e.preventDefault();

try{

await api.post("/endindustry",formData);

setShowForm(false);

setFormData({
industry_name:"",
description:""
});

fetchIndustries();

}catch(err){

alert("Error adding industry");

}

};

const updateIndustry = async()=>{

if(user.role !== "Admin") return;

await api.put(`/endindustry/${selected.Sno}`,{
industry_name:selected.industry_name,
description:selected.description
});

fetchIndustries();
alert("Updated");

};

const toggleStatus = async(id)=>{

if(user.role !== "Admin") return;

await api.patch(`/endindustry/toggle/${id}`);
fetchIndustries();

};

const filtered = industries.filter((i)=>
i.industry_name.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">End Industry</span>
</h5>

<div className="row mt-3">

{/* LEFT SIDE TABLE */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search industry"
onChange={(e)=>setSearch(e.target.value)}
/>

{user.role==="Admin" &&(

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

<form onSubmit={addIndustry}>

<div className="row">

<div className="col-md-6">

<input
className="form-control"
placeholder="Industry Name"
name="industry_name"
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
<th>Industry</th>
<th>Description</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{filtered.map((i,index)=>(
<tr
key={i.Sno}
title="Double click to edit"
onDoubleClick={()=>setSelected(i)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno===i.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{i.industry_name}</td>
<td>{i.description}</td>

<td>

<button
className={`btn btn-sm ${
i.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
onClick={()=>toggleStatus(i.Sno)}
disabled={user.role!=="Admin"}
>

{i.status}

</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

{/* RIGHT SIDE EDIT PANEL */}

{selected && (

<div className="col-md-5">

<div className="card shadow p-3">

<h6>Edit Industry</h6>

<div className="mb-2">

<label>Industry Name</label>

<input
className="form-control"
value={selected.industry_name}
onChange={(e)=>
setSelected({...selected, industry_name:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Description</label>

<input
className="form-control"
value={selected.description || ""}
onChange={(e)=>
setSelected({...selected, description:e.target.value})
}
/>

</div>

<button
className="btn btn-success"
onClick={updateIndustry}
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