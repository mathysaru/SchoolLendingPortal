import React, { useEffect, useState } from 'react';
import api from '../api';

function ItemForm({ existing, onSaved, onCancel }){
  const [form, setForm] = useState(existing || { name:'', category:'', condition:'good', quantity:1, images:[], description:'' });

  useEffect(()=> setForm(existing || { name:'', category:'', condition:'good', quantity:1, images:[], description:'' }), [existing]);

  async function save(e){
    e.preventDefault();
    try{
      if (existing) {
        const res = await api.put(`/items/${existing._id}`, form);
        onSaved(res.data);
      } else {
        const res = await api.post('/items', form);
        onSaved(res.data);
      }
    }catch(err){ alert(err?.response?.data?.error || 'Save failed'); }
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <input placeholder="Name" required className="w-full p-2 border rounded" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Category" className="p-2 border rounded" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <select className="p-2 border rounded" value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
          <option value="new">New</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
        </select>
      </div>
      <input type="number" min="0" className="p-2 border rounded w-32" value={form.quantity} onChange={e=>setForm({...form,quantity: Number(e.target.value)})} />
      <input placeholder="Images (comma separated URLs)" className="w-full p-2 border rounded" value={form.images.join(',')} onChange={e=>setForm({...form,images: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
      <textarea placeholder="Description" className="w-full p-2 border rounded" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
        <button className="btn-soft rounded">Save</button>
      </div>
    </form>
  );
}

export default function AdminItems(){
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function load(){ try{ const res = await api.get('/items'); setItems(res.data); }catch(e){ console.error(e);} }

  useEffect(()=>{ load(); }, []);

  async function remove(id){
    if (!confirm('Delete item?')) return;
    await api.delete(`/items/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Admin — Items</h2>
        <button onClick={()=>{ setEditing(null); setShowForm(s=>!s); }} className="btn-soft rounded">Add item</button>
      </div>

      {showForm && <div className="card-neu p-4 rounded mb-4"><ItemForm existing={editing} onSaved={()=>{ setShowForm(false); load(); }} onCancel={()=>setShowForm(false)} /></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(it => (
          <div key={it._id} className="card-neu p-4 rounded flex items-start gap-4">
            <img src={it.images?.[0] || `https://source.unsplash.com/featured/?${encodeURIComponent(it.name)}`} alt="" className="w-28 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{it.name}</h3>
              <p className="text-sm text-gray-500">{it.category} • {it.condition}</p>
              <p className="text-sm mt-1">{it.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>{ setEditing(it); setShowForm(true); }} className="px-3 py-1 border rounded">Edit</button>
              <button onClick={()=>remove(it._id)} className="px-3 py-1 text-red-600 border rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
