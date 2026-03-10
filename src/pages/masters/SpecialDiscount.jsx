import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function SpecialDiscount(){

const [discounts,setDiscounts] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
special_discount_name:"",
discount_percentage:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

const fetchDiscounts = async ()=>{

try{

const res = await api.get("/specialdiscount");
setDiscounts(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchDiscounts();
},[]);

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};

const addDiscount = async(e)=>{

e.preventDefault();

try{

await api.post("/specialdiscount",formData);

setShowForm(false);

setFormData({
special_discount_name:"",
discount_percentage:"",
description:""
});

fetchDiscounts();

}catch(err){

alert("Error adding special discount");

}

};

const updateDiscount = async()=>{

if(user.role !== "Admin") return;

await api.put(`/specialdiscount/${selected.Sno}`,{
special_discount_name:selected.special_discount_name,
discount_percentage:selected.discount_percentage,
description:selected.description
});

fetchDiscounts();

alert("Updated");

};

const toggleStatus = async(id)=>{

if(user.role !== "Admin") return;

await api.patch(`/specialdiscount/toggle/${id}`);

fetchDiscounts();

};

const filtered = discounts.filter((d)=>
d.special_discount_name.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Special Discount</span>
</h5>

<div className="row mt-3">

{/* TABLE AREA */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search special discount"
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

<form onSubmit={addDiscount}>

<div className="row">

<div className="col-md-4">

<input
className="form-control"
placeholder="Special Discount Name"
name="special_discount_name"
onChange={handleChange}
required
/>

</div>

<div className="col-md-4">

<input
type="number"
className="form-control"
placeholder="Discount %"
name="discount_percentage"
onChange={handleChange}
required
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
<th>Special Discount</th>
<th>Percentage</th>
<th>Description</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((d,index)=>(
<tr
key={d.Sno}
title="Double click to edit"
onDoubleClick={()=>setSelected(d)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno===d.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{d.special_discount_name}</td>
<td>{d.discount_percentage}%</td>
<td>{d.description}</td>

<td>

<button
className={`btn btn-sm ${
d.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
onClick={()=>toggleStatus(d.Sno)}
disabled={user?.role!=="Admin"}
>

{d.status}

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

<h6>Edit Special Discount</h6>

<div className="mb-2">

<label>Special Discount Name</label>

<input
className="form-control"
value={selected.special_discount_name}
onChange={(e)=>
setSelected({...selected,special_discount_name:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Percentage</label>

<input
type="number"
className="form-control"
value={selected.discount_percentage}
onChange={(e)=>
setSelected({...selected,discount_percentage:e.target.value})
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
onClick={updateDiscount}
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