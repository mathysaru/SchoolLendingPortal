import React, { useEffect, useState } from 'react';
import api from '../api';
import ItemCard from '../components/ItemCard';
import BookingModal from '../components/BookingModal';

export default function Home(){
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load(){
    try{
      const res = await api.get('/items');
      setItems(res.data);
    }catch(e){ console.error(e); }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-semibold">Borrow Equipment — Fast & Simple</h1>
        <p className="text-gray-600">Find cameras, lab kits, musical instruments and more. Request for specific dates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(it => <ItemCard key={it._id} item={it} onRequest={(i)=>setSelected(i)} />)}
      </div>

      {selected && <BookingModal item={selected} onClose={()=>setSelected(null)} onCreated={()=>{ setSelected(null); load(); }} />}
    </div>
  );
}
