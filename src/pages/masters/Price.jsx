import { useEffect, useState } from "react";
import NavbarPrivate from "../../components/NavbarPrivate";
import api from "../../services/api";

export default function Price(){

const [prices,setPrices] = useState([]);
const [products,setProducts] = useState([]);
const [costPrices,setCostPrices] = useState([]);
const [discounts,setDiscounts] = useState([]);
const [specialDiscounts,setSpecialDiscounts] = useState([]);

const [search,setSearch] = useState("");
const [selected,setSelected] = useState(null);
const [showForm,setShowForm] = useState(false);

const [formData,setFormData] = useState({
product_id:"",
cost_price_id:"",
discount_id:"",
special_discount_id:"",
selling_price:"",
currency:"",
description:""
});

const user = JSON.parse(localStorage.getItem("user"));

/* FETCH DATA */

const fetchPrices = async ()=>{
const res = await api.get("/price");
setPrices(res.data);
};

const fetchProducts = async ()=>{
const res = await api.get("/products");
setProducts(res.data);
};

const fetchCostPrices = async ()=>{
const res = await api.get("/costprice");
setCostPrices(res.data);
};

const fetchDiscounts = async ()=>{
const res = await api.get("/discount");
setDiscounts(res.data);
};

const fetchSpecialDiscounts = async ()=>{
const res = await api.get("/specialdiscount");
setSpecialDiscounts(res.data);
};

useEffect(()=>{
fetchPrices();
fetchProducts();
fetchCostPrices();
fetchDiscounts();
fetchSpecialDiscounts();
},[]);

/* HANDLE INPUT */

const handleChange = (e)=>{
setFormData({
...formData,
[e.target.name]:e.target.value
});
};

/* ADD PRICE */

const addPrice = async(e)=>{

e.preventDefault();

await api.post("/price",formData);

setShowForm(false);

setFormData({
product_id:"",
cost_price_id:"",
discount_id:"",
special_discount_id:"",
selling_price:"",
currency:"",
description:""
});

fetchPrices();

};

/* UPDATE */

const updatePrice = async ()=>{

if(user?.role !== "Admin") return;

await api.put(`/price/${selected.Sno}`,{
selling_price:selected.selling_price,
currency:selected.currency,
description:selected.description
});

fetchPrices();

alert("Updated");

};

/* STATUS */

const toggleStatus = async(id)=>{

if(user?.role !== "Admin") return;

await api.patch(`/price/toggle/${id}`);

fetchPrices();

};

/* SEARCH */

const filtered = prices.filter((p)=>
p.product_name?.toLowerCase().includes(search.toLowerCase())
);

return(

<>

<NavbarPrivate/>

<div className="container-fluid mt-4">

<h5>
Masters / <span className="text-primary">Price</span>
</h5>

<div className="row mt-3">

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

<form onSubmit={addPrice}>

<div className="row g-2">

<div className="col-md-3">

<select
className="form-control"
name="product_id"
onChange={handleChange}
required
>
<option value="">Product</option>

{products.map((p)=>(
<option key={p.Sno} value={p.Sno}>
{p.product_name}
</option>
))}

</select>

</div>

<div className="col-md-3">

<select
className="form-control"
name="cost_price_id"
onChange={handleChange}
required
>

<option value="">Cost Price</option>

{costPrices.map((c)=>(
<option key={c.Sno} value={c.Sno}>
{c.cost_price}
</option>
))}

</select>

</div>

<div className="col-md-2">

<select
className="form-control"
name="discount_id"
onChange={handleChange}
>

<option value="">Discount</option>

{discounts.map((d)=>(
<option key={d.Sno} value={d.Sno}>
{d.discount_name}
</option>
))}

</select>

</div>

<div className="col-md-2">

<select
className="form-control"
name="special_discount_id"
onChange={handleChange}
>

<option value="">Special Discount</option>

{specialDiscounts.map((sd)=>(
<option key={sd.Sno} value={sd.Sno}>
{sd.special_discount_name}
</option>
))}

</select>

</div>

<div className="col-md-2">

<input
type="number"
className="form-control"
placeholder="Selling Price"
name="selling_price"
onChange={handleChange}
required
/>

</div>

<div className="col-md-2 mt-2">

<input
className="form-control"
placeholder="Currency"
name="currency"
onChange={handleChange}
/>

</div>

<div className="col-md-4 mt-2">

<input
className="form-control"
placeholder="Description"
name="description"
onChange={handleChange}
/>

</div>

</div>

<button className="btn btn-success mt-3">
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
<th>Cost</th>
<th>Discount</th>
<th>Special</th>
<th>Selling Price</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{filtered.map((p,index)=>(
<tr
key={p.Sno}
onDoubleClick={()=>setSelected(p)}
style={{
cursor:"pointer",
backgroundColor:selected?.Sno === p.Sno ? "#f5f5f5" : ""
}}
>

<td>{index+1}</td>
<td>{p.product_name}</td>
<td>{p.cost_price}</td>
<td>{p.discount_name}</td>
<td>{p.special_discount_name}</td>
<td>{p.selling_price}</td>

<td>

<button
className={`btn btn-sm ${
p.status === "Active"
? "btn-success"
: "btn-secondary"
}`}
disabled={user?.role !== "Admin"}
onClick={()=>toggleStatus(p.Sno)}
>

{p.status}

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

<h6>Edit Price</h6>

<div className="mb-2">

<label>Product</label>

<input
className="form-control"
value={selected.product_name}
disabled
/>

</div>

<div className="mb-2">

<label>Selling Price</label>

<input
type="number"
className="form-control"
value={selected.selling_price}
onChange={(e)=>
setSelected({...selected,selling_price:e.target.value})
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
onClick={updatePrice}
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