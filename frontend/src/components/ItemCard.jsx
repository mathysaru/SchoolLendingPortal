import React from 'react';

export default function ItemCard({ item, onRequest }) {
  const available = item.quantity > 0;
  return (
    <div className="card-neu p-4 rounded-xl">
      <div className="h-44 w-full rounded-lg overflow-hidden mb-3">
        <img src={item.images?.[0] || `https://source.unsplash.com/featured/?${encodeURIComponent(item.name)}`} alt={item.name} className="object-cover w-full h-full"/>
      </div>
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p className="text-sm text-gray-500">{item.category} • {item.condition}</p>
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
