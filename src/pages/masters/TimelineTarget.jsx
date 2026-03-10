import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function TimelineTarget(){

const [timelines,setTimelines] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
timeline_name:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

const fetchTimelines = async ()=>{

try{

const res = await api.get("/timelinetarget");
setTimelines(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchTimelines();
},[]);

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};

const addTimeline = async(e)=>{

e.preventDefault();

try{

await api.post("/timelinetarget",formData);

setShowForm(false);

setFormData({
timeline_name:"",
description:""
});

fetchTimelines();

}catch(err){

alert("Error adding timeline");

}

};

const updateTimeline = async()=>{

if(user.role !== "Admin") return;

await api.put(`/timelinetarget/${selected.Sno}`,{
timeline_name:selected.timeline_name,
description:selected.description
});

fetchTimelines();

alert("Updated");

};

const toggleStatus = async(id)=>{

if(user.role !== "Admin") return;

await api.patch(`/timelinetarget/toggle/${id}`);

fetchTimelines();

};

const filtered = timelines.filter((t)=>
t.timeline_name.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Timeline Target</span>
</h5>

<div className="row mt-3">

{/* TABLE AREA */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search timeline"
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

<form onSubmit={addTimeline}>

<div className="row">

<div className="col-md-6">

<input
className="form-control"
placeholder="Timeline Name"
name="timeline_name"
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
<th>Timeline</th>
<th>Description</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((t,index)=>(
<tr
key={t.Sno}
title="Double click to edit"
onDoubleClick={()=>setSelected(t)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno===t.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{t.timeline_name}</td>
<td>{t.description}</td>

<td>

<button
className={`btn btn-sm ${
t.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
onClick={()=>toggleStatus(t.Sno)}
disabled={user.role!=="Admin"}
>

{t.status}

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

<h6>Edit Timeline</h6>

<div className="mb-2">

<label>Timeline Name</label>

<input
className="form-control"
value={selected.timeline_name}
onChange={(e)=>
setSelected({...selected, timeline_name:e.target.value})
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
onClick={updateTimeline}
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