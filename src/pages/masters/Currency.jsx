import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Currency(){

const [currencies,setCurrencies] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
currency_name:"",
currency_code:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

/* FETCH */

const fetchCurrencies = async ()=>{

try{

const res = await api.get("/currency");
setCurrencies(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{
fetchCurrencies();
},[]);


/* HANDLE INPUT */

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


/* ADD */

const addCurrency = async(e)=>{

e.preventDefault();

try{

await api.post("/currency",formData);

setShowForm(false);

setFormData({
currency_name:"",
currency_code:"",
description:""
});

fetchCurrencies();

}catch(err){

alert("Error adding currency");

}

};


/* UPDATE */

const updateCurrency = async()=>{

if(user?.role !== "Admin") return;

await api.put(`/currency/${selected.Sno}`,{
currency_name:selected.currency_name,
currency_code:selected.currency_code,
description:selected.description
});

fetchCurrencies();

alert("Updated");

};


/* STATUS */

const toggleStatus = async(id)=>{

if(user?.role !== "Admin") return;

await api.patch(`/currency/toggle/${id}`);

fetchCurrencies();

};


/* SEARCH */

const filtered = currencies.filter((c)=>
c.currency_name.toLowerCase().includes(search.toLowerCase())
);


return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Currency</span>
</h5>

<div className="row mt-3">

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search currency"
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

<form onSubmit={addCurrency}>

<div className="row">

<div className="col-md-4">

<input
className="form-control"
placeholder="Currency Name"
name="currency_name"
onChange={handleChange}
required
/>

</div>

<div className="col-md-4">

<input
className="form-control"
placeholder="Currency Code"
name="currency_code"
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
<th>Currency</th>
<th>Code</th>
<th>Description</th>
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
backgroundColor:selected?.Sno===c.Sno ? "#f5f5f5":""
}}
>

<td>{index+1}</td>
<td>{c.currency_name}</td>
<td>{c.currency_code}</td>
<td>{c.description}</td>

<td>

<button
className={`btn btn-sm ${
c.status==="Active"
? "btn-success"
: "btn-secondary"
}`}
disabled={user?.role!=="Admin"}
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

{selected &&(

<div className="col-md-5">

<div className="card shadow p-3">

<h6>Edit Currency</h6>

<div className="mb-2">

<label>Currency Name</label>

<input
className="form-control"
value={selected.currency_name}
onChange={(e)=>
setSelected({...selected,currency_name:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Currency Code</label>

<input
className="form-control"
value={selected.currency_code}
onChange={(e)=>
setSelected({...selected,currency_code:e.target.value})
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
onClick={updateCurrency}
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