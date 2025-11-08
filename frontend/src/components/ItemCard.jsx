import React from 'react';

export default function ItemCard({ item, onRequest }) {
  const available = item.quantity > 0; 
  const localName = item.name
  ?.toLowerCase()
  .replace(/[\s-]+/g, '_')         
  .replace(/[^a-z0-9_]/g, '');     
 
const src = `/${localName}.jpg`;

 
  return (
    <div className="card-neu p-4 rounded-xl">
      <div className="h-44 w-full rounded-lg overflow-hidden mb-3">
        <img src={`/books.jpg`} alt={item.name} onError={(e)=>{ e.target.onerror=null; e.target.src=`/books.jpg` }} className="object-cover w-full h-full"/>
      </div>
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-muted">{item.category} • {item.condition}</p>
      <p className="text-sm text-muted mt-2 line-clamp-2">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className={`px-3 py-1 rounded-full text-xs ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {available ? `Available (${item.quantity})` : 'Out of stock'}
          </span>
        </div>
        <button onClick={()=>onRequest(item)} disabled={!available} className="btn-soft rounded-lg disabled:opacity-50">Request</button>
      </div>
    </div>
  );
}
