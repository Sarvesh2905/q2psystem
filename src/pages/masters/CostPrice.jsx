import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function CostPrice(){

const [costPrices,setCostPrices] = useState([]);
const [products,setProducts] = useState([]);
const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
product_id:"",
cost_price:"",
currency:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

/* FETCH COST PRICE */

const fetchCostPrices = async ()=>{

try{

const res = await api.get("/costprice");
setCostPrices(res.data);

}catch(err){
console.log(err);
}

};

/* FETCH PRODUCTS */

const fetchProducts = async ()=>{

try{

const res = await api.get("/products");
setProducts(res.data);

}catch(err){
console.log(err);
}

};

useEffect(()=>{

fetchCostPrices();
fetchProducts();

},[]);

/* HANDLE INPUT */

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};

/* ADD COST PRICE */

const addCostPrice = async(e)=>{

e.preventDefault();

try{

await api.post("/costprice",formData);

setShowForm(false);

setFormData({
product_id:"",
cost_price:"",
currency:"",
description:""
});

fetchCostPrices();

}catch(err){

alert("Error adding cost price");

}

};

/* UPDATE */

const updateCostPrice = async()=>{

if(user?.role !== "Admin") return;

await api.put(`/costprice/${selected.Sno}`,{
cost_price:selected.cost_price,
currency:selected.currency,
description:selected.description
});

fetchCostPrices();

alert("Updated");

};

/* STATUS */

const toggleStatus = async(id)=>{

if(user?.role !== "Admin") return;

await api.patch(`/costprice/toggle/${id}`);

fetchCostPrices();

};

/* SEARCH */

const filtered = costPrices.filter((c)=>
c.product_name?.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Cost Price</span>
</h5>

<div className="row mt-3">

{/* TABLE AREA */}

<div className={selected ? "col-md-7" : "col-md-12"}>

<div className="d-flex justify-content-between mb-3">

<input
type="text"
className="form-control w-50"
placeholder="Search product"
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

<form onSubmit={addCostPrice}>

<div className="row">

<div className="col-md-3">

<select
className="form-control"
name="product_id"
onChange={handleChange}
required
>

<option value="">Select Product</option>

{products.map((p)=>(
<option key={p.Sno} value={p.Sno}>
{p.product_name}
</option>
))}

</select>

</div>

<div className="col-md-3">

<input
type="number"
className="form-control"
placeholder="Cost Price"
name="cost_price"
onChange={handleChange}
required
/>

</div>

<div className="col-md-2">

<input
className="form-control"
placeholder="Currency"
name="currency"
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
<th>Product</th>
<th>Cost Price</th>
<th>Currency</th>
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
<td>{c.product_name}</td>
<td>{c.cost_price}</td>
<td>{c.currency}</td>
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

{selected && (

<div className="col-md-5">

<div className="card shadow p-3">

<h6>Edit Cost Price</h6>

<div className="mb-2">

<label>Product</label>

<input
className="form-control"
value={selected.product_name}
disabled
/>

</div>

<div className="mb-2">

<label>Cost Price</label>

<input
type="number"
className="form-control"
value={selected.cost_price}
onChange={(e)=>
setSelected({...selected,cost_price:e.target.value})
}
/>

</div>

<div className="mb-2">

<label>Currency</label>

<input
className="form-control"
value={selected.currency || ""}
onChange={(e)=>
setSelected({...selected,currency:e.target.value})
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
onClick={updateCostPrice}
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